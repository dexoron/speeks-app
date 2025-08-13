import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-[100svh] w-full bg-black text-white flex flex-col p-2 gap-2">
      <nav className="flex justify-between items-center px-4 py-2 bg-white/10 rounded-lg">
        <div className="flex items-center gap-2">
          <img src="/Icon.svg" alt="Speeks" className="w-8 h-8" />
          <span className="text-white text-3xl font-bold">Speeks</span>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <Link className="py-2 px-4 hover:bg-white/10 rounded-lg" to="/">Загрузить</Link>
          <Link className="py-2 px-4 hover:bg-white/10 rounded-lg" to="/">Узнать больше</Link>
          <Link className="py-2 px-4 hover:bg-white/10 rounded-lg" to="/">Поддержка</Link>
        </div>
        <div>
          <Link className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg" to="/me">Открыть Speeks</Link>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <h1 className="text-white text-4xl sm:text-6xl font-black max-w-xl">Сообщества где весело сидеть</h1>
        <p className="text-white text-lg max-w-xl">
          Speeksu — отличное место, чтобы встретиться с друзьями или создать
          глобальное сообщество. Организуйте собственное пространство для бесед, игр и хобби.
        </p>
        <div className="flex items-center gap-4">
          <Link className="py-4 px-8 text-xl bg-white/10 hover:bg-white/20 rounded-lg" to="/">Скачать</Link>
          <Link className="py-4 px-8 text-xl bg-white/10 hover:bg-white/20 rounded-lg" to="/me">Открыть Speeks</Link>
        </div>
      </main>
      <footer className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center px-4 py-2 bg-white/10 rounded-lg w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 font-bold w-full">
            <span className="text-4xl">13+</span>
            <div className="flex flex-col">
              <span className="text-xl">&copy; Speeksu 2025</span>
              <span className="text-sm">Все права защищены!</span>
            </div>
          </div>
          <div className="flex flex-col text-white/50">
            <span>ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ УЕБАН УЕБАНОВИЧ УЕБАНОВ</span>
            <span>ОГРН-5234144153, ИНН-1431513451</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between md:justify-end w-full">
          <div className="flex flex-col gap-1">
            <span>FAQ</span>
            <div className="flex flex-col text-white/75">
              <Link className="hover:text-white" to="/">О нас</Link>
              <Link className="hover:text-white" to="/">Бренд</Link>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span>Соц.Сети</span>
            <div className="flex flex-col text-white/75">
              <Link className="hover:text-white" to="/">YouTube</Link>
              <Link className="hover:text-white" to="/">Facebook</Link>
              <Link className="hover:text-white" to="/">X.com</Link>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span>Политика</span>
            <div className="flex flex-col text-white/75">
              <Link className="hover:text-white" to="/">Условия использования</Link>
              <Link className="hover:text-white" to="/">Использование Cookie</Link>
              <Link className="hover:text-white" to="/">конфиденциальность</Link>
              <Link className="hover:text-white" to="/">Лицензия</Link>
              <Link className="hover:text-white" to="/">Правила</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
