import { useParams } from "react-router";
import { useAuth } from "../../../AuthContext";
import { useEffect, useRef, useState, useCallback } from "react";

interface Message {
  id?: string;
  text: string;
  is_self: boolean;
  sender_id: string;
}

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
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white/10 rounded-[8px] p-4">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${msg.is_self ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[70%] ${msg.is_self ? "bg-sky-500/80 text-white" : "bg-white/80 text-black"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 rounded p-2 bg-white/20 text-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          disabled={connecting || !!wsError}
        />
        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white rounded px-4 py-2 transition" disabled={connecting || !!wsError}>
          Отправить
        </button>
      </form>
      {connecting && <div className="text-xs text-gray-400 mt-2">Подключение...</div>}
      {wsError && <div className="text-xs text-red-500 mt-2">{wsError}</div>}
    </div>
  );
}
