import { Link } from "react-router";

export default function Login() {

    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-2">Войти в аккаунт</h1>
            <form className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-white/50">Имя пользователя</label>
                    <input type="text" id="username" name="username" required className="w-full h-12 rounded-lg bg-white/10 " />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className=" text-white/50">Пароль</label>
                    <input type="password" id="password" name="password" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                    <a className="text-sky-500" href="#">Забыли пароль?</a>
                </div>
                <button type="submit" className="w-full h-12 bg-black/75 font-semibold rounded-lg hover:bg-black">Войти</button>
                <span className="text-white/50 text-right">Нет аккаунта? <Link className="text-sky-500" to="/auth/register">Зарегестрироваться</Link></span>
            </form>
        </>
    );
}
