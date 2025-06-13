import { Link } from "react-router";
import type { Route } from "../../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Speeks" }
  ];
}

export default function ChatPage() {
  return (
    <>
      <h1>Личный чат</h1>
    </>
  );
}
