import { useAuth } from "../AuthContext";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
    const { accessToken, loading } = useAuth();
    // Пока loading, не делаем никаких проверок и не рендерим роуты
    if (loading) {
        return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
    }
    // Только если loading === false, проверяем accessToken
    if (!accessToken) {
        return <Navigate to="/auth/login" replace />;
    }
    return <Outlet />;
}
