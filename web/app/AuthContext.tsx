import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";

export interface User {
  id: string;
  username: string;
  email?: string;
  // ...другие поля, если нужно
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем токены из cookie
    const storedAccess = Cookies.get("access_token");
    const storedRefresh = Cookies.get("refresh_token");
    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      // Проверяем access_token и подгружаем пользователя
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedAccess}` },
      })
        .then(async (res) => {
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // access_token невалиден, пробуем refresh (если реализовано)
            // ...логика обновления токена...
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (accessToken: string, refreshToken: string, user: User) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
    // Сохраняем токены в cookie
    Cookies.set("access_token", accessToken, { sameSite: "strict" });
    Cookies.set("refresh_token", refreshToken, { sameSite: "strict" });
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
