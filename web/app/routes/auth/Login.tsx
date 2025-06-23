import { Link } from "react-router";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        try {
            const urlForm = new URLSearchParams();
            urlForm.append("username", username);
            urlForm.append("password", password);
            const res = await fetch("http://127.0.0.1:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: urlForm.toString()
            });
            if (!res.ok) throw new Error("Неверные данные");
            const data = await res.json();
            // Получаем пользователя сразу после логина
            const userRes = await fetch("http://127.0.0.1:8000/auth/me", {
                headers: { "Authorization": `Bearer ${data.access_token}` }
            });
            if (!userRes.ok) {
                setError("Ошибка авторизации: не удалось получить профиль пользователя.");
                return;
            }
            const user = await userRes.json();
            login(data.access_token, data.refresh_token, user);
            navigate("/me");
        } catch (err) {
            setError("Ошибка входа. Проверьте данные.");
        }
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-2">Войти в аккаунт</h1>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-white/50">Имя пользователя</label>
                    <input type="text" id="username" name="username" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className=" text-white/50">Пароль</label>
                    <input type="password" id="password" name="password" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                    <a className="text-sky-500" href="#">Забыли пароль?</a>
                </div>
                <button type="submit" className="w-full h-12 bg-black/75 font-semibold rounded-lg hover:bg-black">Войти</button>
                <span className="text-white/50 text-right">Нет аккаунта? <Link className="text-sky-500" to="/auth/register">Зарегестрироваться</Link></span>
            </form>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </>
    );
}
