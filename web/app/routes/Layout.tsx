import ServerBar from "../components/ServerBar";
import FriendsList from "../components/FriendsList";
import UserMiniProfile from "../components/UserMiniProfile";
import { Outlet } from "react-router";

export default function Layout() {
    return (
        <div className="flex h-screen w-screen bg-black text-white p-2 gap-2">
            <div className="flex flex-col h-full gap-2 min-w-[280px] max-w-[340px]">
                <div className="flex flex-row flex-1 gap-2 h-full">
                    <ServerBar />
                    <FriendsList />
                </div>
                <UserMiniProfile />
            </div>
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}
