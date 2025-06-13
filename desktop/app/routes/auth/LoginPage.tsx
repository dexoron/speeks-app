import { Link } from "react-router";

export default function LoginPage() {
    return (
        <>
            <h1>Login</h1>
            <Link to="/auth/register">Регистрация</Link>
            <Link to="/">Войти</Link>
        </>
    )
}