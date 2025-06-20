import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/auth/authLayout.tsx", [
        route("auth/login", "routes/auth/Login.tsx"),
        route("auth/register", "routes/auth/Register.tsx"),
    ]),
    layout("routes/ProtectedRoute.tsx", [
        route("me", "routes/me.tsx"),
    ]),
] satisfies RouteConfig;
