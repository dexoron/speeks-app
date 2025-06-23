import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../AuthContext";
import axios from "axios";

interface UserInfo {
    id: string;
    username: string;
    email?: string;
    avatar?: string;
}

export default function FriendsList() {
    const { accessToken, user } = useAuth();
    const [friends, setFriends] = useState<any[]>([]);
    const [users, setUsers] = useState<Record<string, UserInfo>>({});

    useEffect(() => {
        if (!accessToken) return;
        axios.get("http://127.0.0.1:8000/auth/friends", {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then(res => setFriends(res.data))
            .catch(() => setFriends([]));
    }, [accessToken]);

    useEffect(() => {
        if (!user?.id || friends.length === 0 || !accessToken) return;
        // Получаем id всех друзей
        const friendIds = friends.map(f => f.requester_id === user.id ? f.addressee_id : f.requester_id);
        // Для каждого id делаем запрос, если ещё не загружен
        friendIds.forEach(id => {
            if (!users[id]) {
                axios.get(`http://127.0.0.1:8000/auth/users/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                    .then(res => setUsers(prev => ({ ...prev, [id]: res.data })))
                    .catch(() => {});
            }
        });
    }, [friends, user, accessToken]);

    // Получаем свой id
    const myId = user?.id;

    return (
        <div className="flex-1 p-[8px] gap-[8px] flex flex-col bg-white/10 overflow-auto min-w-[220px] max-w-[260px] rounded-[8px]">
            <button className="w-full h-[32px] bg-white/10 rounded-[8px] cursor-pointer text-white/50">
                Найти беседу
            </button>
            <span className="h-[2px] rounded-full w-full bg-white/50" />

            <div className="w-full flex">
                <Link className="rounded-[8px] transition hover:bg-white/10 w-full p-[8px] text-white/50" to="/me"><FontAwesomeIcon icon={faUser} className="mr-[4px]" /> Друзья</Link>
            </div>
            <span className="h-[2px] rounded-full w-full bg-white/50" />

            <ul className="space-y-2">
                {friends.map((f) => {
                    let friendId = f.requester_id === myId ? f.addressee_id : f.requester_id;
                    const friend = users[friendId];
                    const avatarUrl = `http://127.0.0.1:8000/auth/avatars/${friendId}`;
                    return (
                        <li key={f.id}>
                            <Link to={`/me/${friendId}`} className="flex items-center gap-[8px] px-[8px] py-[4px] rounded-[8px] hover:bg-white/10 transition">
                                <div className="">
                                    <img className="w-10 h-10 rounded-full object-cover" src={avatarUrl} alt={friend?.username || friendId} />
                                </div>
                                <div>
                                    <div className="font-semibold">{friend?.username || friendId}</div>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
