import { useParams } from "react-router";
import { useAuth } from "../../../AuthContext";
import { useEffect, useRef, useState } from "react";

interface Message {
  text: string;
  is_self: boolean;
  sender_id: string;
}

export default function Chat() {
  const { id } = useParams();
  const { accessToken, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id || !accessToken) return;
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${id}`);
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", jwt_token: accessToken }));
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text !== undefined) {
          setMessages((prev) => [...prev, data]);
        }
      } catch {}
    };
    ws.onclose = () => {};
    return () => {
      ws.close();
    };
  }, [id, accessToken]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current) return;
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
        />
        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white rounded px-4 py-2 transition">
          Отправить
        </button>
      </form>
    </div>
  );
}
