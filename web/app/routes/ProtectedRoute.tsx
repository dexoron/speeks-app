import { useAuth } from "../AuthContext";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { accessToken, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }
  if (!accessToken) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
}
