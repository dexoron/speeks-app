import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { API_BASE } from "~/api";
import Me from "../routes/me/me";

interface UserInfo {
    id: string;
    username: string;
    email?: string;
    avatar?: string;
}

export default function FriendsList({ isMobile = false }) {
    const location = useLocation();
    const { accessToken, user } = useAuth();
    const [friends, setFriends] = useState<any[]>([]);
    const [users, setUsers] = useState<Record<string, UserInfo>>({});
    const [usernames, setUsernames] = useState<{ [id: string]: string }>({});
    const [isNarrow, setIsNarrow] = useState(false);

    useEffect(() => {
        if (!accessToken) return;
        axios.get(`${API_BASE}/auth/friends`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then(res => setFriends(res.data))
            .catch(() => setFriends([]));
    }, [accessToken]);

    // Определяем мобильную ширину (< md)
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(max-width: 767.98px)');
        const update = () => setIsNarrow(mq.matches);
        update();
        if (mq.addEventListener) mq.addEventListener('change', update);
        else if ((mq as any).addListener) (mq as any).addListener(update);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', update);
            else if ((mq as any).removeListener) (mq as any).removeListener(update);
        };
    }, []);

    useEffect(() => {
        if (!user?.id || friends.length === 0 || !accessToken) return;
        // Получаем id всех друзей
        const friendIds = friends.map(f => f.requester_id === user.id ? f.addressee_id : f.requester_id);
        // В useEffect загружаем username для всех друзей
        friendIds.forEach(id => {
            fetchUsername(id);
        });
    }, [friends, user, accessToken]);

    // Получаем свой id
    const myId = user?.id;

    // Получение username по uuid
    const fetchUsername = async (id: string) => {
        if (usernames[id]) return;
        try {
            const res = await axios.get(`${API_BASE}/auth/user/${id}/username`);
            setUsernames(prev => ({ ...prev, [id]: res.data.username }));
        } catch { }
    };

    // На мобильном при переходе на /me показываем отдельную страницу друзей
    if ((isMobile || isNarrow) && location.pathname === "/me") {
        return (
            <div className="flex-1 overflow-auto rounded-[8px]">
                <Me />
            </div>
        );
    }
    if (isMobile) {
        return (
            <div className="flex-1 p-[8px] gap-[8px] flex flex-col bg-white/10 overflow-auto w-full md:min-w-[220px] md:max-w-[260px] rounded-[8px]">
                <button className="w-full h-[48px] bg-white/10 rounded-[8px] cursor-pointer text-white/50">
                    Найти беседу
                </button>
                <span className="h-[2px] rounded-full w-full bg-white/50" />

                <div className="w-full flex">
                    <Link className="rounded-[8px] transition hover:bg-white/10 w-full p-[8px] text-white/50" to="/me">
                        <FontAwesomeIcon icon={faUser} className="mr-[4px]" />
                        {location.pathname === "/me" ? "Добавить в друзья" : "Друзья"}
                    </Link>
                </div>
                <span className="h-[2px] rounded-full w-full bg-white/50" />

                <ul className="space-y-2">
                    {friends.map((f) => {
                        let friendId = f.requester_id === myId ? f.addressee_id : f.requester_id;
                        const friend = users[friendId];
                        const avatarUrl = `${API_BASE}/auth/avatars/${friendId}`;
                        return (
                            <li key={f.id}>
                                <Link to={`/me/${friendId}`} className="flex items-center gap-[8px] px-[8px] py-[4px] rounded-[8px] hover:bg-white/10 transition">
                                    <div className="w-10 h-10 flex-shrink-0">
                                        <img className="w-10 h-10 rounded-full object-cover" src={avatarUrl} alt={usernames[friendId] || friendId} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{friend?.username || usernames[friendId] || friendId}</div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
    return (
        <div className="flex-1 p-[8px] gap-[8px] flex flex-col bg-white/10 overflow-auto w-full md:min-w-[220px] md:max-w-[260px] rounded-[8px]">
            <button className="w-full h-[32px] bg-white/10 rounded-[8px] cursor-pointer text-white/50">
                Найти беседу
            </button>
            <span className="h-[2px] rounded-full w-full bg-white/50" />

            <div className="w-full flex">
                <Link className="rounded-[8px] transition hover:bg-white/10 w-full p-[8px] text-white/50" to="/me">
                    <FontAwesomeIcon icon={faUser} className="mr-[4px]" />
                    {location.pathname === "/me" ? "Добавить в друзья" : "Друзья"}
                </Link>
            </div>
            <span className="h-[2px] rounded-full w-full bg-white/50" />

            <ul className="space-y-2">
                {friends.map((f) => {
                    let friendId = f.requester_id === myId ? f.addressee_id : f.requester_id;
                    const friend = users[friendId];
                    const avatarUrl = `${API_BASE}/auth/avatars/${friendId}`;
                    return (
                        <li key={f.id}>
                            <Link to={`/me/${friendId}`} className="flex items-center gap-[8px] px-[8px] py-[4px] rounded-[8px] hover:bg-white/10 transition">
                                <div className="w-10 h-10 flex-shrink-0">
                                    <img className="w-10 h-10 rounded-full object-cover" src={avatarUrl} alt={usernames[friendId] || friendId} />
                                </div>
                                <div>
                                    <div className="font-semibold">{friend?.username || usernames[friendId] || friendId}</div>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
