import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_RESET_SECONDS,
  INITIAL_REGION_STATE,
  INITIAL_STOCKPILES,
  type Faction,
  type SectionId,
} from "./data";
import { formatDateTime } from "./format";

// ─────────── ТИПЫ ───────────
export interface Session {
  callsign: string;
  rank: string;
  startedAt: number;
}

export interface HistoryEntry {
  at: number;
  message: string;
}

export interface Stockpile {
  id: number;
  region: string;
  location: string;
  expiresAt: number;
  history: HistoryEntry[];
}

export interface OrderLine {
  name: string;
  code: string | null;
  qty: number;
  unit: "ЯЩ" | "ШТ";
}

export interface Raport {
  id: number;
  at: number;
  author: string;
  lines: OrderLine[];
  totalUnits: number;
}

export interface Toast {
  id: number;
  kind: "ok" | "warn" | "err";
  text: string;
}

interface TerminalCtx {
  session: Session | null;
  login: (callsign: string, rank: string) => void;
  logout: () => void;
  updateProfile: (callsign: string, rank: string) => void;

  page: SectionId;
  navigate: (p: SectionId) => void;

  stockpiles: Stockpile[];
  addStockpile: (region: string, location: string, hours: number) => void;
  resetStockpile: (id: number) => void;
  setStockpileTime: (id: number, hours: number) => void;
  removeStockpile: (id: number) => void;

  archive: Raport[];
  submitRaport: (lines: OrderLine[]) => void;

  regions: Record<string, Faction>;
  cycleRegion: (name: string) => void;
  resetRegions: () => void;

  toasts: Toast[];
  notify: (kind: Toast["kind"], text: string) => void;

  activity: HistoryEntry[];

  panels: Record<string, boolean>;
  togglePanel: (key: string) => void;
}

const Ctx = createContext<TerminalCtx | null>(null);

// ─────────── ЛОКАЛЬНОЕ ХРАНИЛИЩЕ ───────────
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

const K_SESSION = "sindaris_session_v1";
const K_STOCK = "sindaris_stockpiles_v1";
const K_ARCHIVE = "sindaris_archive_v1";
const K_REGIONS = "sindaris_regions_v1";
const K_ACTIVITY = "sindaris_activity_v1";

function seedStockpiles(): Stockpile[] {
  const now = Date.now();
  return INITIAL_STOCKPILES.map((s, i) => ({
    id: now + i,
    region: s.region,
    location: s.location,
    expiresAt: now + s.offsetSeconds * 1000,
    history: [{ at: now - 60_000 * (i + 3), message: `[СИСТЕМА] ${s.note}` }],
  }));
}

let toastSeq = 1;

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => load<Session | null>(K_SESSION, null));
  const [page, setPage] = useState<SectionId>("orders");
  const [stockpiles, setStockpiles] = useState<Stockpile[]>(() => {
    const stored = load<Stockpile[]>(K_STOCK, []);
    return stored.length ? stored : seedStockpiles();
  });
  const [archive, setArchive] = useState<Raport[]>(() => load<Raport[]>(K_ARCHIVE, []));
  const [regions, setRegions] = useState<Record<string, Faction>>(() =>
    load(K_REGIONS, { ...INITIAL_REGION_STATE }),
  );
  const [activity, setActivity] = useState<HistoryEntry[]>(() =>
    load<HistoryEntry[]>(K_ACTIVITY, []),
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [panels, setPanels] = useState<Record<string, boolean>>({ storage: true, constructor: true });

  const togglePanel = useCallback((key: string) => {
    setPanels((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  useEffect(() => save(K_SESSION, session), [session]);
  useEffect(() => save(K_STOCK, stockpiles), [stockpiles]);
  useEffect(() => save(K_ARCHIVE, archive), [archive]);
  useEffect(() => save(K_REGIONS, regions), [regions]);
  useEffect(() => save(K_ACTIVITY, activity.slice(-40)), [activity]);

  const notify = useCallback((kind: Toast["kind"], text: string) => {
    const id = toastSeq++;
    setToasts((t) => [...t.slice(-3), { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const pushActivity = useCallback((message: string) => {
    setActivity((a) => [...a.slice(-39), { at: Date.now(), message }]);
  }, []);

  const login = useCallback(
    (callsign: string, rank: string) => {
      setSession({ callsign, rank, startedAt: Date.now() });
      pushActivity(`[ТЕРМИНАЛ] ${callsign} подключился к сети SINDARIS`);
    },
    [pushActivity],
  );

  const logout = useCallback(() => {
    if (session) pushActivity(`[ТЕРМИНАЛ] ${session.callsign} завершил смену`);
    setSession(null);
  }, [session, pushActivity]);

  const updateProfile = useCallback(
    (callsign: string, rank: string) => {
      setSession((s) => (s ? { ...s, callsign, rank } : s));
      pushActivity(`[ТЕРМИНАЛ] Удостоверение обновлено: ${callsign} · ${rank}`);
    },
    [pushActivity],
  );

  const navigate = useCallback((p: SectionId) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  }, []);

  const stockLog = useCallback((id: number, message: string) => {
    setStockpiles((list) =>
      list.map((s) =>
        s.id === id ? { ...s, history: [...s.history.slice(-11), { at: Date.now(), message }] } : s,
      ),
    );
  }, []);

  const addStockpile = useCallback(
    (region: string, location: string, hours: number) => {
      const now = Date.now();
      const id = now;
      setStockpiles((list) => [
        ...list,
        {
          id,
          region,
          location,
          expiresAt: now + hours * 3600_000,
          history: [{ at: now, message: `[ШТАБ] Склад поставлен на мониторинг (${hours.toFixed(1)}ч)` }],
        },
      ]);
      pushActivity(`[СКЛАДЫ] Новый сектор: ${region} / ${location}`);
      notify("ok", `Сектор ${region} поставлен на мониторинг`);
    },
    [notify, pushActivity],
  );

  const resetStockpile = useCallback(
    (id: number) => {
      setStockpiles((list) =>
        list.map((s) => (s.id === id ? { ...s, expiresAt: Date.now() + DEFAULT_RESET_SECONDS * 1000 } : s)),
      );
      stockLog(id, "[ОПЕРАТОР] Таймер обновлён — сброс на 48 часов");
      pushActivity("[СКЛАДЫ] Склад обновлён вручную (+48:00)");
      notify("ok", "Таймер сброшен на 48:00:00");
    },
    [notify, pushActivity, stockLog],
  );

  const setStockpileTime = useCallback(
    (id: number, hours: number) => {
      setStockpiles((list) =>
        list.map((s) => (s.id === id ? { ...s, expiresAt: Date.now() + hours * 3600_000 } : s)),
      );
      stockLog(id, `[ОПЕРАТОР] Установлено точное время: ${hours.toFixed(2)}ч`);
      notify("ok", `Установлено ${hours.toFixed(2)}ч`);
    },
    [notify, stockLog],
  );

  const removeStockpile = useCallback(
    (id: number) => {
      setStockpiles((list) => {
        const target = list.find((s) => s.id === id);
        if (target) pushActivity(`[СКЛАДЫ] Сектор снят с мониторинга: ${target.region}`);
        return list.filter((s) => s.id !== id);
      });
      notify("warn", "Сектор снят с мониторинга");
    },
    [notify, pushActivity],
  );

  const submitRaport = useCallback(
    (lines: OrderLine[]) => {
      if (!session || lines.length === 0) return;
      const total = lines.reduce((acc, l) => acc + l.qty, 0);
      const raport: Raport = {
        id: Date.now(),
        at: Date.now(),
        author: `${session.callsign} · ${session.rank}`,
        lines: lines.map((l) => ({ ...l })),
        totalUnits: total,
      };
      setArchive((a) => [raport, ...a].slice(0, 60));
      const stamp = formatDateTime(Date.now());
      pushActivity(`[РАПОРТ] ${session.callsign}: ${lines.length} поз., ${total} ед. · ${stamp}`);
      notify("ok", "Рапорт отправлен в штаб");
    },
    [session, notify, pushActivity],
  );

  const cycleRegion = useCallback(
    (name: string) => {
      setRegions((r) => {
        const order: Faction[] = ["warden", "contested", "colonial"];
        const next = order[(order.indexOf(r[name] ?? "contested") + 1) % order.length];
        return { ...r, [name]: next };
      });
    },
    [],
  );

  const resetRegions = useCallback(() => {
    setRegions({ ...INITIAL_REGION_STATE });
    notify("warn", "Карта сектора сброшена к последней сводке");
  }, [notify]);

  const value = useMemo<TerminalCtx>(
    () => ({
      session, login, logout, updateProfile,
      page, navigate,
      stockpiles, addStockpile, resetStockpile, setStockpileTime, removeStockpile,
      archive, submitRaport,
      regions, cycleRegion, resetRegions,
      toasts, notify,
      activity,
      panels, togglePanel,
    }),
    [
      session, login, logout, updateProfile, page, navigate,
      stockpiles, addStockpile, resetStockpile, setStockpileTime, removeStockpile,
      archive, submitRaport, regions, cycleRegion, resetRegions,
      toasts, notify, activity,
      panels, togglePanel,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTerminal(): TerminalCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTerminal вне TerminalProvider");
  return ctx;
}
