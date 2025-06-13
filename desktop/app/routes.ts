import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/auth/Layout.tsx", [
        route("auth/login", "routes/auth/LoginPage.tsx"),
        route("auth/register", "routes/auth/RegisterPage.tsx"),
    ]),
    layout("routes/channels/ChannelsLayout.tsx", [
        route("channels/me", "routes/channels/me/HomePage.tsx"),
        route("channels/me/:channelsId", "routes/channels/me/ChatPage.tsx"),
        route("channels/:serverId", "routes/channels/server/ChatPage.tsx"),
        route("channels/:serverId/:channelsId", "routes/channels/server/ChatPage.tsx"),
    ])
] satisfies RouteConfig;
