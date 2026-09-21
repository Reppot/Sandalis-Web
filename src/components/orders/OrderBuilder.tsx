"use client";

import { iconPath } from "@/lib/constants";
import { ITEM_CATALOG, ITEM_CATEGORIES, type ItemCategory } from "@/lib/item-catalog";
import { formatDateTime } from "@/lib/time";
import type { ExportFormat, OrderLine, OrderUnit, PanelMode, SavedOrderDTO } from "@/lib/types";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AllReportsModal } from "./AllReportsModal";
import { ExportBar } from "./ExportBar";
import { GameItemIcon } from "./GameItemIcon";

interface Props {
  order: OrderLine[];
  onAdd: (line: OrderLine) => void;
  onRemove: (name: string) => void;
  onAdjust: (name: string, delta: number) => void;
  onClear: () => void;
  savedOrders: SavedOrderDTO[];
  savedOrdersLoading: boolean;
  onSave: (title: string) => Promise<boolean>;
  onLoadSaved: (o: SavedOrderDTO) => void;
  onDeleteSaved: (id: number) => void;
  mode: PanelMode;
  isFullWidth: boolean;
  onToggleMode: () => void;
  onAction: (fmt: ExportFormat) => void;
  busy: boolean;
}

const PLACEHOLDER = "Выбрать предмет из матрицы ниже...";

export function OrderBuilder({ order, onAdd, onRemove, onAdjust, onClear, savedOrders, savedOrdersLoading, onSave, onLoadSaved, onDeleteSaved, mode, isFullWidth, onToggleMode, onAction, busy }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [count, setCount] = useState("");
  const [unit, setUnit] = useState<OrderUnit>("ящ.");
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState<ItemCategory | "Все">("Все");
  const [confirmClear, setConfirmClear] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [allReportsOpen, setAllReportsOpen] = useState(false);
  const countRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!confirmClear) return;
    const t = window.setTimeout(() => setConfirmClear(false), 3000);
    return () => window.clearTimeout(t);
  }, [confirmClear]);

  const matrix = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const pool = category === "Все" ? ITEM_CATALOG : ITEM_CATALOG.filter((i) => i.category === category);
    if (!q) return pool;
    const starts = pool.filter((i) => i.name.toLowerCase().startsWith(q));
    const includes = pool.filter((i) => !i.name.toLowerCase().startsWith(q) && (i.name.toLowerCase().includes(q) || (i.en ?? "").toLowerCase().includes(q) || (i.code ?? "").toLowerCase().includes(q)));
    return [...starts, ...includes];
  }, [filter, category]);

  const totalUnits = useMemo(() => order.reduce((a, l) => a + l.count, 0), [order]);

  const submit = () => {
    const n = parseInt(count, 10);
    if (!selected || !Number.isFinite(n) || n <= 0) {
      countRef.current?.focus();
      return;
    }
    onAdd({ name: selected, count: n, unit });
    setCount("");
  };

  const handleClear = () => {
    if (!order.length) return;
    if (confirmClear) {
      onClear();
      setConfirmClear(false);
    } else setConfirmClear(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(title.trim());
    if (ok) setTitle("");
    setSaving(false);
  };

  return (
    <section className="panel panel-corners flex flex-col rounded-md p-4 lg:min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="panel-title flex items-center gap-2">
          <Image src={iconPath("parchment")} alt="" width={22} height={22} unoptimized className="ui-icon h-[22px] w-[22px] object-contain" />
          🛠️ Конструктор заказа
        </h2>
        <div className="flex items-center gap-2">
          <span className="badge-count min-w-0 px-2">{order.length} ПОЗ.</span>
          <span className="badge-count min-w-0 px-2">Σ {totalUnits}</span>
        </div>
      </div>
      <div className="stencil-line mt-2" />

      <div className={`order-builder-controls mt-4 rounded-md border border-emerald-900/60 bg-black/25 ${isFullWidth ? "px-5 py-8" : "px-3 py-6"}`}>
        {/* Верхний блок: выбранный предмет, количество и единица */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,3fr)_minmax(120px,1fr)_auto_auto]">
          <div className={`field flex h-12 items-center truncate text-base sm:col-span-1 ${selected ? "text-accent" : "text-white/50"}`} title={selected ?? PLACEHOLDER}>
            <span className="truncate">{selected ?? PLACEHOLDER}</span>
          </div>
          <input
            ref={countRef}
            className="field field-mono h-12 text-base"
            placeholder="КОЛ-ВО"
            inputMode="numeric"
            value={count}
            onChange={(e) => setCount(e.target.value.replace(/[^\d]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button
            className="btn h-12 min-w-[64px] px-3 text-base"
            onClick={() => setUnit((u) => (u === "ящ." ? "шт." : "ящ."))}
            style={unit === "шт." ? { background: "#ff9900", color: "#000", borderColor: "#ff9900" } : undefined}
            title="Единица измерения: ящики / штуки"
          >
            {unit === "ящ." ? "ЯЩ" : "ШТ"}
          </button>
          <button className="btn btn-primary h-12 px-5 text-sm" onClick={submit} disabled={!selected}>
            Добавить в заказ
          </button>
        </div>

        {/* Поиск и фильтрация */}
        <div className="mt-5 flex items-center gap-3">
          <input className="field h-12 flex-1 text-base" placeholder="🔍 ИНТЕРАКТИВНЫЙ ФИЛЬТР МАТРИЦЫ ПРЕДМЕТОВ..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Image src={iconPath("find")} alt="" width={40} height={40} unoptimized className="ui-icon hidden h-10 w-10 object-contain sm:block" />
        </div>
        <div className="scroll-area mt-4 flex gap-2 overflow-x-auto pb-2">
          {(["Все", ...ITEM_CATEGORIES] as const).map((c) => (
            <button key={c} className={`chip h-10 shrink-0 px-4 text-sm ${category === c ? "is-active" : ""}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Матрица предметов */}
        <div className="mt-5 flex gap-3">
          <div className={`scroll-area panel-inner ${isFullWidth ? "grid h-[300px] grid-cols-2 gap-1.5 p-2 xl:grid-cols-3" : "h-[190px] p-1"} flex-1 rounded`}>
            {matrix.length === 0 ? (
              <div className="hud-label col-span-full flex h-full items-center justify-center text-muted">Ничего не найдено</div>
            ) : (
              matrix.map((item) => (
                <button key={`${item.code ?? ""}-${item.name}`} className={`matrix-item ${isFullWidth ? "min-h-[76px] px-3" : ""} ${selected === item.name ? "is-selected" : ""}`} onClick={() => setSelected(item.name)} title={item.en ?? item.name}>
                  <span className="flex min-w-0 items-center gap-3">
                    <GameItemIcon name={item.name} size={isFullWidth ? 64 : 28} />
                    <span className={`truncate ${isFullWidth ? "text-base font-semibold" : ""}`}>{item.name}</span>
                  </span>
                  <span className="matrix-cat shrink-0">{item.category}</span>
                </button>
              ))
            )}
          </div>
          <button
            className={`btn ${isFullWidth ? "h-[300px]" : "h-[190px]"} w-[58px] flex-col px-0 ${confirmClear ? "btn-danger btn-active" : "btn-danger"}`}
            onClick={handleClear}
            title="⚠️ ПОЛНАЯ ОЧИСТКА ТЕКУЩЕГО ЗАКАЗА"
            disabled={!order.length}
          >
            <span className="text-xl">🗑</span>
            <span className="hud-label" style={{ writingMode: "vertical-rl" }}>
              {confirmClear ? "ПОДТВЕРДИТЬ?" : "ОЧИСТИТЬ"}
            </span>
          </button>
        </div>
      </div>

      <div className="order-divider" aria-hidden />

      {/* Заказ */}
      <div className="scroll-area panel-inner mt-10 max-h-[40vh] min-h-[180px] flex-1 rounded p-2 lg:max-h-none lg:min-h-0">
        {order.length === 0 ? (
          <div className="empty-order flex h-[45px] items-center justify-center rounded px-3 text-center text-[0.8rem]">Заказ пуст. Выберите предметы из матрицы выше...</div>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {order.map((line) => (
              <li key={line.name} className="row-item group min-w-0">
                <span className="flex min-w-0 items-center gap-2">
                  <GameItemIcon name={line.name} size={isFullWidth ? 64 : 32} />
                  <span className={`truncate text-white ${isFullWidth ? "text-base font-semibold" : "text-[0.82rem]"}`}>• {line.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <button className="btn px-1.5 py-0.5 opacity-60 group-hover:opacity-100" onClick={() => onAdjust(line.name, -1)} title="−1">
                    −
                  </button>
                  <span className="badge-count min-w-[85px]">
                    {line.count} {line.unit}
                  </span>
                  <button className="btn px-1.5 py-0.5 opacity-60 group-hover:opacity-100" onClick={() => onAdjust(line.name, 1)} title="+1">
                    +
                  </button>
                  <button className="btn btn-danger px-1.5 py-0.5 opacity-60 group-hover:opacity-100" onClick={() => onRemove(line.name)} title="Убрать из заказа">
                    ✕
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Рапорт в штаб */}
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input className="field field-mono flex-1 text-xs" placeholder="Название рапорта (необязательно)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !order.length}>
          {saving ? "ПЕРЕДАЧА..." : "📨 Отправить рапорт в штаб"}
        </button>
      </div>
      {/* 📋 Логи заказов — общий журнал ВСЕХ рапортов штаба. Просмотр и загрузка доступны
          независимо от того, есть ли у текущего пользователя собственный сохранённый рапорт. */}
      <section className="mt-2 rounded border border-white/10 bg-black/25 px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="hud-label text-accent">📋 ЛОГИ ЗАКАЗОВ</span>
            <span className="badge-count min-w-0 px-2">{savedOrders.length} ВСЕГО</span>
          </div>
          <button className="btn px-3 py-1 text-xs" onClick={() => setAllReportsOpen(true)}>
            🗂️ Все рапорты штаба
          </button>
        </div>
        {savedOrders.length > 0 && (
          <ul className="scroll-area mt-2 flex max-h-32 flex-col gap-1">
            {savedOrders.slice(0, 5).map((o) => (
              <li key={o.id} className="row-item min-h-[30px] py-0.5">
                <span className="min-w-0 truncate text-[0.75rem]">
                  <span className="text-white">{o.title}</span>
                  <span className="hud-label ml-2 text-muted">{formatDateTime(o.createdAt)} • {o.items.length} поз.</span>
                </span>
                <span className="flex shrink-0 gap-1">
                  <button className="btn px-2 py-0.5" onClick={() => onLoadSaved(o)} title="Загрузить в конструктор">
                    ⤴
                  </button>
                  <button className="btn btn-danger px-2 py-0.5" onClick={() => onDeleteSaved(o.id)} title="Удалить рапорт">
                    ✕
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ExportBar mode={mode} onToggleMode={onToggleMode} onAction={onAction} busy={busy} />

      <AllReportsModal
        open={allReportsOpen}
        onClose={() => setAllReportsOpen(false)}
        orders={savedOrders}
        loading={savedOrdersLoading}
        onLoad={(o) => {
          onLoadSaved(o);
          setAllReportsOpen(false);
        }}
        onDelete={onDeleteSaved}
      />
    </section>
  );
}
