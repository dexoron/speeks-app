import { Link } from "react-router";
import { useAuth } from "../../AuthContext";
import { useState, useEffect } from "react";
import { faComment, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const TABS = [
  { key: "friends", label: "Друзья" },
  { key: "requests", label: "Запросы в друзья" },
  { key: "add", label: "Добавить в друзья" },
];

export default function Me() {
    const [activeTab, setActiveTab] = useState("friends");
    const { accessToken, user } = useAuth();
    const [friends, setFriends] = useState<any[]>([]);
    const [openSettings, setOpenSettings] = useState<string | null>(null);
    useEffect(() => {
        if (!accessToken) return;
        axios.get("http://127.0.0.1:8000/auth/friends", {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then(res => {
                // Фильтруем только accepted
                const accepted = res.data.filter((f: any) => f.status === "accepted");
                setFriends(accepted);
            })
            .catch(() => setFriends([]));
    }, [accessToken]);
    const handleDeleteFriend = async (friendId: string) => {
        if (!window.confirm("Вы уверены, что хотите удалить этого друга?")) return;
        if (!accessToken) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/auth/friends/${friendId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setFriends(friends => friends.filter(f => f.id !== friendId));
        } catch (e) {
            alert("Ошибка при удалении друга");
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
                    {friends.map(f => (
                      <li key={f.id} className="flex items-center gap-2 justify-between relative">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{f.id}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/me/${f.id}`} className="w-[42px] h-[42px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-[8px] text-white/50 transition cursor-pointer"><FontAwesomeIcon icon={faComment} /></Link>
                          <button
                            className="w-[42px] h-[42px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-[8px] text-white/50 transition cursor-pointer"
                            onClick={() => setOpenSettings(openSettings === f.id ? null : f.id)}
                          >
                            <FontAwesomeIcon icon={faEllipsis} />
                          </button>
                          {openSettings === f.id && (
                            <div className="absolute right-0 top-12 z-10 bg-white/10 border border-white/10 rounded shadow-lg flex flex-col min-w-[120px]">
                              <Link
                                to={`/me/${f.id}`}
                                className="px-4 py-2 text-left hover:bg-white/10 transition text-white"
                                onClick={() => setOpenSettings(null)}
                              >Чат</Link>
                              <button
                                className="px-4 py-2 text-left hover:bg-red-500/20 transition text-red-400"
                                onClick={() => { handleDeleteFriend(f.id); setOpenSettings(null); }}
                              >Удалить</button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "requests" && (
                <div>Здесь будут запросы в друзья</div>
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
                        await axios.post("http://127.0.0.1:8000/auth/friends/request", { addressee_id }, {
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
