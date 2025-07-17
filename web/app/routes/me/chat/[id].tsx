import { useParams } from "react-router";
import { useAuth } from "../../../AuthContext";
import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from 'react-markdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCirclePlus,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { faCopy } from '@fortawesome/free-solid-svg-icons';


interface Message {
  id?: string;
  text: string;
  is_self: boolean;
  sender_id: string;
}

// Функция для преобразования -# subtext в markdown (заменяет -# text на <subtext>text</subtext>)
function preprocessDiscordMarkdown(text: string) {
  // Заменяем -# на _subtext_ (курсив) или можно кастомно обработать в компоненте
  return text.replace(/^-# (.*)$/gim, '_$1_');
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="absolute top-2 right-2 bg-transparent text-white text-lg cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }}
      title="Скопировать"
      type="button"
    >
      <FontAwesomeIcon icon={faCopy} />
      {copied && <span className="ml-2 text-xs">Скопировано!</span>}
    </button>
  );
}

const Spoiler = ({ children }: { children: React.ReactNode }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      className={`spoiler inline-block bg-[#5865f2] text-transparent rounded cursor-pointer px-1 transition-colors duration-200 select-none ${revealed ? 'text-white' : ''}`}
      onClick={() => setRevealed(v => !v)}
      title={revealed ? '' : 'Показать спойлер'}
    >
      {children}
    </span>
  );
};

export default function Chat() {
  const { id } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const [friend, setFriend] = useState<{ username: string; avatarUrl: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Получение username друга по id
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/auth/user/${id}/username`);
        if (!cancelled) {
          setFriend({
            username: res.data.username,
            avatarUrl: `http://127.0.0.1:8000/auth/avatars/${id}`
          });
        }
      } catch {
        if (!cancelled) setFriend(null);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Функция для подключения к WebSocket
  const connectWS = useCallback(() => {
    if (!id) return;
    setConnecting(true);
    setWsError(null);
    const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws/chat/${id}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnecting(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text !== undefined) {
          // Фильтрация системных сообщений Online/Offline
          if (/^\(ID: .+\) (Online|Offline)\.?$/.test(data.text)) {
            // Только в консоль
            console.log(data.text, data);
            return;
          }
          setMessages((prev) => [...prev, data]);
        }
      } catch (e) {
        // Можно добавить обработку некорректных сообщений
      }
    };

    ws.onerror = () => {
      setWsError("Ошибка WebSocket соединения");
    };

    ws.onclose = () => {
      setConnecting(false);
      setWsError("WebSocket соединение закрыто. Переподключение...");
      // Переподключение через 2 секунды
      reconnectTimeout.current = setTimeout(() => {
        connectWS();
      }, 2000);
    };
  }, [id]);

  // Подключение к WebSocket
  useEffect(() => {
    connectWS();
    return () => {
      wsRef.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connectWS]);

  // Скролл к последнему сообщению
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Отправка сообщения
  const sendMessage = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = '42px';
    }
  };

  // Обработка клавиш в textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
    // Shift+Enter — стандартное поведение (новая строка)
  };

  // Функция для автоувеличения textarea
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = '42px'; // сброс
    textarea.style.height = Math.min(textarea.scrollHeight, 240) + 'px';
  };

  return (
    <div className="flex flex-col h-full bg-white/10 rounded-[8px] p-2">
      <div className="flex-1 overflow-y-auto flex flex-col justify-end gap-2">
        <div className="flex flex-col gap-[8px]">
          <img src={friend?.avatarUrl} className="w-[64px] h-[64px] rounded-full" />
          <span className="text-2xl font-bold">{friend?.username}</span>
          <span>Это начало истории ваших личных сообщений с <span className="font-bold">{friend?.username}</span>.</span>
        </div>
        {messages.map((msg, idx) => {
          const isSelf = msg.is_self;
          const avatarUrl = isSelf
            ? (user?.id ? `http://127.0.0.1:8000/auth/avatars/${user.id}` : undefined)
            : friend?.avatarUrl;
          const username = isSelf ? user?.username : friend?.username;
          return (
            <div
              key={idx}
              className="flex justify-start w-full max-w-[500px] gap-[8px]"
            >
              <img src={avatarUrl} className="h-[42px] w-[42px] rounded-full" />
              <div className="flex flex-col">
                <span className="font-bold">{username}</span>
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="whitespace-pre-line break-words" {...props} />, // убрана обработка спойлера
                    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />, // жирный
                    em: ({ node, ...props }) => <em className="italic" {...props} />, // курсив
                    del: ({ node, ...props }) => <del className="line-through" {...props} />, // зачёркнутый
                    code: (props: any) => {
                      const { inline, className = '', children, ...rest } = props;
                      const match = /language-(\w+)/.exec(className);
                      const codeString = String(children).replace(/\n$/, '');
                      // Многострочный код — с подсветкой и кнопкой копировать
                      return (
                        <div className="relative my-2">
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match ? match[1] : undefined}
                            PreTag="div"
                            className="rounded-lg text-sm !bg-[#23272a] !p-4"
                            customStyle={{ background: '#23272a', borderRadius: '8px', padding: '1em' }}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                          <CopyButton text={codeString} />
                        </div>
                      );
                    },
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-400 pl-4 text-gray-400 italic my-2" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-2 mb-1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-2 mb-1" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
                    // @ts-ignore
                    subtext: ({ node, ...props }) => <span className="text-xs text-gray-400" {...props} />,
                  }}
                  // @ts-ignore
                  skipHtml={false}
                >
                  {preprocessDiscordMarkdown(msg.text)}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex bg-white/10 gap-[4px] rounded-[8px] text-white/50">
        <button type="button" className="h-[42px] w-[42px] cursor-pointer">
          <FontAwesomeIcon icon={faCirclePlus} />
        </button>
        <textarea
          ref={textareaRef}
          className="flex-1 text-white resize-none h-[42px] max-h-[240px] rounded p-2 bg-transparent outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={`Написать ${friend?.username || "..."}`}
          disabled={connecting || !!wsError}
        />
        <button type="submit" className="h-[42px] w-[42px] cursor-pointer" disabled={connecting || !!wsError}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
      {connecting && <div className="text-xs text-gray-400 mt-2">Подключение...</div>}
      {wsError && <div className="text-xs text-red-500 mt-2">{wsError}</div>}
    </div>
  );
}
