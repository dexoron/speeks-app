import { Link } from "react-router";

export default function RegisterPage() {
    return (
        <>
            <h1>Register</h1>
            <Link to="/auth/login">Авторизация</Link>
        </>
    )
}