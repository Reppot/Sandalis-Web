"use client";

import { NAV_ITEMS, STORAGE_KEYS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTerminal } from "../providers/TerminalProvider";
import { useTheme } from "../providers/ThemeProvider";


export function ThemeIcon({ theme, size = 30 }: { theme: "dark" | "light"; size?: number }) {
  return theme === "dark" ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { showStockpile, showConstructor, setShowStockpile, setShowConstructor } = useTerminal();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      setExpanded(localStorage.getItem(STORAGE_KEYS.sidebar) === "1");
    } catch {
      // localStorage недоступен — оставляем компактное состояние.
    }
  }, []);

  const toggle = () => {
    setExpanded((previous) => {
      try {
        localStorage.setItem(STORAGE_KEYS.sidebar, previous ? "0" : "1");
      } catch {
        // Игнорируем ограничения приватного режима браузера.
      }
      return !previous;
    });
  };

  return (
    <aside
      className="chrome hidden h-[calc(100dvh-1.5rem)] max-h-dvh shrink-0 flex-col gap-3 overflow-hidden rounded-md p-2.5 transition-[width] duration-300 ease-out md:flex"
      style={{ width: expanded ? 280 : 85 }}
    >
      {/* Профиль намеренно текстовый: отдельный логотип здесь не дублируется. */}
      <div className={`min-h-[46px] ${expanded ? "px-1" : "h-0 min-h-0"}`}>
        {expanded && (
          <div className="min-w-0 leading-tight">
            <div className="title-brand text-[0.95rem]">SINDARIS</div>
            <div className="hud-label chrome-muted">HQ • EST. 2024</div>
          </div>
        )}
      </div>

      <button
        className="btn w-full text-base"
        onClick={toggle}
        aria-label={expanded ? "Свернуть меню" : "Развернуть меню"}
        title={expanded ? "Свернуть" : "Развернуть"}
      >
        {expanded ? "❮" : "❯"}
      </button>

      <nav className="scroll-area flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1" aria-label="Навигация терминала">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const isOrders = item.href === "/orders";

          return (
            <div key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={`nav-btn ${active ? "is-active" : ""} ${expanded ? "" : "justify-center px-0"}`}
                title={item.hint}
                aria-current={active ? "page" : undefined}
              >
                <Image src={item.icon} alt="" width={36} height={36} unoptimized className="ui-icon" />
                {expanded && <span className="nav-label">{item.label}</span>}
              </Link>

              {isOrders && active && (
                <div
                  className={`sidebar-submenu ${expanded ? "expanded pl-8" : "compact"}`}
                  style={expanded ? { paddingLeft: "2rem" } : undefined}
                >
                  <button
                    type="button"
                    className={`sidebar-subitem ${showStockpile ? "is-visible" : "is-hidden"}`}
                    onClick={() => setShowStockpile((current) => !current)}
                    aria-pressed={showStockpile}
                    title="Переключить содержимое закрепленного склада"
                  >
                    {showStockpile && <span className="sidebar-subitem-marker mr-1 text-emerald-500">[•]</span>}
                    {expanded && <span>├─ 📦 Содержимое закрепленного склада</span>}
                  </button>

                  <button
                    type="button"
                    className={`sidebar-subitem ${showConstructor ? "is-visible" : "is-hidden"}`}
                    onClick={() => setShowConstructor((current) => !current)}
                    aria-pressed={showConstructor}
                    title="Переключить конструктор заказа"
                  >
                    {showConstructor && <span className="sidebar-subitem-marker mr-1 text-emerald-500">[•]</span>}
                    {expanded && <span>└─ 🛠️ Конструктор заказа</span>}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {expanded && (
        <div
          className="flex w-full gap-1 rounded border p-1"
          style={{
            borderColor: "var(--chrome-border)",
            background: "rgba(0,0,0,0.12)",
          }}
        >
          <Link
            href="/privacy"
            className="flex-1 rounded border px-1 py-2 text-center font-mono text-[0.58rem] font-bold tracking-wider transition-colors hover:text-[var(--accent)]"
            style={{ borderColor: "var(--chrome-border)" }}
          >
            PRIVACY
          </Link>

          <Link
            href="/terms"
            className="flex-1 rounded border px-1 py-2 text-center font-mono text-[0.58rem] font-bold tracking-wider transition-colors hover:text-[var(--accent)]"
            style={{ borderColor: "var(--chrome-border)" }}
          >
            TERMS
          </Link>
        </div>
      )}

      <button
        className={`nav-btn ${expanded ? "" : "justify-center px-0"}`}
        onClick={toggleTheme}
        title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center" style={{ color: theme === "dark" ? "var(--accent)" : "#2b4c1e" }}>
          <ThemeIcon theme={theme} />
        </span>
        {expanded && (
          <span className="flex flex-col items-start leading-tight">
            <span className="nav-label">Тема</span>
            <span className="hud-label chrome-muted">{theme === "dark" ? "Ночной режим" : "Дневной режим"}</span>
          </span>
        )}
      </button>
    </aside>
  );
}
