"use client";

import { CODE_BASE, CODE_BASE_CATEGORIES, CODE_BASE_FACTIONS, codeBaseToCsv, codeBaseToJson, type CodeBaseEntry, type CodeCategory, type CodeFaction } from "@/lib/code-base";
import { useMemo, useState } from "react";
import { useNotify } from "../providers/NotificationProvider";

interface RawStockpileRow {
  name: string;
  count: number;
}

interface RawCompareResult {
  total: number;
  nonZero: number;
  zero: number;
  matched: number;
  unknown: number;
  quantity: number;
  unknownNames: string[];
}

function normalizeRawName(value: string): string {
  return value
    .replace(/\s*\((?:ящик|ящ|штука|шт|crate|crates?)\)\s*$/iu, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^a-z0-9а-я]+/giu, "");
}

function parseRawStockpile(text: string): RawStockpileRow[] {
  const source = text.trim();
  if (!source) return [];

  // Поддерживаем также старый массив JSON, но основным форматом является
  // обычный текстовый clipboard-отчёт Foxhole.
  if (source.startsWith("[")) {
    const rows = JSON.parse(source) as Array<Record<string, unknown>>;
    return rows.flatMap((row) => {
      const name = String(row.nameRu ?? row.nameEn ?? row.name ?? row.code ?? "").trim();
      const count = Number(row.count ?? row.quantity ?? row.amount ?? 0);
      return name && Number.isFinite(count) ? [{ name, count }] : [];
    });
  }

  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const startsWithHeader = lines[0] && /\s-\s.*(?:X:\s*[-\d.]+|Public|Private)/i.test(lines[0]);
  const itemLines = startsWithHeader ? lines.slice(1) : lines;

  return itemLines.flatMap((line) => {
    const separator = line.lastIndexOf(",");
    if (separator < 1) return [];
    const name = line.slice(0, separator).trim();
    const count = Number(line.slice(separator + 1).trim());
    return name && Number.isFinite(count) ? [{ name, count: Math.max(0, count) }] : [];
  });
}

function findCodeBaseEntry(name: string, entries: CodeBaseEntry[]): CodeBaseEntry | null {
  const key = normalizeRawName(name);
  if (!key) return null;

  const exact = entries.find((entry) => [entry.code, entry.nameEn, entry.nameRu].some((value) => normalizeRawName(value) === key));
  if (exact) return exact;

  // Разрешаем небольшие различия в выгрузках: «120-мм»/«120мм снаряды».
  if (key.length < 4) return null;
  return entries.find((entry) => [entry.code, entry.nameEn, entry.nameRu].some((value) => {
    const candidate = normalizeRawName(value);
    return candidate.length >= 5 && (candidate.includes(key) || key.includes(candidate));
  })) ?? null;
}

function downloadText(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const EMPTY_NEW = { code: "", nameEn: "", nameRu: "", iconCode: "" };

export function CodeBaseWorkspace() {
  const notify = useNotify();
  const [entries, setEntries] = useState<CodeBaseEntry[]>(CODE_BASE);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CodeCategory | "Все категории">("Все категории");
  const [faction, setFaction] = useState<CodeFaction | "Все фракции">("Все фракции");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [rawExport, setRawExport] = useState("");
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareResult, setCompareResult] = useState<RawCompareResult | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newEntry, setNewEntry] = useState(EMPTY_NEW);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ru-RU");
    return entries.filter((entry) => {
      const searchable = `${entry.code} ${entry.nameEn} ${entry.nameRu} ${entry.iconCode ?? ""}`.toLocaleLowerCase("ru-RU");
      const matchesQuery = !needle || searchable.includes(needle);
      const matchesCategory = category === "Все категории" || entry.category === category;
      const matchesFaction = faction === "Все фракции" || entry.faction === faction;
      const matchesReview = !reviewOnly || entry.needsReview;
      return matchesQuery && matchesCategory && matchesFaction && matchesReview;
    });
  }, [category, entries, faction, query, reviewOnly]);

  const reviewCount = useMemo(() => entries.filter((entry) => entry.needsReview).length, [entries]);

  const copyRows = async () => {
    try {
      await navigator.clipboard.writeText(codeBaseToJson(filtered));
      notify({ title: "БАЗА КОДОВ", message: `Скопировано строк: ${filtered.length}`, tone: "success" });
    } catch {
      notify({ title: "БУФЕР ОБМЕНА", message: "Браузер не разрешил доступ к буферу обмена.", tone: "warning" });
    }
  };

  const compareJson = () => {
    try {
      const rows = parseRawStockpile(rawExport);
      if (!rows.length) throw new Error("Не найдено строк склада в формате «Название (Ящик),количество»");

      const matchedCodes = new Set<string>();
      const unknownNames: string[] = [];
      let nonZero = 0;
      let zero = 0;
      let quantity = 0;

      for (const row of rows) {
        if (row.count > 0) {
          nonZero += 1;
          quantity += row.count;
        } else {
          zero += 1;
        }
        const match = findCodeBaseEntry(row.name, entries);
        if (match) matchedCodes.add(match.code);
        else if (!unknownNames.includes(row.name)) unknownNames.push(row.name);
      }

      const result: RawCompareResult = {
        total: rows.length,
        nonZero,
        zero,
        matched: matchedCodes.size,
        unknown: unknownNames.length,
        quantity,
        unknownNames,
      };
      setCompareResult(result);
      notify({
        title: "СРАВНЕНИЕ ВЫГРУЗКИ СКЛАДА",
        message: `Строк: ${result.total} • совпало кодов: ${result.matched} • неизвестных: ${result.unknown} • ненулевых: ${result.nonZero}`,
        tone: result.unknown ? "warning" : "success",
      });
    } catch (error) {
      setCompareResult(null);
      notify({ title: "ВЫГРУЗКА СКЛАДА", message: (error as Error).message || "Невалидная выгрузка", tone: "danger" });
    }
  };

  const addEntry = () => {
    const code = newEntry.code.trim();
    const nameEn = newEntry.nameEn.trim();
    const nameRu = newEntry.nameRu.trim();
    if (!code || !nameEn || !nameRu) {
      notify({ title: "НОВАЯ ЗАПИСЬ", message: "Заполните код, English name и русское название.", tone: "warning" });
      return;
    }
    if (entries.some((entry) => entry.code.toLocaleLowerCase() === code.toLocaleLowerCase())) {
      notify({ title: "НОВАЯ ЗАПИСЬ", message: `Код ${code} уже есть в реестре.`, tone: "warning" });
      return;
    }
    setEntries((prev) => [
      ...prev,
      {
        code,
        nameEn,
        nameRu,
        iconCode: newEntry.iconCode.trim() || `${code}Icon`,
        iconFile: null,
        origin: "item",
        category: "Предметы",
        faction: "Нейтральные",
        needsReview: true,
      },
    ]);
    setNewEntry(EMPTY_NEW);
    setAddOpen(false);
    notify({ title: "НОВАЯ ЗАПИСЬ", message: `Код ${code} добавлен в локальную рабочую копию.`, tone: "success" });
  };

  return (
    <div className="tab-fade flex min-h-full flex-col gap-3">
      <section className="panel panel-corners rounded-md p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="hud-label text-muted">Foxhole logistics intelligence registry</div>
            <h1 className="panel-title mt-1 text-[1rem] md:text-[1.2rem]">⌘ База кодов предметов Foxhole</h1>
            <p className="mt-1 max-w-3xl text-[0.8rem] text-white/70">Строка предмета: Код JSON, English name, Русское название, Код иконки. Реестр используется сканером MapData и конструктором снабжения.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Stat label="ВСЕГО ЗАПИСЕЙ" value={entries.length} />
            <Stat label="С КОДОМ" value={entries.filter((entry) => entry.iconCode).length} color="var(--accent)" />
            <Stat label="ТРЕБУЮТ ПРОВЕРКИ" value={reviewCount} color="var(--warn)" />
          </div>
        </div>
        <div className="stencil-line mt-3" />

        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Поиск кодов</span>
            <input className="field field-mono w-full" placeholder="Поиск: код, EN, RU, иконка…" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className="field w-full lg:w-44" value={category} onChange={(event) => setCategory(event.target.value as CodeCategory | "Все категории")}>
            <option>Все категории</option>
            {CODE_BASE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field w-full lg:w-36" value={faction} onChange={(event) => setFaction(event.target.value as CodeFaction | "Все фракции")}>
            <option>Все фракции</option>
            {CODE_BASE_FACTIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className={`btn ${reviewOnly ? "btn-active btn-warn" : ""}`} onClick={() => setReviewOnly((value) => !value)}>
            {reviewOnly ? "✓ только спорные" : "только спорные"}
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="hud-label text-muted">Показано: <b className="text-white">{filtered.length}</b> / {entries.length}</span>
          <span className="flex-1" />
          <button className="btn" onClick={() => void copyRows()}>⧉ Копировать строки</button>
          <button className="btn" onClick={() => downloadText(codeBaseToCsv(filtered), "sindaris-code-base.csv", "text/csv;charset=utf-8")}>CSV</button>
          <button className="btn" onClick={() => downloadText(codeBaseToJson(filtered), "sindaris-code-base.json", "application/json;charset=utf-8")}>JSON</button>
          <button className="btn" onClick={() => { setEntries(CODE_BASE); setCompareResult(null); notify({ title: "ЭТАЛОН", message: "Рабочая копия сброшена к официальному реестру.", tone: "info" }); }}>⟳ Обновить эталон</button>
          <button className="btn btn-primary" onClick={() => setAddOpen((value) => !value)}>＋ Предмет</button>
        </div>
      </section>

      {addOpen && (
        <section className="panel rounded-md p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="panel-title mr-auto text-[0.78rem]">Добавить строку в рабочую копию</h2>
            <input className="field w-full sm:w-40" placeholder="Код из JSON" value={newEntry.code} onChange={(event) => setNewEntry({ ...newEntry, code: event.target.value })} />
            <input className="field w-full sm:w-48" placeholder="English name" value={newEntry.nameEn} onChange={(event) => setNewEntry({ ...newEntry, nameEn: event.target.value })} />
            <input className="field w-full sm:w-48" placeholder="Русское название" value={newEntry.nameRu} onChange={(event) => setNewEntry({ ...newEntry, nameRu: event.target.value })} />
            <input className="field w-full sm:w-44" placeholder="IconCode (авто)" value={newEntry.iconCode} onChange={(event) => setNewEntry({ ...newEntry, iconCode: event.target.value })} />
            <button className="btn btn-primary" onClick={addEntry}>Добавить</button>
          </div>
        </section>
      )}

      {compareOpen && (
        <section className="panel rounded-md p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="panel-title mr-auto text-[0.78rem]">Сравнение с сырой выгрузкой склада</h2>
            {compareResult && <span className="hud-label text-muted">строк: {compareResult.total} • совпало: {compareResult.matched} • неизвестных: {compareResult.unknown} • ненулевых: {compareResult.nonZero} • Σ: {compareResult.quantity}</span>}
            <button className="btn" onClick={() => setCompareOpen(false)}>Свернуть</button>
          </div>
          <textarea className="field field-mono mt-3 h-48 resize-y text-xs" placeholder={'Вставьте текстовый отчёт Foxhole:\nClanshead Valley - The King - Морской порт - Public - X: 0.49 Y: 0.38,2026.09.20-08.25.33\nНазвание предмета (Ящик),0\nНазвание техники,1'} value={rawExport} onChange={(event) => setRawExport(event.target.value)} />
          {compareResult?.unknownNames.length ? <div className="mt-2 text-xs text-warn">Не найдены в реестре: {compareResult.unknownNames.slice(0, 8).join(" • ")}{compareResult.unknownNames.length > 8 ? ` • ещё ${compareResult.unknownNames.length - 8}` : ""}</div> : null}
          <div className="mt-2 flex justify-end"><button className="btn btn-primary" onClick={compareJson}>Сравнить выгрузку</button></div>
        </section>
      )}

      <section className="panel panel-corners min-h-0 flex-1 overflow-hidden rounded-md">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="panel-title text-[0.78rem]">Реестр кодов Foxhole</h2>
            <div className="hud-label mt-1 text-muted">Оригинальные технические имена • источник: item_codes.py</div>
          </div>
          <button className={`btn ${compareOpen ? "btn-active" : ""}`} onClick={() => setCompareOpen((value) => !value)}>⇄ ВЫГРУЗКА СКЛАДА</button>
        </div>
        <div className="scroll-area max-h-[calc(100dvh-330px)] overflow-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[0.76rem]">
            <thead className="sticky top-0 z-10 bg-[#0b110c] text-[0.65rem] uppercase tracking-[0.12em] text-white/60">
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
              {filtered.map((entry) => (
                <tr key={entry.code} className="border-t border-white/5 transition-colors hover:bg-lime-300/10">
                  <td className="px-4 py-2 font-mono font-bold text-accent">{entry.code}</td>
                  <td className="max-w-[280px] px-3 py-2 text-white/85">{entry.nameEn}</td>
                  <td className="max-w-[280px] px-3 py-2 text-white">{entry.nameRu}</td>
                  <td className="px-3 py-2 font-mono text-[0.68rem] text-white/60">{entry.iconCode ?? "—"}</td>
                  <td className="px-3 py-2"><span className="chip cursor-default">{entry.category}</span></td>
                  <td className="px-3 py-2 text-white/70">{entry.faction}</td>
                  <td className="px-4 py-2">{entry.needsReview ? <span className="text-warn">⚠ проверка</span> : <span className="text-safe">● эталон</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="hud-label px-4 py-12 text-center text-muted">По заданным фильтрам записей не найдено.</div>}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, color = "var(--accent)" }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded border border-white/10 bg-black/20 px-2.5 py-1.5">
      <div className="hud-label text-muted">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
