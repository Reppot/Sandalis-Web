"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { NotificationProvider } from "../providers/NotificationProvider";
import { TerminalProvider } from "../providers/TerminalProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { BackgroundLayer } from "./BackgroundLayer";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

export function TerminalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/";

  useEffect(() => {
    if (isLoginRoute) return;

    const raw = document.cookie
      .split("; ")
      .find((part) => part.startsWith("sindaris_session_expires_at="))
      ?.split("=")[1];
    const expiresAt = Number(raw ?? 0);

    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      window.location.replace("/");
      return;
    }

    // setTimeout принимает максимум 2^31-1 мс (~24.8 дня); сессия живёт 30 дней — ограничиваем задержку.
    const delay = Math.min(Math.max(0, expiresAt - Date.now()), 2_147_483_647);
    const timer = window.setTimeout(() => window.location.replace("/"), delay);
    return () => window.clearTimeout(timer);
  }, [isLoginRoute]);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <BackgroundLayer />
        {isLoginRoute ? (
          <div className="relative min-h-dvh bg-neutral-950/10">{children}</div>
        ) : (
          <TerminalProvider>
            <div className="relative flex min-h-dvh flex-col gap-2.5 p-2.5 md:gap-3 md:p-3 lg:h-dvh">
              <Header />
              <div className="flex flex-1 gap-2.5 md:gap-3 lg:min-h-0">
                <Sidebar />
                <main className="min-w-0 flex-1 pb-20 md:pb-0 lg:min-h-0 lg:overflow-auto">{children}</main>
              </div>
              <MobileNav />
            </div>
          </TerminalProvider>
        )}
      </NotificationProvider>
    </ThemeProvider>
  );
}
