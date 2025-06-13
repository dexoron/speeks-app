import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Speeks" }
  ];
}

export default function Home() {
  const navigate = useNavigate();
  var isAuth:boolean = true
  if (!isAuth) {
    navigate("/auth/login");
    return null;
  }
  return (
    <>
      <h1>Hello</h1>
      <Link to="/auth/login">Авторизация</Link>
    </>
  );
}
