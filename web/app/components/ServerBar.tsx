import { Link, useNavigate } from "react-router";
import brandIcon from "../assets/brand/Icon.png";
import { icon } from "@fortawesome/fontawesome-svg-core";
// Заглушка для аватарки
function Avatar({ name }: { name: string }) {
    return (
        <div className="w-10 h-10 flex items-center justify-center text-lg font-bold text-white">
            {name[0].toUpperCase()}
        </div>
    );
}

export default function ServerBar({ isMobile = false }) {
    const navigate = useNavigate();
    // Заглушки для серверов
    const servers = [
        { id: 1, name: "Сервер 1", icon: null },
        { id: 2, name: "Сервер 2", icon: null },
    ];
    if (isMobile) {
        return (
            <nav className="flex flex-col items-center w-16 h-full bg-white/10 py-2 gap-2 border-white/10 rounded-[8px]">
                {/* Бренд */}
                <Link
                    to="/me"
                    className="bg-white/10 w-12 h-12 rounded-[8px] flex items-center justify-center text-2xl font-bold hover:rounded-[16px] transition"
                    title="Speeks"
                >
                    <img className="w-full h-full rounded-[8px] hover:rounded-[16px] transition" src={brandIcon} alt="Speeks" />
                </Link>
                <span className="h-[2px] rounded-full w-6/8 bg-white/50" />
                {/* Серверы */}
                {servers.map((s) => (
                    <Link
                        to={`/me/server/${s.id}`}
                        key={s.id}
                        className="bg-white/10 w-12 h-12 rounded-[8px] flex items-center justify-center text-xl mb-1 hover:rounded-[16px] transition"
                        title={s.name}
                    >
                        {s.icon ? (
                            <img className="w-full h-full rounded-[8px] hover:rounded-[16px] transition" src={s.icon} alt={s.name} />
                        ) : (
                            <Avatar name={s.name} />
                        )}

                    </Link>
                ))}
            </nav>
        );
    }
    return (
        <nav className="flex flex-col items-center w-16 h-full bg-white/10 py-2 gap-2 border-white/10 rounded-[8px]">
            {/* Бренд */}
            <Link
                to="/me"
                className="bg-white/10 w-12 h-12 rounded-[8px] flex items-center justify-center text-2xl font-bold hover:rounded-[16px] transition"
                title="Speeks"
            >
                <img className="w-full h-full rounded-[8px] hover:rounded-[16px] transition" src={brandIcon} alt="Speeks" />
            </Link>
            <span className="h-[2px] rounded-full w-6/8 bg-white/50" />
            {/* Серверы */}
            {servers.map((s) => (
                <Link
                    to={`/me/server/${s.id}`}
                    key={s.id}
                    className="bg-white/10 w-12 h-12 rounded-[8px] flex items-center justify-center text-xl mb-1 hover:rounded-[16px] transition"
                    title={s.name}
                >
                    {s.icon ? (
                        <img className="w-full h-full rounded-[8px] hover:rounded-[16px] transition" src={s.icon} alt={s.name} />
                    ) : (
                        <Avatar name={s.name} />
                    )}

                </Link>
            ))}
        </nav>
    );
}
