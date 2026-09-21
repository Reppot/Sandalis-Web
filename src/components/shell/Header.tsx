"use client";

import { formatClock } from "@/lib/time";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useClock, useRiskSummary, useTerminal } from "../providers/TerminalProvider";
import { Ticker } from "./Ticker";

export function Header() {
  const { connection, lastSync } = useTerminal();
  const risk = useRiskSummary();
  const now = useClock();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const system =
    risk.critical > 0
      ? { label: "ТРЕВОГА", color: "var(--tk-critical)" }
      : risk.warning > 0
        ? { label: "ВНИМАНИЕ", color: "var(--tk-warning)" }
        : { label: "НОРМА", color: "var(--tk-safe)" };

  const link =
    connection === "online"
      ? { label: "ОНЛАЙН", color: "var(--tk-safe)", cls: "" }
      : connection === "syncing"
        ? { label: "СИНХРОНИЗАЦИЯ", color: "var(--tk-warning)", cls: "pulse" }
        : { label: "НЕТ СИГНАЛА", color: "var(--tk-critical)", cls: "blink" };

  return (
    <header className="chrome relative rounded-md px-3 py-2 md:px-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 xl:grid-cols-[auto_minmax(320px,1fr)_auto]">
        <div className="flex items-center gap-3">
          <Image src="/clan-logo.png" alt="Герб клана SINDARIS" width={44} height={44} className="ui-icon crest-frame h-11 w-11 rounded-md object-cover" priority />
          <div className="leading-none">
            <div className="flex items-baseline gap-2">
              <span className="title-brand text-[1.15rem] md:text-[1.35rem]">SINDARIS</span>
              <span className="font-display text-[0.8rem] tracking-[0.18em] uppercase opacity-85">Терминал</span>
            </div>
            <div className="hud-label chrome-muted mt-1 hidden sm:block">Logistics Overwatch Control • Foxhole</div>
          </div>
        </div>

        <div className="order-3 col-span-2 min-w-0 w-full xl:order-none xl:col-span-1">
          <Ticker />
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-3">
          <StatusChip label="СВЯЗЬ" value={link.label} color={link.color} dotClass={link.cls} />
          <StatusChip label="СИСТЕМА" value={system.label} color={system.color} className="hidden sm:flex" />
          <StatusChip label="СИНХР" value={formatClock(lastSync)} color="var(--tk-safe)" mono className="hidden md:flex" title="Время последней синхронизации с базой данных" />
          <StatusChip label="ВРЕМЯ" value={isMounted ? formatClock(now) : "--:--:--"} color="var(--chrome-text)" mono className="hidden 2xl:flex" />
        </div>
      </div>
    </header>
  );
}

function StatusChip({
  label,
  value,
  color,
  dotClass = "",
  mono = false,
  className = "",
  title,
}: {
  label: string;
  value: string;
  color: string;
  dotClass?: string;
  mono?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`items-center gap-2 rounded border px-2 py-1 ${className || "flex"}`}
      style={{ borderColor: "var(--chrome-border)", background: "rgba(0,0,0,0.12)" }}
      title={title}
    >
      <span className={`status-dot ${dotClass}`} style={{ color, background: color }} />
      <span className="hud-label chrome-muted">{label}</span>
      <span className={`text-[0.7rem] font-bold tracking-wider ${mono ? "font-mono tabular-nums" : ""}`} style={{ color }}>
        {value}
      </span>
    </div>
  );
}
