import { Link } from "react-router";
import { useAuth } from "../../AuthContext";
import { useState, useEffect } from "react";
import { faComment, faEllipsis, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const TABS = [
  { key: "friends", label: "Друзья" },
  { key: "requests", label: "Запросы в друзья" },
  { key: "add", label: "Добавить в друзья" },
];

const Spoiler = ({ children }: { children: React.ReactNode }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      className={`spoiler${revealed ? ' revealed' : ''}`}
      onClick={() => setRevealed(v => !v)}
    >
      {children}
    </span>
  );
};

function preprocessDiscordMarkdown(text: string) {
  // Спойлеры: ||текст||
  text = text.replace(/\|\|(.+?)\|\|/g, '<spoiler>$1</spoiler>');
  // Subtext: -#
  text = text.replace(/^\-# (.*)$/gim, '_$1_');
  return text;
}

export default function Me() {
  const [activeTab, setActiveTab] = useState("friends");
  const { accessToken, user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [openSettings, setOpenSettings] = useState<string | null>(null);
  const [usernames, setUsernames] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    if (!accessToken) return;
    axios.get("/api/auth/friends", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => {
        // Фильтруем только accepted
        const accepted = res.data.filter((f: any) => f.status === "accepted");
        setFriends(accepted);
      })
      .catch(() => setFriends([]));
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    axios.get("/api/auth/friends/requests", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => setRequests(res.data))
      .catch(() => setRequests([]));
  }, [accessToken]);

  // Получение username по uuid
  const fetchUsername = async (id: string) => {
    if (usernames[id]) return;
    try {
      const res = await axios.get(`/api/auth/user/${id}/username`);
      setUsernames(prev => ({ ...prev, [id]: res.data.username }));
    } catch { }
  };

  // В useEffect загружаем username для всех друзей
  useEffect(() => {
    friends.forEach(f => {
      const friendId = user && f.requester_id === user.id ? f.addressee_id : f.requester_id;
      fetchUsername(friendId);
    });
    requests.forEach(r => {
      const id1 = r.requester_id;
      const id2 = r.addressee_id;
      fetchUsername(id1);
      fetchUsername(id2);
    });
  }, [friends, requests, user]);

  const handleDeleteFriend = async (friendId: string) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого друга?")) return;
    if (!accessToken) return;
    try {
      await axios.delete(`/api/auth/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setFriends(friends => friends.filter(f => f.id !== friendId));
    } catch (e) {
      alert("Ошибка при удалении друга");
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    if (!accessToken) return;
    try {
      await axios.post(`/api/auth/friends/respond/${friendshipId}`, true, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setRequests(reqs => reqs.filter(r => r.id !== friendshipId));
    } catch (e) {
      alert("Ошибка при принятии заявки");
    }
  };

  return (
    <div className="flex flex-col h-full gap-[8px]">
      <div className="bg-white/10 flex flex-row items-center p-[8px] gap-[8px] rounded-[8px]">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={
              "p-[8px] rounded-[8px] cursor-pointer transition " +
              (activeTab === tab.key ? "bg-white/10" : "hover:bg-white/10")
            }
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 bg-white/10 p-[8px] rounded-[8px]">
        {activeTab === "friends" && (
          <div>
            <ul className="flex flex-col gap-2">
              {friends.map(f => {
                const friendId = user && f.requester_id === user.id ? f.addressee_id : f.requester_id;
                return (
                  <li key={f.id} className="flex items-center gap-2 justify-between relative">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 flex-shrink-0">
                        <img className="w-10 h-10 rounded-full object-cover" src={"/api/auth/avatars/" + friendId} alt={usernames[friendId] || friendId} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{usernames[friendId] || friendId}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/me/${friendId}`} className="w-[42px] h-[42px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-[8px] text-white/50 transition cursor-pointer"><FontAwesomeIcon icon={faComment} /></Link>
                      <button
                        className="w-[42px] h-[42px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-[8px] text-white/50 transition cursor-pointer"
                        onClick={() => setOpenSettings(openSettings === f.id ? null : f.id)}
                      >
                        <FontAwesomeIcon icon={faEllipsis} />
                      </button>
                      {openSettings === f.id && (
                        <div className="absolute right-0 top-12 z-10 bg-white/10 border border-white/10 rounded shadow-lg flex flex-col min-w-[120px]">
                          <Link
                            to={`/me/${friendId}`}
                            className="px-4 py-2 text-left hover:bg-white/10 transition text-white"
                            onClick={() => setOpenSettings(null)}
                          >Чат</Link>
                          <button
                            className="px-4 py-2 text-left hover:bg-red-500/20 transition text-red-400"
                            onClick={() => { handleDeleteFriend(friendId); setOpenSettings(null); }}
                          >Удалить</button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {activeTab === "requests" && (
          <div>
            <ul className="flex flex-col gap-2">
              {requests.length === 0 && <li className="text-white/50">Нет заявок</li>}
              {requests.filter(r => user && (r.addressee_id === user.id || r.requester_id === user.id)).map(r => {
                const isAddressee = user && r.addressee_id === user.id;
                const isRequester = user && r.requester_id === user.id;
                return (
                  <li key={r.id} className="flex items-center gap-2 justify-between relative bg-white/5 rounded p-2">
                    <span className="font-semibold">{usernames[isAddressee ? r.requester_id : r.addressee_id] || (isAddressee ? r.requester_id : r.addressee_id)}</span>
                    <div className="flex gap-2">
                      {isAddressee && (
                        <>
                          <button
                            className="w-8 h-8 flex items-center justify-center bg-green-500/30 hover:bg-green-500/60 rounded-full text-green-300 hover:text-green-100 transition"
                            title="Принять"
                            onClick={() => handleAcceptRequest(r.id)}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="w-8 h-8 flex items-center justify-center bg-red-500/30 hover:bg-red-500/60 rounded-full text-red-300 hover:text-red-100 transition"
                            title="Отклонить"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      )}
                      {isRequester && (
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-red-500/30 hover:bg-red-500/60 rounded-full text-red-300 hover:text-red-100 transition"
                          title="Отменить (не реализовано)"
                          disabled
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {activeTab === "add" && (
          <div className="flex flex-col gap-4 max-w-xs mx-auto mt-8">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem("addressee_id") as HTMLInputElement;
                const addressee_id = input.value.trim();
                if (!addressee_id) return;
                try {
                  await axios.post("/api/auth/friends/request", { addressee_id }, {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${accessToken}`,
                    },
                  });
                  input.value = "";
                  alert("Заявка отправлена!");
                } catch (e) {
                  alert("Ошибка при отправке заявки в друзья");
                }
              }}
            >
              <label className="block mb-2 text-white/70" htmlFor="addressee_id">ID пользователя для добавления в друзья</label>
              <input
                type="text"
                name="addressee_id"
                id="addressee_id"
                className="w-full p-2 rounded bg-white/10 text-white mb-2"
                placeholder="Введите UUID пользователя"
              />
              <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded p-2 transition">Добавить в друзья</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
