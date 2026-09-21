import {
  ArrowDownToLine,
  Boxes,
  ClipboardCopy,
  FileDown,
  FileText,
  Image as ImageIcon,
  ListChecks,
  Minus,
  PackagePlus,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  ScanSearch,
  Send,
  Table as TableIcon,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, HudLabel, Panel, PanelTitle } from "../components/ui";
import { copyToClipboard, cx, downloadText, formatDateTime, parseScannerReport, type ParsedRow } from "../lib/format";
import { GENE_ITEMS, ITEM_CATEGORIES, itemIconPath, type GeneItem, type ItemCategory } from "../lib/items-catalog";
import { exportReportPng, exportReportXls, reportLines } from "../lib/reports";
import { useTerminal, type OrderLine } from "../lib/state";

export const FACTION_STYLE: Record<string, string> = {
  Колонисты: "#a3e635",
  Варден: "#93c5fd",
  Нейтральные: "#9aa89b",
};

const DEMO_STORAGE = `Склад: Clanshead Valley / Порт
Argenti r.II Rifle, 340
Booker Storm Rifle Model 838 -> 120 шт.
Bomastone Grenade: 300
A3 Harpa Осколочная граната — 260
7.62mm: 5200
120-mm: 185
Salvage -> 12400
Basic Materials, 3800
Blood Plasma: 90
Hammer: 45`;

const K_DRAFT = "sindaris-order-draft-v1";
const K_STORAGE = "sindaris-storage-v1";

interface StoredStorage {
  rows: ParsedRow[];
  at: number;
  pinned: boolean;
}

function loadDraft(): OrderLine[] {
  try {
    const raw = localStorage.getItem(K_DRAFT);
    return raw ? (JSON.parse(raw) as OrderLine[]) : [];
  } catch {
    return [];
  }
}

function loadStorage(): StoredStorage {
  try {
    const raw = localStorage.getItem(K_STORAGE);
    if (raw) return JSON.parse(raw) as StoredStorage;
  } catch {
    /* noop */
  }
  return { rows: parseScannerReport(DEMO_STORAGE), at: Date.now(), pinned: false };
}

function iconTile(item: GeneItem | null | undefined, size = 28): React.ReactNode {
  const src = itemIconPath(item);
  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className="h-full w-full object-contain"
        draggable={false}
      />
    );
  }
  return (
    <span className="flex h-full w-full items-center justify-center font-mono text-[0.6rem] font-black text-white/30">
      {(item?.ru ?? "?").slice(0, 2).toUpperCase()}
    </span>
  );
}

export function OrdersView() {
  const { notify, submitRaport, archive, session, panels } = useTerminal();

  const [storage, setStorage] = useState<StoredStorage>(loadStorage);
  const [storageQuery, setStorageQuery] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [mode, setMode] = useState<"export" | "import">("export");
  const [busy, setBusy] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ItemCategory | "Все">("Все");
  const [selected, setSelected] = useState<GeneItem | null>(null);
  const [qty, setQty] = useState("1");
  const [unit, setUnit] = useState<"ЯЩ" | "ШТ">("ЯЩ");

  const [order, setOrder] = useState<OrderLine[]>(loadDraft);

  const persist = (lines: OrderLine[]) => {
    setOrder(lines);
    try {
      localStorage.setItem(K_DRAFT, JSON.stringify(lines));
    } catch {
      /* noop */
    }
  };

  const persistStorage = (s: StoredStorage) => {
    setStorage(s);
    try {
      localStorage.setItem(K_STORAGE, JSON.stringify(s));
    } catch {
      /* noop */
    }
  };

  // ── склад ──
  const filteredStorage = useMemo(() => {
    const q = storageQuery.trim().toLowerCase();
    return q ? storage.rows.filter((r) => r.name.toLowerCase().includes(q)) : storage.rows;
  }, [storage.rows, storageQuery]);
  const storageTotal = useMemo(() => storage.rows.reduce((a, r) => a + r.count, 0), [storage.rows]);

  const applyText = (text: string, source: string) => {
    const rows = parseScannerReport(text);
    if (!rows.length) {
      notify("err", `Парсер не распознал ни одной строки (${source})`);
      return;
    }
    persistStorage({ rows, at: Date.now(), pinned: storage.pinned });
    notify("ok", `Склад обновлён: ${rows.length} поз. (${source})`);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        notify("warn", "Буфер обмена пуст");
        return;
      }
      applyText(text, "буфер");
    } catch {
      notify("err", "Нет доступа к буферу обмена");
    }
  };

  const clearStorage = () => persistStorage({ rows: [], at: Date.now(), pinned: storage.pinned });

  const findItem = (name: string): GeneItem | undefined => {
    const lc = name.toLowerCase();
    return (
      GENE_ITEMS.find((i) => i.ru === name || i.title === name) ??
      GENE_ITEMS.find((i) => lc.includes(i.ru.toLowerCase()) || lc.includes(i.title.toLowerCase()))
    );
  };

  // ── матрица ──
  const matrix = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GENE_ITEMS.filter(
      (c) =>
        (category === "Все" || c.cat === category) &&
        (!q || c.ru.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)),
    );
  }, [query, category]);

  const qtyNum = Math.max(1, parseInt(qty.replace(/\D/g, "") || "1", 10));

  const addLine = () => {
    if (!selected) return;
    const idx = order.findIndex((l) => l.name === selected.ru && l.unit === unit);
    const next =
      idx >= 0
        ? order.map((l, i) => (i === idx ? { ...l, qty: l.qty + qtyNum } : l))
        : [...order, { name: selected.ru, code: selected.id, qty: qtyNum, unit }];
    persist(next);
    notify("ok", `${selected.ru} +${qtyNum} ${unit.toLowerCase()}.`);
  };

  const removeLine = (i: number) => persist(order.filter((_, x) => x !== i));
  const bumpLine = (i: number, delta: number) =>
    persist(order.map((l, x) => (x === i ? { ...l, qty: Math.max(0, l.qty + delta) } : l)).filter((l) => l.qty > 0));

  const totalUnits = order.reduce((a, l) => a + l.qty, 0);
  const author = `${session?.callsign ?? "—"} · ${session?.rank ?? "—"}`;

  // ── экспорт ──
  const exportTxt = () => downloadText(`raport_${Date.now()}.txt`, reportLines(order, author).join("\n"));
  const exportXls = () => exportReportXls(order, author);
  const exportPng = async () => {
    setBusy(true);
    const n = await exportReportPng(order, author);
    setBusy(false);
    notify(n ? "ok" : "err", n ? `PNG-страница сформирована (${n}/${order.length} поз.)` : "Не удалось построить PNG");
  };
  const copyReport = async () => {
    const ok = await copyToClipboard(reportLines(order, author).join("\n"));
    notify(ok ? "ok" : "err", ok ? "Рапорт скопирован в буфер" : "Не удалось скопировать");
  };
  const sendRaport = () => {
    submitRaport(order);
    persist([]);
  };

  const bothOn = panels.storage && panels.constructor;
  const bothOff = !panels.storage && !panels.constructor;

  return (
    <div className="tab-fade flex flex-col gap-3">
      <div className={cx("grid gap-3", bothOn && "xl:grid-cols-2")}>
        {bothOff && (
          <Panel className="px-4 py-12 text-center">
            <EmptyState
              icon={<Boxes size={32} />}
              title="Обе панели скрыты"
              hint="ВКЛЮЧИТЕ «СКЛАД» ИЛИ «КОНСТРУКТОР» ПОДПУНКТАМИ В БОКОВОМ МЕНЮ"
            />
          </Panel>
        )}
        {/* ═══ ЗАКРЕПЛЁННЫЙ СКЛАД ═══ */}
        {panels.storage && (
        <Panel className="flex min-h-[560px] flex-col p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <PanelTitle className="flex items-center gap-2">
              <Boxes size={15} /> Содержимое {storage.pinned ? "закреплённого склада" : "склада"}
            </PanelTitle>
            <div className="flex items-center gap-2">
              <span className="badge-count" title="Позиций">
                {storage.rows.length} ПОЗ.
              </span>
              <span className="badge-count" title="Суммарное количество">
                Σ {storageTotal}
              </span>
              <button
                className={cx("btn h-7 !px-2", storage.pinned && "btn-primary")}
                title={storage.pinned ? "Открепить (не сохранять между сессиями)" : "Закрепить (сохранять на этом терминале)"}
                onClick={() => {
                  persistStorage({ ...storage, pinned: !storage.pinned });
                  notify("ok", storage.pinned ? "Склад откреплён" : "Склад закреплён на терминале");
                }}
              >
                {storage.pinned ? <PinOff size={12} /> : <Pin size={12} />}
              </button>
            </div>
          </div>
          <div className="stencil-line mt-2.5" />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="btn" title="ЗАГРУЗИТЬ JSON/TXT СКАНЕРА">
              <FileDown size={14} />
              <input
                type="file"
                accept=".txt,.csv,.json"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) applyText(await f.text(), f.name);
                  e.target.value = "";
                }}
              />
            </label>
            <button className="btn" title="ВСТАВИТЬ ИЗ БУФЕРА ОБМЕНА" onClick={pasteFromClipboard}>
              <ArrowDownToLine size={14} />
            </button>
            <button
              className="btn"
              title="Загрузить бинарный MapData.sav и распознать предметы"
              onClick={() => notify("warn", "Дешифратор MapData.sav в разработке — используйте TXT/JSON сканера")}
            >
              СКАНИРОВАТЬ ФАЙЛ
            </button>
            <div className="ml-auto flex items-center gap-2">
              <input
                className="field w-36 py-1.5 text-xs sm:w-44"
                placeholder="Фильтр склада..."
                value={storageQuery}
                onChange={(e) => setStorageQuery(e.target.value)}
              />
              <button
                className="btn btn-danger px-2"
                title="Очистить монитор склада"
                disabled={!storage.rows.length}
                onClick={clearStorage}
              >
                <X size={13} />
              </button>
            </div>
          </div>
          <HudLabel className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 !text-[0.6rem] text-white/40">
            <span>
              Синхр: <span className="text-white/80">{formatDateTime(storage.at)}</span>
            </span>
            <span className="text-white/25">·</span>
            <span>{storage.pinned ? "СКЛАД ЗАКРЕПЛЁН" : "НЕ СОХРАНЯЕТСЯ МЕЖДУ СМЕНАМИ"}</span>
          </HudLabel>

          <div className="mt-3">
            <textarea
              className="field h-16 resize-none text-[0.72rem] leading-relaxed"
              placeholder={"Вставьте отчёт сканера построчно, напр.:\nArgenti r.II Rifle, 340\nBomastone Grenade: 12 ящ"}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              spellCheck={false}
            />
            <button
              className="btn btn-primary mt-2 h-8"
              onClick={() => {
                applyText(pasteText, "ручной ввод");
                setPasteText("");
              }}
              disabled={!pasteText.trim()}
            >
              <ScanSearch size={13} /> Разобрать отчёт
            </button>
          </div>

          <div className="scroll-area panel-inner mt-3 max-h-[46vh] min-h-[200px] flex-1 overflow-y-auto rounded p-1.5">
            {filteredStorage.length === 0 ? (
              <HudLabel className="flex h-full min-h-[160px] items-center justify-center text-white/35">
                <span className="pulse">ОЖИДАНИЕ ДАННЫХ СКЛАДА...</span>
              </HudLabel>
            ) : (
              <ul>
                {filteredStorage.map((r, i) => (
                  <li
                    key={`${r.name}-${i}`}
                    className="group flex items-center gap-3 border-b border-[var(--line)] px-1.5 py-2 last:border-0 hover:bg-white/[0.03]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded border border-[var(--line-2)] bg-neutral-900">
                      {iconTile(findItem(r.name), 28)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[0.8rem] font-semibold text-white/90">{r.name}</span>
                    <span className="font-mono text-[0.8rem] font-bold text-accent tabular-nums">{r.count}</span>
                    <span className="hud-label text-white/35">ШТ</span>
                    <button
                      className="btn h-6 !px-1.5 opacity-0 transition group-hover:opacity-100"
                      title="Перенести в заказ"
                      onClick={() => {
                        const item = findItem(r.name);
                        const next = [
                          ...order,
                          {
                            name: item?.ru ?? r.name,
                            code: item?.id ?? null,
                            qty: Math.max(1, Math.round(r.count / 20)),
                            unit: "ЯЩ" as const,
                          },
                        ];
                        persist(next);
                        notify("ok", `${r.name} перенесён в заказ`);
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Режим ЭКСПОРТ / ИМПОРТ */}
          <div className="mt-3 flex flex-col gap-2">
            <button
              className="btn w-full justify-between"
              title="Переключить режим панели"
              onClick={() => setMode((m) => (m === "export" ? "import" : "export"))}
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ color: "var(--accent)", background: mode === "export" ? "var(--accent)" : "#f59e0b" }}
                />
                РЕЖИМ: {mode === "export" ? "ЭКСПОРТ ДАННЫХ" : "ИМПОРТ ДАННЫХ"}
              </span>
              <span className="hud-label opacity-70">{mode === "export" ? "выгрузка рапортов" : "загрузка складов"}</span>
            </button>
            {mode === "export" ? (
              <div className="grid grid-cols-4 gap-2">
                <button className="btn h-[42px] px-1" title="Выгрузить рапорт в TXT" onClick={exportTxt} disabled={!order.length}>
                  <FileText size={16} />
                  <span className="hidden sm:inline">TXT</span>
                </button>
                <button className="btn h-[42px] px-1" title="Выгрузить таблицу XLSX" onClick={exportXls} disabled={!order.length}>
                  <TableIcon size={16} />
                  <span className="hidden sm:inline">XLSX</span>
                </button>
                <button
                  className="btn h-[42px] px-1"
                  title="Сформировать графическую страницу отчёта"
                  onClick={() => void exportPng()}
                  disabled={!order.length || busy}
                >
                  <ImageIcon size={16} />
                  <span className="hidden sm:inline">PNG</span>
                </button>
                <button className="btn h-[42px] px-1" title="Скопировать рапорт в буфер обмена" onClick={copyReport} disabled={!order.length}>
                  <ClipboardCopy size={16} />
                  <span className="hidden sm:inline">БУФЕР</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                <label className="btn h-[42px] cursor-pointer px-1" title="Загрузить JSON/TXT сканера">
                  <FileDown size={16} />
                  <span className="hidden sm:inline">ФАЙЛ</span>
                  <input
                    type="file"
                    accept=".txt,.csv,.json"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) applyText(await f.text(), f.name);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button className="btn h-[42px] px-1" title="Вставить из буфера обмена" onClick={pasteFromClipboard}>
                  <ArrowDownToLine size={16} />
                  <span className="hidden sm:inline">БУФЕР</span>
                </button>
                <button className="btn h-[42px] px-1" title="Загрузить демонстрационный склад" onClick={() => applyText(DEMO_STORAGE, "демо")}>
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">ДЕМО</span>
                </button>
                <button className="btn btn-danger h-[42px] px-1" title="Очистить монитор склада" onClick={clearStorage} disabled={!storage.rows.length}>
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">ОЧИСТ.</span>
                </button>
              </div>
            )}
          </div>
        </Panel>
        )}

        {/* ═══ КОНСТРУКТОР ЗАКАЗА ═══ */}
        {panels.constructor && (
        <Panel className="flex min-h-[560px] flex-col p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <PanelTitle className="flex items-center gap-2">
              <ListChecks size={15} /> Конструктор заказа
            </PanelTitle>
            <div className="flex items-center gap-2">
              <span className="badge-count">{order.length} ПОЗ.</span>
              <span className="badge-count">Σ {totalUnits}</span>
            </div>
          </div>
          <div className="stencil-line mt-2.5" />

          {/* Панель добавления */}
          <div className="panel-inner mt-3 rounded-md border p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(96px,1fr)_auto_auto]">
              <div
                className="field flex h-11 items-center gap-2.5 truncate text-[0.85rem] text-white/60"
                title={selected ? selected.title : "Выбрать предмет из матрицы ниже..."}
              >
                {selected ? (
                  <>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded border border-[var(--line-2)] bg-neutral-900">
                      {iconTile(selected, 24)}
                    </span>
                    <span className="truncate text-white">{selected.ru}</span>
                  </>
                ) : (
                  <span className="truncate">Выбрать предмет из матрицы ниже...</span>
                )}
              </div>
              <input
                className="field h-11 text-center font-bold tabular-nums"
                placeholder="КОЛ-ВО"
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <button
                className="btn h-11 min-w-[64px] px-3"
                title="Единица измерения: ящики / штуки"
                onClick={() => setUnit((u) => (u === "ЯЩ" ? "ШТ" : "ЯЩ"))}
              >
                {unit}
              </button>
              <button className="btn btn-primary h-11 px-5 text-sm" disabled={!selected} onClick={addLine}>
                <PackagePlus size={15} /> Добавить в заказ
              </button>
            </div>

            <div className="mt-4">
              <input
                className="field h-10 flex-1 text-[0.82rem]"
                placeholder="ИНТЕРАКТИВНЫЙ ФИЛЬТР МАТРИЦЫ ПРЕДМЕТОВ..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="scroll-area mt-3 flex gap-2 overflow-x-auto pb-1.5">
              {(["Все", ...ITEM_CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cx(
                    "hud-label h-8 shrink-0 rounded-sm border px-3 transition",
                    category === c
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-[var(--line-2)] text-white/45 hover:text-white",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="scroll-area panel-inner mt-3 h-[230px] overflow-y-auto rounded p-1">
              {matrix.map((item) => {
                const active = selected?.id === item.id;
                return (
                  <button
                    key={item.id}
                    title={item.title}
                    onClick={() => setSelected(item)}
                    className={cx(
                      "flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left transition",
                      active ? "bg-accent/10 ring-1 ring-accent/50" : "hover:bg-white/[0.04]",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded border border-emerald-900/30 bg-neutral-900"
                        style={{ width: 28, height: 28 }}
                      >
                        {iconTile(item)}
                      </span>
                      <span className={cx("truncate text-[0.8rem]", active ? "font-bold text-accent" : "text-white/85")}>
                        {item.ru}
                      </span>
                    </span>
                    <span className="hud-label shrink-0 !text-[0.52rem] text-white/30">{item.cat}</span>
                  </button>
                );
              })}
              {matrix.length === 0 && (
                <HudLabel className="flex h-24 items-center justify-center text-white/30">НИЧЕГО НЕ НАЙДЕНО</HudLabel>
              )}
            </div>
          </div>

          {/* Активный заказ */}
          <div className="mt-3 flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between">
              <HudLabel className="text-white/45">АКТИВНЫЙ ЗАКАЗ · {order.length} ПОЗ.</HudLabel>
              <button className="btn btn-danger h-7 !px-2" onClick={() => persist([])} disabled={!order.length}>
                <Trash2 size={12} />
              </button>
            </div>
            {order.length === 0 ? (
              <div className="mt-2 flex-1">
                <EmptyState icon={<ListChecks size={30} />} title="Заказ пуст" hint="ВЫБЕРИТЕ ПРЕДМЕТЫ ИЗ МАТРИЦЫ" />
              </div>
            ) : (
              <ul className="scroll-area mt-2 min-h-0 flex-1 overflow-y-auto pr-0.5">
                {order.map((l, i) => (
                  <li
                    key={`${l.name}-${l.unit}-${i}`}
                    className="mb-1.5 flex items-center gap-2.5 rounded-sm border border-[var(--line)] bg-black/25 px-2.5 py-1.5 last:mb-0"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded border border-[var(--line-2)] bg-neutral-900">
                      {iconTile(findItem(l.name), 28)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[0.78rem] font-bold text-white/90">{l.name}</span>
                    <div className="flex items-center gap-1">
                      <button className="btn h-6 w-6 !p-0" onClick={() => bumpLine(i, -1)}>
                        <Minus size={11} />
                      </button>
                      <span className="w-10 text-center font-mono text-[0.8rem] font-bold text-accent tabular-nums">{l.qty}</span>
                      <button className="btn h-6 w-6 !p-0" onClick={() => bumpLine(i, 1)}>
                        <Plus size={11} />
                      </button>
                    </div>
                    <span className="badge-count border-[var(--line-2)] !text-white/50">{l.unit}</span>
                    <button className="btn btn-danger h-6 w-6 !p-0" onClick={() => removeLine(i)}>
                      <X size={11} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn btn-primary mt-2.5 h-11 w-full" onClick={sendRaport} disabled={!order.length}>
              <Send size={15} /> Отправить рапорт в штаб
            </button>
          </div>
        </Panel>
        )}
      </div>

      {/* ═══ АРХИВ РАПОРТОВ ═══ */}
      {archive.length > 0 && (
        <Panel className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <PanelTitle>Архив рапортов смены</PanelTitle>
            <span className="badge-count">{archive.length}</span>
          </div>
          <ul className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {archive.slice(0, 6).map((r) => (
              <li key={r.id} className="panel-inner rounded-sm px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[0.72rem] font-bold text-white/85">{r.author}</span>
                  <span className="hud-label shrink-0 text-white/35">{formatDateTime(r.at)}</span>
                </div>
                <div className="mt-1.5 truncate text-[0.7rem] text-white/55">
                  {r.lines.slice(0, 2).map((l) => l.name).join(" · ")}
                  {r.lines.length > 2 && ` · +${r.lines.length - 2} поз.`}
                </div>
                <div className="hud-label mt-1.5 text-accent/80">
                  {r.lines.length} ПОЗ. / {r.totalUnits} ЕД.
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
