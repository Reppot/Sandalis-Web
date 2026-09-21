"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export type Tone = "info" | "success" | "warning" | "danger";

export interface Notice {
  id: number;
  title: string;
  message: string;
  tone: Tone;
}

interface NotifyInput {
  title: string;
  message: string;
  tone?: Tone;
  ttl?: number;
}

interface NotificationContextValue {
  notify: (n: NotifyInput) => void;
  dismiss: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const TONE_STYLES: Record<Tone, { border: string; glow: string; label: string }> = {
  info: { border: "#a3e635", glow: "rgba(163,230,53,0.25)", label: "СИСТЕМА" },
  success: { border: "#86efac", glow: "rgba(134,239,172,0.25)", label: "ПОДТВЕРЖДЕНО" },
  warning: { border: "#f59e0b", glow: "rgba(245,158,11,0.25)", label: "ВНИМАНИЕ" },
  danger: { border: "#ef4444", glow: "rgba(239,68,68,0.3)", label: "СБОЙ" },
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notice[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => setItems((prev) => prev.filter((n) => n.id !== id)), []);

  const notify = useCallback(
    ({ title, message, tone = "info", ttl = 5200 }: NotifyInput) => {
      const id = ++counter.current;
      setItems((prev) => [...prev.slice(-4), { id, title, message, tone }]);
      window.setTimeout(() => dismiss(id), ttl);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-3 bottom-4 z-[90] flex w-[min(380px,calc(100vw-1.5rem))] flex-col gap-2">
        {items.map((n) => {
          const t = TONE_STYLES[n.tone];
          return (
            <div
              key={n.id}
              className="toast pointer-events-auto rounded-md border border-white/10 bg-[#0d120e] px-4 py-3 shadow-lg"
              style={{ borderLeft: `4px solid ${t.border}`, boxShadow: `0 10px 30px rgba(0,0,0,0.45), 0 0 18px ${t.glow}` }}
              role="status"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="hud-label" style={{ color: t.border }}>
                    {t.label} • {n.title}
                  </div>
                  <div className="mt-1 whitespace-pre-line text-[0.8rem] leading-snug text-white/90">{n.message}</div>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="hud-label shrink-0 rounded border border-white/15 px-1.5 py-0.5 text-white/70 hover:border-white/50 hover:text-white"
                  aria-label="Закрыть"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotify must be used inside NotificationProvider");
  return ctx.notify;
}
