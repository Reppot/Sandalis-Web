"use client";

import { secondsLeft, severityOf } from "@/lib/time";
import type { StockpileDTO } from "@/lib/types";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type Connection = "online" | "offline" | "syncing";

interface TerminalContextValue {
  stockpiles: StockpileDTO[];
  loading: boolean;
  connection: Connection;
  lastSync: Date | null;
  refresh: () => Promise<void>;
  markSync: () => void;
  markOffline: () => void;
  createStockpile: (input: { region: string; location: string; seconds: number }) => Promise<StockpileDTO>;
  patchStockpile: (id: number, body: Record<string, unknown>) => Promise<StockpileDTO>;
  deleteStockpile: (id: number) => Promise<void>;
  showStockpile: boolean;
  showConstructor: boolean;
  setShowStockpile: (visible: boolean | ((current: boolean) => boolean)) => void;
  setShowConstructor: (visible: boolean | ((current: boolean) => boolean)) => void;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);
const ClockContext = createContext<number>(Date.now());

const POLL_MS = 20000;

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [stockpiles, setStockpiles] = useState<StockpileDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<Connection>("syncing");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showStockpile, setShowStockpile] = useState(true);
  const [showConstructor, setShowConstructor] = useState(true);
  const [now, setNow] = useState<number>(() => Date.now());
  const inflight = useRef(false);

  const markSync = useCallback(() => {
    setLastSync(new Date());
    setConnection("online");
  }, []);
  const markOffline = useCallback(() => setConnection("offline"), []);

  const refresh = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    try {
      let res: Response | null = null;
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          res = await fetch("/api/stockpiles", { cache: "no-store", credentials: "same-origin" });
          if (res.redirected || res.url.includes("/?next=%2Fapi%2Fstockpiles")) {
            window.location.replace("/");
            return;
          }
          if (res.ok) break;
          lastError = new Error(await readError(res));
        } catch (error) {
          lastError = error instanceof Error ? error : new Error("Сбой канала связи");
        }
        if (attempt === 0) await new Promise((resolve) => window.setTimeout(resolve, 250));
      }

      if (!res?.ok) throw lastError ?? new Error("Сбой канала связи с базой секторов");
      const data = (await res.json()) as { stockpiles: StockpileDTO[] };
      setStockpiles(data.stockpiles);
      markSync();
    } catch {
      setConnection("offline");
    } finally {
      inflight.current = false;
      setLoading(false);
    }
  }, [markSync]);

  useEffect(() => {
    void refresh();
    const poll = window.setInterval(() => void refresh(), POLL_MS);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(poll);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const upsert = useCallback((dto: StockpileDTO) => {
    setStockpiles((prev) => {
      const exists = prev.some((s) => s.id === dto.id);
      const next = exists ? prev.map((s) => (s.id === dto.id ? dto : s)) : [...prev, dto];
      return next.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    });
  }, []);

  const createStockpile = useCallback<TerminalContextValue["createStockpile"]>(
    async (input) => {
      const res = await fetch("/api/stockpiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await readError(res));
      const dto = (await res.json()) as StockpileDTO;
      upsert(dto);
      markSync();
      return dto;
    },
    [upsert, markSync],
  );

  const patchStockpile = useCallback<TerminalContextValue["patchStockpile"]>(
    async (id, body) => {
      const res = await fetch(`/api/stockpiles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await readError(res));
      const dto = (await res.json()) as StockpileDTO;
      upsert(dto);
      markSync();
      return dto;
    },
    [upsert, markSync],
  );

  const deleteStockpile = useCallback<TerminalContextValue["deleteStockpile"]>(
    async (id) => {
      const res = await fetch(`/api/stockpiles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await readError(res));
      setStockpiles((prev) => prev.filter((s) => s.id !== id));
      markSync();
    },
    [markSync],
  );

  const value = useMemo<TerminalContextValue>(
    () => ({
      stockpiles,
      loading,
      connection,
      lastSync,
      refresh,
      markSync,
      markOffline,
      createStockpile,
      patchStockpile,
      deleteStockpile,
      showStockpile,
      showConstructor,
      setShowStockpile,
      setShowConstructor,
    }),
    [stockpiles, loading, connection, lastSync, refresh, markSync, markOffline, createStockpile, patchStockpile, deleteStockpile, showStockpile, showConstructor],
  );

  return (
    <TerminalContext.Provider value={value}>
      <ClockContext.Provider value={now}>{children}</ClockContext.Provider>
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used inside TerminalProvider");
  return ctx;
}

/** Текущее время (обновляется раз в секунду) */
export function useClock() {
  return useContext(ClockContext);
}

/** Сводка по рискам деспавна */
export function useRiskSummary() {
  const { stockpiles } = useTerminal();
  const now = useClock();
  return useMemo(() => {
    let critical = 0;
    let warning = 0;
    let safe = 0;
    for (const s of stockpiles) {
      const sev = severityOf(secondsLeft(s.expiresAt, now));
      if (sev === "critical") critical++;
      else if (sev === "warning") warning++;
      else safe++;
    }
    return { critical, warning, safe, total: stockpiles.length };
  }, [stockpiles, now]);
}
