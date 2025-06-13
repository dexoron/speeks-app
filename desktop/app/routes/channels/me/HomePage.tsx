import { Link, useNavigate } from "react-router";
import type { Route } from "./../../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Speeks | Друзья" }
  ];
}

export default function HomePage() {
  return (
    <>
      <h1>Личный чат</h1>
    </>
  );
}
