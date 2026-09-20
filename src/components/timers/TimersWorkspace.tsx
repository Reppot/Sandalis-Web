"use client";

import { backgroundAsset, DEFAULT_RESET_SECONDS, iconPath } from "@/lib/constants";
import { formatCountdown, formatDateTime, secondsLeft, severityOf } from "@/lib/time";
import type { StockpileDTO } from "@/lib/types";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useClock, useRiskSummary, useTerminal } from "../providers/TerminalProvider";
import { AddStockpileModal, StockpileManagerModal } from "./StockpileModals";

export function TimersWorkspace() {
  const { stockpiles, loading, refresh, connection } = useTerminal();
  const risk = useRiskSummary();
  const now = useClock();
  const [managedId, setManagedId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...stockpiles]
      .filter((s) => !q || s.region.toLowerCase().includes(q) || s.location.toLowerCase().includes(q))
      .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
  }, [stockpiles, query]);

  const managed = managedId === null ? null : (stockpiles.find((s) => s.id === managedId) ?? null);

  return (
    <div className="tab-fade flex flex-col gap-2.5 md:gap-3 lg:h-full">
      {/* Телеметрия рисков */}
      <section className="panel panel-corners rounded-md px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <Image src={iconPath("24-hour-clock")} alt="" width={30} height={30} unoptimized className="ui-icon h-[30px] w-[30px] object-contain" />
            <h2 className="panel-title">Матрица таймеров деспавна</h2>
          </div>
          <Stat label="🚨 КРИТИЧЕСКИ (<1ч)" value={risk.critical} color="var(--danger)" />
          <Stat label="⚠️ ВНИМАНИЕ (<24ч)" value={risk.warning} color="var(--warn)" />
          <Stat label="✅ В БЕЗОПАСНОСТИ (>1д)" value={risk.safe} color="var(--tk-safe)" />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <input className="field w-40 py-1.5 text-xs" placeholder="Поиск сектора..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="btn" onClick={() => void refresh()} title="Обновить данные с сервера">
              ⟳ <span className="hidden sm:inline">Синхр.</span>
            </button>
            <button className="btn btn-primary" onClick={() => setAdding(true)}>
              ➕ <span className="hidden sm:inline">Регистрация склада</span>
              <span className="sm:hidden">Склад</span>
            </button>
          </div>
        </div>
      </section>

      {/* Карточки */}
      <section className="scroll-area flex-1 pr-0.5 lg:min-h-0">
        {loading ? (
          <div className="panel hud-label flex h-40 items-center justify-center rounded-md text-muted">
            <span className="pulse">📡 ЗАГРУЗКА МАТРИЦЫ СЕКТОРОВ...</span>
          </div>
        ) : sorted.length === 0 ? (
          <div className="panel panel-corners flex h-48 flex-col items-center justify-center gap-2 rounded-md text-center">
            <Image src={iconPath("barracks")} alt="" width={56} height={56} unoptimized className="ui-icon" />
            <div className="text-sm">{stockpiles.length ? "По запросу ничего не найдено" : "Ни один склад не поставлен на мониторинг"}</div>
            {connection === "offline" && <div className="hud-label text-danger">Нет связи с базой данных</div>}
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {sorted.map((s) => (
              <StockpileCard key={s.id} stockpile={s} now={now} onManage={() => setManagedId(s.id)} />
            ))}
          </ul>
        )}
      </section>

      <StockpileManagerModal stockpile={managed} onClose={() => setManagedId(null)} />
      <AddStockpileModal open={adding} onClose={() => setAdding(false)} />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-wide" style={{ color }}>
      <span>{label}:</span>
      <span className="rounded border px-1.5 py-0.5 tabular-nums" style={{ borderColor: color, background: "rgba(0,0,0,0.3)" }}>
        {value} БАЗ
      </span>
    </div>
  );
}

function StockpileCard({ stockpile, now, onManage }: { stockpile: StockpileDTO; now: number; onManage: () => void }) {
  const ts = secondsLeft(stockpile.expiresAt, now);
  const sev = severityOf(ts);
  const pct = Math.max(0, Math.min(100, (ts / DEFAULT_RESET_SECONDS) * 100));
  const last = stockpile.history[stockpile.history.length - 1];
  const barColor = sev === "critical" ? "#ff5555" : sev === "warning" ? "#ff9900" : "#a3e635";
  return (
    <li
      className={`timer-card sev-${sev}`}
      style={{ backgroundImage: `linear-gradient(90deg, var(--card-bg, rgba(20, 23, 20, 0.75)), var(--card-bg, rgba(20, 23, 20, 0.75))), url(${backgroundAsset("card").src})` }}
    >
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[0.95rem] font-bold text-white">
            <span>📍</span>
            <span className="truncate uppercase tracking-wide">{stockpile.region}</span>
            <span className="opacity-60">▶</span>
            <span className="truncate">{stockpile.location}</span>
          </div>
          <div className="progress-track mt-2 max-w-md">
            <div className="progress-bar" style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 10px ${barColor}` }} />
          </div>
          <div className="hud-label mt-1.5 truncate text-white/60" title={last?.message}>
            {last ? `${formatDateTime(last.createdAt)} • ${last.message.replace(/^\[[^\]]*\]\s*/, "")}` : "Журнал пуст"}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-right">
            <div className="hud-label text-white/60">{ts > 0 ? (sev === "critical" ? "КРИТИЧЕСКИ" : sev === "warning" ? "ВНИМАНИЕ" : "СТАБИЛЬНО") : "ТАЙМЕР ИСТЁК"}</div>
            <div className={`timer-value ${sev === "critical" && ts > 0 ? "pulse" : ""}`}>{ts > 0 ? formatCountdown(ts) : "00:00:00"}</div>
          </div>
          <button className="btn h-[34px] min-w-[110px]" onClick={onManage}>
            Управление
          </button>
        </div>
      </div>
    </li>
  );
}
