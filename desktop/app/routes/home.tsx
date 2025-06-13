import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Speeks" }
  ];
}

export default function Home() {
  const navigate = useNavigate();
  var isAuth:boolean = false
  if (!isAuth) {
    navigate("/auth/login");
  }
  navigate("/channels/me")
}
