import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";

// Тип для beforeinstallprompt (отсутствует в стандартных DOM типах)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function Home() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const isSecure = useMemo(() => {
    return window.isSecureContext || location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname);
  }, []);
  const { isIOS, isSafari } = useMemo(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return { isIOS, isSafari };
  }, []);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setIsAppInstalled(true);
      setInstallPromptEvent(null);
    };

    // Проверяем, уже ли установлено (standalone)
    const media = window.matchMedia && window.matchMedia('(display-mode: standalone)');
    const isStandalone = (media && media.matches) || (window.navigator as any).standalone === true;
    if (isStandalone) setIsAppInstalled(true);

    window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
    try {
      await installPromptEvent.userChoice;
    } finally {
      setInstallPromptEvent(null);
    }
  };
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
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            {(!isAppInstalled && installPromptEvent && isSecure) ? (
              <button
                type="button"
                className="py-4 px-8 text-xl bg-white/10 hover:bg-white/20 rounded-lg"
                onClick={handleInstall}
              >
                Установить Speeks
              </button>
            ) : (
              <Link className="py-4 px-8 text-xl bg-white/10 hover:bg-white/20 rounded-lg" to="/">Скачать</Link>
            )}
            <Link className="py-4 px-8 text-xl bg-white/10 hover:bg-white/20 rounded-lg" to="/me">Открыть Speeks</Link>
          </div>

          {!isSecure && (
            <div className="text-sm text-white/60">
              Установка PWA доступна только через HTTPS или на localhost.
            </div>
          )}

          {(isIOS && isSafari && !isAppInstalled) && (
            <div className="text-sm text-white/80 bg-white/10 rounded-lg p-3 max-w-lg">
              На iPhone/iPad добавьте приложение вручную: откройте меню «Поделиться» и выберите «На экран "Домой"».
            </div>
          )}
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
