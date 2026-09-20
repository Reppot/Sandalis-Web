"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../providers/ThemeProvider";
import { ThemeIcon } from "./Sidebar";

export function MobileNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="chrome fixed inset-x-2 bottom-2 z-[60] grid grid-cols-7 gap-1 rounded-md p-1.5 md:hidden" aria-label="Навигация">
      {NAV_ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={`nav-btn h-14 flex-col justify-center gap-1 px-0 ${active ? "is-active" : ""}`}>
            <Image src={item.icon} alt="" width={26} height={26} unoptimized className="ui-icon" style={{ width: 26, height: 26 }} />
            <span className="hud-label">{item.label}</span>
          </Link>
        );
      })}
      <button className="nav-btn h-14 flex-col justify-center gap-1 px-0" onClick={toggleTheme}>
        <span style={{ color: theme === "dark" ? "var(--accent)" : "#2b4c1e" }}>
          <ThemeIcon theme={theme} size={24} />
        </span>
        <span className="hud-label">Тема</span>
      </button>
    </nav>
  );
}
