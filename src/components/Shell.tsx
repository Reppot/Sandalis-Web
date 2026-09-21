import {
  Binary,
  CheckCircle2,
  ChevronFirst,
  ChevronLast,
  Clock3,
  Crosshair,
  Factory,
  GraduationCap,
  IdCard,
  LogOut,
  Map as MapIcon,
  Moon,
  ScrollText,
  Sun,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NAV_ITEMS, TACTICAL_PHRASES, type SectionId } from "../lib/data";
import { cx, formatClock, formatCountdown, useNow } from "../lib/format";
import { useTerminal } from "../lib/state";

export const SECTION_ICONS: Record<SectionId, ReactNode> = {
  orders: <ScrollText size={17} />,
  timers: <Clock3 size={17} />,
  codes: <Binary size={17} />,
  map: <MapIcon size={17} />,
  tools: <Factory size={17} />,
  training: <GraduationCap size={17} />,
  cabinet: <IdCard size={17} />,
};

const SECTION_PNG: Record<SectionId, string> = {
  orders: "/icons/parchment.png",
  timers: "/icons/24-hour-clock.png",
  codes: "/icons/braces.png",
  tools: "/icons/browsing.png",
  training: "/icons/brain.png",
  cabinet: "/icons/business.png",
  map: "/icons/braces.png",
};

// ─────────── ТЕМА ───────────
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("sindaris-theme", next);
    } catch {
      /* noop */
    }
  };
  return { theme, toggle };
}

// ─────────── БЕГУЩАЯ СТРОКА ───────────
function Ticker() {
  const { stockpiles } = useTerminal();
  const now = useNow(1000);
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setPhraseIdx((i) => (i + 1) % TACTICAL_PHRASES.length), 12000);
    return () => window.clearInterval(t);
  }, []);

  const entries = useMemo(() => {
    const items: { text: string; level: "critical" | "warning" | "info" }[] = [];
    for (const s of stockpiles) {
      const left = Math.floor((s.expiresAt - now) / 1000);
      if (left <= 0) {
        items.push({ text: `ТАЙМЕР ИСТЁК: ${s.region.toUpperCase()} / ${s.location.toUpperCase()} — СКЛАД УТРАЧЕН`, level: "critical" });
      } else if (left <= 3600) {
        items.push({ text: `КРИТИЧЕСКИ: ${s.region.toUpperCase()} / ${s.location.toUpperCase()} — ДО ДЕСПАВНА ${formatCountdown(left)}`, level: "critical" });
      } else if (left <= 86400) {
        items.push({ text: `ВНИМАНИЕ: ${s.region.toUpperCase()} — ОБНОВИТЬ СКЛАД В ТЕЧЕНИЕ ${formatCountdown(left)}`, level: "warning" });
      }
    }
    items.push({ text: TACTICAL_PHRASES[phraseIdx], level: "info" });
    return items;
  }, [stockpiles, now, phraseIdx]);

  const line = entries.map((e) => e.text).join("   •   ");
  const duration = Math.max(26, line.length * 0.34);
  const worst = entries.some((e) => e.level === "critical") ? "critical" : entries.some((e) => e.level === "warning") ? "warning" : "info";

  return (
    <div className="ticker-mask relative w-full" role="marquee" aria-label="Лента предупреждений">
      <div
        className="ticker-track hud-label items-center py-1.5 text-white/70"
        style={{ ["--ticker-duration" as string]: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <span key={copy} aria-hidden={copy === 1} className="pr-10">
            {entries.map((e, i) => (
              <span
                key={`${copy}-${i}`}
                className={cx(
                  "mx-1 inline-flex items-center gap-1.5",
                  e.level === "critical" && "text-[#ff6b6b]",
                  e.level === "warning" && "text-[#fbbf24]",
                  worst === "info" && !e.level.includes("info") ? "" : "",
                )}
              >
                {i === 0 && (worst === "info" ? <Crosshair size={11} className="text-accent" /> : <TriangleAlert size={11} className={worst === "critical" ? "pulse" : ""} />)}
                {e.text}
                <span className="mx-3 text-white/25">•</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────── СТАТУС-БЕЙДЖ ───────────
function StatusBadge({
  label,
  value,
  color,
  pulse = false,
  className,
  title,
}: {
  label: string;
  value: string;
  color: string;
  pulse?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={cx("flex items-center gap-2 rounded border px-2 py-1", className)}
      style={{ borderColor: "var(--chrome-border)", background: "rgba(0,0,0,0.12)" }}
      title={title}
    >
      <span className={cx("status-dot", pulse && "pulse")} style={{ color, background: color }} />
      <span className="hud-label text-white/40">{label}</span>
      <span className="font-mono text-[0.7rem] font-bold tracking-wider tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

// ─────────── ШАПКА ───────────
function Header() {
  const { session, logout, stockpiles, activity } = useTerminal();
  const now = useNow(1000);
  const [syncing, setSyncing] = useState(true);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const t = window.setTimeout(() => setSyncing(false), 1800);
    return () => window.clearTimeout(t);
  }, []);

  const lastSync = activity.length ? activity[activity.length - 1].at : (session?.startedAt ?? now);
  const critical = stockpiles.filter((s) => s.expiresAt - now <= 3600_000).length;

  return (
    <header className="chrome sticky top-2 z-40 rounded-md px-3 py-2 md:px-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1.5 xl:grid-cols-[auto_minmax(320px,1fr)_auto]">
        {/* Бренд */}
        <div className="flex items-center gap-3">
          <img
            src="/images/clan-logo.jpg"
            alt="Герб клана SINDARIS"
            className="crest-frame h-11 w-11 rounded-md object-cover"
            draggable={false}
          />
          <div className="leading-none">
            <div className="flex items-baseline gap-2">
              <span className="title-brand text-[1.15rem] text-white md:text-[1.35rem]">SINDARIS</span>
              <span className="font-display text-[0.8rem] tracking-[0.18em] text-white/85 uppercase">Терминал</span>
            </div>
            <div className="hud-label mt-1 hidden text-white/40 sm:block">Logistics Overwatch Control • Foxhole</div>
          </div>
          {critical > 0 && (
            <div className="ml-1 hidden items-center gap-1.5 rounded-sm border border-[#ef4444]/60 bg-[#ef4444]/10 px-2 py-1 text-[#ff6b6b] lg:flex">
              <TriangleAlert size={13} className="pulse" />
              <span className="hud-label">{critical} НА ГРАНИ</span>
            </div>
          )}
        </div>

        {/* Тикер */}
        <div className="order-3 col-span-2 w-full min-w-0 border-t border-[var(--chrome-border)] pt-1 xl:order-none xl:col-span-1 xl:border-t-0 xl:pt-0">
          <Ticker />
        </div>

        {/* Статус-бейджи */}
        <div className="flex items-center justify-end gap-2">
          <StatusBadge
            label="СВЯЗЬ"
            value={syncing ? "СИНХРОНИЗАЦИЯ" : "КАНАЛ ОК"}
            color={syncing ? "var(--warn)" : "var(--accent)"}
            pulse={syncing}
          />
          <StatusBadge label="СИСТЕМА" value="НОРМА" color="var(--accent)" className="hidden sm:flex" />
          <StatusBadge
            label="СИНХР"
            value={formatClock(lastSync)}
            color="var(--accent)"
            className="hidden lg:flex"
            title="Время последнего действия терминала"
          />
          <StatusBadge label="ВРЕМЯ" value={formatClock(now)} color="var(--text)" className="hidden xl:flex" />
          <div className="hidden text-right leading-tight 2xl:block">
            <div className="max-w-[130px] truncate font-mono text-[0.72rem] font-bold">{session?.callsign}</div>
            <div className="hud-label text-[0.55rem] text-white/40">{session?.rank}</div>
          </div>
          <button className="btn h-8 w-8 !p-0" onClick={toggle} title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}>
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button className="btn btn-danger h-8 !px-2" onClick={logout} title="Завершить смену">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─────────── САЙДБАР ───────────
function Sidebar({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const { page, navigate, panels, togglePanel } = useTerminal();
  return (
    <aside
      className={cx(
        "chrome sticky top-[5.25rem] z-30 hidden max-h-[calc(100dvh-6.5rem)] shrink-0 flex-col gap-3 self-start overflow-hidden rounded-md p-2.5 md:sticky md:flex",
        expanded ? "w-56" : "w-[76px]",
        "transition-[width] duration-300 ease-out",
      )}
    >
      <button
        className="btn w-full !px-0 text-base"
        aria-label={expanded ? "Свернуть меню" : "Развернуть меню"}
        title={expanded ? "Свернуть" : "Развернуть"}
        onClick={onToggle}
      >
        {expanded ? <ChevronFirst size={15} /> : <ChevronLast size={15} />}
      </button>
      <nav className="scroll-area flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5" aria-label="Навигация терминала">
        {NAV_ITEMS.map((item) => {
          const active = page === item.id;
          return (
            <div key={item.id} className="shrink-0">
              <button
                onClick={() => navigate(item.id)}
                title={item.hint}
                className={cx(
                  "nav-item flex w-full items-center gap-3 rounded-sm py-2",
                  expanded ? "px-2.5" : "justify-center px-0",
                  active ? "bg-accent/[0.1] text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                <span
                  className={cx(
                    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border",
                    active
                      ? "border-accent/60 bg-accent/10 shadow-[0_0_14px_rgba(163,230,53,0.2)]"
                      : "border-[var(--line-2)]",
                  )}
                >
                  <img src={SECTION_PNG[item.id]} alt="" width={30} height={30} loading="lazy" className="h-[30px] w-[30px] object-contain" draggable={false} />
                </span>
                {expanded && (
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[0.76rem] font-bold tracking-wide uppercase">{item.label}</span>
                    <span className="mt-0.5 block truncate text-[0.6rem] text-white/35">{item.hint}</span>
                  </span>
                )}
              </button>
              {active && item.id === "orders" && (
                <div className={cx("flex flex-col gap-1", expanded ? "mt-1.5 pl-5" : "mt-1 items-center")}>
                  {(
                    [
                      ["storage", expanded ? "Склад" : "С"],
                      ["constructor", expanded ? "Конструктор" : "К"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePanel(key)}
                      aria-pressed={panels[key]}
                      title={key === "storage" ? "Переключить содержимое склада" : "Переключить конструктор заказа"}
                      className={cx(
                        "hud-label flex items-center gap-1 rounded-sm px-1.5 py-1 transition",
                        panels[key] ? "text-accent" : "text-white/25 hover:text-white/50",
                      )}
                    >
                      <span className="font-mono">{panels[key] ? "[•]" : "[ ]"}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="hud-label border-t border-[var(--chrome-border)] pt-2 text-center text-[0.52rem] text-white/30">
        {expanded ? "УЗЕЛ: SANDALIS-PRIME" : "SND"}
      </div>
    </aside>
  );
}

// ─────────── МОБИЛЬНАЯ НАВИГАЦИЯ ───────────
function MobileNav() {
  const { page, navigate } = useTerminal();
  return (
    <nav className="chrome fixed inset-x-2 bottom-2 z-40 grid grid-cols-7 rounded-md md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={cx("flex flex-col items-center gap-1 py-2", active ? "text-accent" : "text-white/45")}
          >
            {SECTION_ICONS[item.id]}
            <span className="text-[0.48rem] font-bold tracking-wider uppercase">{item.label.split(" ")[0]}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─────────── ТОСТЫ ───────────
function ToastStack() {
  const { toasts } = useTerminal();
  return (
    <div className="pointer-events-none fixed right-3 bottom-20 z-[70] flex w-[calc(100vw-24px)] max-w-sm flex-col gap-2 md:right-4 md:bottom-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            "panel modal-in flex items-center gap-2.5 rounded-sm px-3.5 py-2.5",
            t.kind === "ok" && "border-accent/50",
            t.kind === "warn" && "border-[#f59e0b]/60",
            t.kind === "err" && "border-[#ef4444]/60",
          )}
        >
          {t.kind === "ok" ? (
            <CheckCircle2 size={15} className="shrink-0 text-accent" />
          ) : (
            <TriangleAlert size={15} className={cx("shrink-0", t.kind === "warn" ? "text-[#fbbf24]" : "text-[#ff6b6b]")} />
          )}
          <span className="font-mono text-[0.7rem] font-semibold tracking-wide text-white/90">{t.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────── ОБОЛОЧКА ───────────
export function TerminalShell({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sindaris_sidebar") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sindaris_sidebar", expanded ? "1" : "0");
    } catch {
      /* noop */
    }
  }, [expanded]);

  return (
    <div className="flex min-h-dvh flex-col gap-2.5 p-2.5 md:gap-3 md:p-3">
      <Header />
      <div className="mx-auto flex w-full max-w-[1800px] flex-1 gap-2.5 md:gap-3">
        <Sidebar expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        <main className="min-w-0 flex-1 pb-24 md:pb-6">{children}</main>
      </div>
      <MobileNav />
      <ToastStack />
    </div>
  );
}
