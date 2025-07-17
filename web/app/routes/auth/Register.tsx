import { Link } from "react-router";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router";
import { useState } from "react";
import { API_BASE } from "~/api";

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const password2 = formData.get("2password") as string;
        // const date_of_birth = formData.get("date") as string;
        if (password !== password2) {
            setError("Пароли не совпадают");
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            if (!res.ok) throw new Error("Ошибка регистрации");
            const data = await res.json();
            // Получаем пользователя сразу после регистрации
            const userRes = await fetch(`${API_BASE}/auth/me`, {
                headers: { "Authorization": `Bearer ${data.access_token}` }
            });
            let user = { username };
            if (userRes.ok) {
                user = await userRes.json();
            }
            login(data.access_token, data.refresh_token, user);
            navigate("/me");
        } catch (err) {
            setError("Ошибка регистрации. Проверьте данные.");
        }
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-2">Создать аккаунт</h1>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-white/50">Имя пользователя</label>
                    <input type="text" id="username" name="username" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-white/50">E-Mail</label>
                    <input type="email" id="email" name="email" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-white/50">Пароль</label>
                    <input type="password" id="password" name="password" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="2password" className="text-white/50">Повторите пароль</label>
                    <input type="password" id="2password" name="2password" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="text-white/50">Дата рождения</label>
                    <input type="date" id="date" name="date" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <button type="submit" className="w-full h-12 bg-black/75 font-semibold rounded-lg hover:bg-black">Продолжить</button>
                <span className="text-white/50">
                    Нажав на кнопку “Продолжить”, вы подтверждаете что ознокомились и согласны с
                    <a className="text-sky-500" href="#"> Условиями использования</a> и
                    <a className="text-sky-500" href="#"> Политиеой конфедициальности</a> Speeksu
                </span>
                <span className="text-white/50 text-right">Уже есть аккаунт? <Link className="text-sky-500" to="/auth/login">Войти</Link></span>
            </form>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </>
    );
}
