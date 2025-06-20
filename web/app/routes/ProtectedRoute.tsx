import { useAuth } from "../AuthContext";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
}
