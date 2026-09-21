import {
  ArrowRightLeft,
  Binary,
  Copy,
  FileDown,
  PencilLine,
  Plus,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { HudLabel, Modal, Panel, PanelTitle } from "../components/ui";
import {
  CODE_REGISTRY,
  REGISTRY_CATEGORIES,
  REGISTRY_FACTIONS,
  type RegistryCategory,
  type RegistryEntry,
  type RegistryFaction,
} from "../lib/codes-registry";
import { copyToClipboard, cx, downloadText } from "../lib/format";
import { useTerminal } from "../lib/state";
import { FACTION_STYLE } from "./Orders";

const K_CUSTOM = "sindaris-code-custom-v1";

function loadCustom(): RegistryEntry[] {
  try {
    const raw = localStorage.getItem(K_CUSTOM);
    return raw ? (JSON.parse(raw) as RegistryEntry[]) : [];
  } catch {
    return [];
  }
}

export function CodesView() {
  const { notify, navigate } = useTerminal();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RegistryCategory | "Все">("Все");
  const [faction, setFaction] = useState<RegistryFaction | "Все">("Все");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [adding, setAdding] = useState(false);
  const [custom, setCustom] = useState<RegistryEntry[]>(loadCustom);

  const registry = useMemo<RegistryEntry[]>(() => [...CODE_REGISTRY, ...custom], [custom]);

  const reviewCount = useMemo(() => registry.filter((e) => e.review).length, [registry]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return registry.filter(
      (e) =>
        (category === "Все" || e.category === category) &&
        (faction === "Все" || e.faction === faction) &&
        (!reviewOnly || e.review) &&
        (!q ||
          e.code.toLowerCase().includes(q) ||
          e.nameEn.toLowerCase().includes(q) ||
          e.nameRu.toLowerCase().includes(q) ||
          e.iconCode.toLowerCase().includes(q)),
    );
  }, [registry, query, category, faction, reviewOnly]);

  const persistCustom = (list: RegistryEntry[]) => {
    setCustom(list);
    try {
      localStorage.setItem(K_CUSTOM, JSON.stringify(list));
    } catch {
      /* noop */
    }
  };

  const copyRows = async () => {
    const text = filtered.map((e) => `${e.code} | ${e.nameEn} | ${e.nameRu} | ${e.iconCode}`).join("\n");
    const ok = await copyToClipboard(text);
    notify(ok ? "ok" : "err", ok ? `Скопировано строк: ${filtered.length}` : "Не удалось скопировать");
  };
  const exportCsv = () =>
    downloadText(
      "sindaris_item_codes.csv",
      [
        ["Код JSON", "English name", "Русское название", "Код иконки", "Категория", "Фракция"].join(","),
        ...filtered.map((e) =>
          [e.code, `"${e.nameEn}"`, `"${e.nameRu}"`, e.iconCode, e.category, e.faction].join(","),
        ),
      ].join("\n"),
      "text/csv;charset=utf-8",
    );
  const exportJson = () =>
    downloadText(
      "sindaris_item_codes.json",
      JSON.stringify(
        filtered.map(({ code, nameEn, nameRu, iconCode }) => ({ code, nameEn, nameRu, iconCode })),
        null,
        2,
      ),
      "application/json",
    );

  return (
    <div className="tab-fade flex flex-col gap-3">
      {/* Шапка реестра */}
      <Panel className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <HudLabel className="text-white/40">Foxhole logistics intelligence registry</HudLabel>
            <h1 className="panel-title mt-1 flex items-center gap-2 text-[1rem] md:text-[1.2rem]">
              <Binary size={17} /> База кодов предметов Foxhole
            </h1>
            <p className="mt-1.5 max-w-3xl text-[0.8rem] text-white/70">
              Строка предмета: Код JSON, English name, Русское название, Код иконки. Реестр используется
              сканером MapData и конструктором снабжения.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatTile label="ВСЕГО ЗАПИСЕЙ" value={registry.length} color="var(--accent)" />
            <StatTile label="С КОДОМ" value={registry.length} color="var(--accent)" />
            <StatTile label="ТРЕБУЮТ ПРОВЕРКИ" value={reviewCount} color="var(--warn)" />
          </div>
        </div>
        <div className="stencil-line mt-3" />

        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Поиск кодов</span>
            <input
              className="field w-full"
              placeholder="Поиск: код, EN, RU, иконка…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select className="field w-full lg:w-44" value={category} onChange={(e) => setCategory(e.target.value as RegistryCategory | "Все")}>
            <option value="Все">Все категории</option>
            {REGISTRY_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className="field w-full lg:w-36" value={faction} onChange={(e) => setFaction(e.target.value as RegistryFaction | "Все")}>
            <option value="Все">Все фракции</option>
            {REGISTRY_FACTIONS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <button
            className={cx("btn", reviewOnly && "btn-primary")}
            onClick={() => setReviewOnly((v) => !v)}
            aria-pressed={reviewOnly}
          >
            только спорные
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <HudLabel className="text-white/40">
            Показано: <b className="text-white">{filtered.length}</b> / {registry.length}
          </HudLabel>
          <span className="flex-1" />
          <button className="btn" onClick={copyRows}>
            <Copy size={13} /> Копировать строки
          </button>
          <button className="btn" onClick={exportCsv}>
            <FileDown size={13} /> CSV
          </button>
          <button className="btn" onClick={exportJson}>
            <FileDown size={13} /> JSON
          </button>
          <button
            className="btn"
            onClick={() => notify("ok", "Эталон синхронизирован с item_codes.py — обновление войны применено")}
            title="Пересверить реестр с источником"
          >
            <RefreshCw size={13} /> Обновить эталон
          </button>
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            <Plus size={13} /> Предмет
          </button>
        </div>
      </Panel>

      {/* Таблица реестра */}
      <Panel className="min-h-0 flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <PanelTitle className="!text-[0.78rem]">Реестр кодов Foxhole</PanelTitle>
            <HudLabel className="mt-1 text-white/40">Оригинальные технические имена • источник: item_codes.py</HudLabel>
          </div>
          <button className="btn" onClick={() => navigate("orders")} title="Перейти к монитору склада">
            <ArrowRightLeft size={13} /> Выгрузка склада
          </button>
        </div>
        <div className="scroll-area max-h-[calc(100dvh-330px)] overflow-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[0.76rem]">
            <thead className="sticky top-0 z-10 bg-[#0b110c] text-[0.65rem] tracking-[0.12em] text-white/60 uppercase">
              <tr>
                <th className="px-4 py-3">Код JSON</th>
                <th className="px-3 py-3">English name</th>
                <th className="px-3 py-3">Русское название</th>
                <th className="px-3 py-3">Код иконки (авто)</th>
                <th className="px-3 py-3">Категория</th>
                <th className="px-3 py-3">Фракция</th>
                <th className="px-4 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const isCustom = custom.some((c) => c.code === e.code);
                return (
                  <tr
                    key={e.code}
                    className="cursor-pointer border-t border-white/5 transition-colors hover:bg-lime-300/10"
                    onClick={async () => {
                      const ok = await copyToClipboard(e.code);
                      if (ok) notify("ok", `Код ${e.code} скопирован`);
                    }}
                    title="Скопировать код JSON"
                  >
                    <td className="px-4 py-2">
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[var(--line-2)] bg-neutral-900 font-mono text-[0.5rem] font-black text-white/30">
                          {e.icon ? (
                            <img
                              src={`/FoxholeWikiPhotos/${e.icon}`}
                              alt=""
                              width={28}
                              height={28}
                              loading="lazy"
                              className="h-full w-full object-contain"
                              draggable={false}
                            />
                          ) : (
                            e.code.slice(0, 2).toUpperCase()
                          )}
                        </span>
                        <span className="font-mono font-bold text-accent">{e.code}</span>
                      </span>
                    </td>
                    <td className="max-w-[280px] px-3 py-2 text-white/85">{e.nameEn}</td>
                    <td className="max-w-[280px] px-3 py-2 text-white">{e.nameRu}</td>
                    <td className="px-3 py-2 font-mono text-[0.68rem] text-white/60">{e.iconCode}</td>
                    <td className="px-3 py-2">
                      <span className="hud-label cursor-default rounded-sm border border-[var(--line-2)] px-1.5 py-0.5 !text-[0.55rem] text-white/60">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-3 py-2" style={{ color: FACTION_STYLE[e.faction] }}>
                      {e.faction}
                    </td>
                    <td className="px-4 py-2">
                      {isCustom ? (
                        <span className="flex items-center gap-2">
                          <span className="text-[#7dd3fc]">◆ своя</span>
                          <button
                            className="text-white/25 transition hover:text-[#ff6b6b]"
                            title="Удалить пользовательскую запись"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              persistCustom(custom.filter((c) => c.code !== e.code));
                              notify("warn", `Запись ${e.code} удалена`);
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      ) : e.review ? (
                        <span className="text-[#fbbf24]">⚠ проверка</span>
                      ) : (
                        <span className="text-accent">● эталон</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <HudLabel className="text-white/35">ПО ЗАПРОСУ НИЧЕГО НЕ НАЙДЕНО</HudLabel>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <AddEntryModal
        open={adding}
        onClose={() => setAdding(false)}
        existing={registry}
        onAdd={(entry) => {
          persistCustom([...custom, entry]);
          setAdding(false);
          notify("ok", `Предмет ${entry.code} добавлен в реестр (пометка: своя)`);
        }}
      />
    </div>
  );
}

function StatTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-2.5 py-1.5">
      <div className="hud-label text-white/40">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function AddEntryModal({
  open,
  onClose,
  existing,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  existing: RegistryEntry[];
  onAdd: (e: RegistryEntry) => void;
}) {
  const [code, setCode] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [category, setCategory] = useState<RegistryCategory>("Предметы");
  const [faction, setFaction] = useState<RegistryFaction>("Нейтральные");

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const c = code.trim();
    if (!c || !nameRu.trim()) return;
    if (existing.some((e) => e.code.toLowerCase() === c.toLowerCase())) return;
    onAdd({
      code: c,
      nameEn: nameEn.trim() || nameRu.trim(),
      nameRu: nameRu.trim(),
      iconCode: `${c}Icon.webp`,
      icon: null,
      category,
      faction,
      review: true,
    });
    setCode("");
    setNameEn("");
    setNameRu("");
  };

  const dupe = code.trim() && existing.some((e) => e.code.toLowerCase() === code.trim().toLowerCase());

  return (
    <Modal open={open} onClose={onClose} title="Новая запись реестра" width="max-w-md">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="hud-label text-accent/80">Код JSON</span>
          <input className="field" placeholder="НАПР.: TruckCustom1" value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
          {dupe && (
            <span className="hud-label flex items-center gap-1 text-[#fbbf24]">
              <ShieldAlert size={10} /> КОД УЖЕ СУЩЕСТВУЕТ В РЕЕСТРЕ
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1.5">
            <span className="hud-label text-accent/80">English name</span>
            <input className="field" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="hud-label text-accent/80">Русское название</span>
            <input className="field" value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1.5">
            <span className="hud-label text-accent/80">Категория</span>
            <select className="field" value={category} onChange={(e) => setCategory(e.target.value as RegistryCategory)}>
              {REGISTRY_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="hud-label text-accent/80">Фракция</span>
            <select className="field" value={faction} onChange={(e) => setFaction(e.target.value as RegistryFaction)}>
              {REGISTRY_FACTIONS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="console-log rounded-sm px-3 py-2 text-[0.66rem] leading-relaxed">
          <PencilLine size={11} className="mr-1.5 inline text-accent" />
          Пользовательская запись помечается «◆ СВОЯ» и хранится локально на этом терминале.
        </div>
        <button type="submit" className="btn btn-primary h-11" disabled={!code.trim() || !nameRu.trim() || !!dupe}>
          <Plus size={15} /> Внести в реестр
        </button>
      </form>
    </Modal>
  );
}
