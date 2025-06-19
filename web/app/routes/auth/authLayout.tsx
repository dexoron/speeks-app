import { Outlet } from "react-router";

export default function authLayout() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#101010] text-white">
            <div className="p-8 rounded-2xl bg-white/10 w-full max-w-[389px]">
                <Outlet />
            </div>
        </div>
    );
}
