"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/orders", label: "Заказы", icon: "🛠️" },
  { href: "/tools", label: "Инструменты", icon: "🧭" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => undefined);
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="chrome flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-2 md:px-4">
      <div className="flex items-center gap-3">
        <div className="crest-frame flex h-10 w-10 items-center justify-center rounded-md font-display text-xs font-bold text-[#0c0e0c]">SD</div>
        <div className="leading-none">
          <div className="title-brand text-[1.05rem]">SINDARIS</div>
          <div className="hud-label chrome-muted mt-0.5 hidden sm:block">Logistics Overwatch • Foxhole</div>
        </div>
      </div>

      <nav className="flex items-center gap-1.5" aria-label="Навигация">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`nav-btn ${active ? "is-active" : ""}`}>
              <span aria-hidden>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
        <button className="btn btn-danger" onClick={() => void logout()} title="Выйти из терминала">
          Выйти
        </button>
      </nav>
    </header>
  );
}
