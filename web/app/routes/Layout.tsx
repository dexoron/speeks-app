import ServerBar from "../components/ServerBar";
import FriendsList from "../components/FriendsList";
import UserMiniProfile from "../components/UserMiniProfile";
import { Outlet, useLocation } from "react-router";

export default function Layout() {
    const location = useLocation();
    const isRootMe = location.pathname === "/me";
    return (
        <div className="flex h-[100svh] md:h-screen w-full bg-black text-white p-2 gap-2 md:flex-row flex-col">
            {/* Десктопная версия */}
            <div className="hidden md:flex md:flex-col h-full gap-2 min-w-[280px] max-w-[340px]">
                <div className="flex flex-row flex-1 gap-2 h-full">
                    <ServerBar />
                    <FriendsList />
                </div>
                <UserMiniProfile />
            </div>

            {/* Мобильная версия*/}
            {isRootMe && (
                <div className="md:hidden fixed inset-0 flex flex-col bg-black p-2 gap-2 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
                    <div className="flex flex-1 flex-row gap-2">
                        <ServerBar />
                        <FriendsList />
                    </div>
                    <UserMiniProfile />
                </div>
            )}

            {/* Основной контент */}
            <div className={`flex-1 overflow-auto ${isRootMe ? "hidden md:block" : "block"}`}>
                <Outlet />
            </div>
        </div>
    );
}