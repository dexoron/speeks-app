import { useAuth } from "../AuthContext";

export default function Me() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-4">Профиль</h1>
      <p>Имя пользователя: <span className="font-semibold">{user?.username}</span></p>
    </div>
  );
}
