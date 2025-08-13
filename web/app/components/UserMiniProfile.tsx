import { useAuth } from "../AuthContext";

export default function UserMiniProfile({ isMobile = false }) {
    const { user, logout } = useAuth();
    if (isMobile) {
        return (
            <div className="p-4 flex items-center gap-2 bg-white/10 rounded-[8px]">
                <div className="flex-1">
                    <div className="font-semibold">{user?.username}</div>
                    <div className="text-xs text-white/50">{user?.email || "no email"}</div>
                </div>
                <button className="text-xs text-red-400 hover:underline" onClick={logout}>Выйти</button>
            </div>
        );
    }
    return (
        <div className="p-4 flex items-center gap-2 bg-white/10 rounded-[8px]">
            <div className="flex-1">
                <div className="font-semibold">{user?.username}</div>
                <div className="text-xs text-white/50">{user?.email || "no email"}</div>
            </div>
            <button className="text-xs text-red-400 hover:underline" onClick={logout}>Выйти</button>
        </div>
    );
}
