import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { AuthProvider } from "./AuthContext";
import type { Route } from "./+types/root";
import "./assets/css/main.css";
import appleTouchIcon from "./assets/brand/Icon.png";

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Speeks</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <base target="_self" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Speeks" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href={appleTouchIcon} />
        <link rel="apple-touch-icon" sizes="180x180" href="/Icon.png" />
        <link rel="mask-icon" href="/Icon.svg" color="#5865F2" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-startup-image" href={appleTouchIcon} />
        <meta name="mobile-web-app-capable" content="yes" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-[100svh] bg-black text-white overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered successfully:', registration.scope);
                      
                      // Проверяем обновления каждые 60 секунд
                      setInterval(() => {
                        registration.update();
                      }, 60000);
                    })
                    .catch(function(error) {
                      console.log('SW registration failed:', error);
                    });
                    
                  // Обновляем страницу при обновлении SW
                  navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (navigator.serviceWorker.controller) {
                      window.location.reload();
                    }
                  });
                });
              }
              
              // Обработчик установки PWA
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                console.log('PWA install prompt ready');
              });
            `
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
