"use client";

import { EXTERNAL_TOOLS, iconPath, type ExternalTool } from "@/lib/constants";
import Image from "next/image";
import { useState } from "react";
import { FactoryWorkspace } from "./FactoryWorkspace";
import { RefineryWorkspace } from "./RefineryWorkspace";

// ───────────────────────── ИНСТРУМЕНТЫ КЛАНА (вкладки верхней панели) ─────────────────────────
type ClanToolId = "factory" | "mpf" | "refinery";

interface ClanTool {
  id: ClanToolId;
  label: string;
  hint: string;
  icon: string;
}

const CLAN_TOOLS: readonly ClanTool[] = [
  { id: "factory", label: "Калькулятор фабрики", hint: "Factory • очередь, лимиты, материалы", icon: iconPath("business") },
  { id: "mpf", label: "MPF", hint: "Mass Production Factory • скидка за партию", icon: iconPath("conveyor-belt") },
  { id: "refinery", label: "Калькулятор молотка (Refinery)", hint: "Сырьё → материалы • время переработки", icon: iconPath("pallets") },
];

function isClanToolId(value: unknown): value is ClanToolId {
  return typeof value === "string" && CLAN_TOOLS.some((tool) => tool.id === value);
}

// ───────────────────────── ВНЕШНИЕ ИНСТРУМЕНТЫ ─────────────────────────
// Массив EXTERNAL_TOOLS живёт в src/lib/constants.ts (вне зоны правок этой задачи), поэтому карточка
// «ANV Foxhole ToolHub» заменяется здесь — с сохранением её иконки, позиции и стилей карточки.
const REPLACED_EXTERNAL_TOOL = "ANV Foxhole ToolHub";
const FOXWAR_TOOL: Omit<ExternalTool, "icon"> = {
  name: "FoxWar.net",
  url: "https://foxwar.net/",
  description:
    "Интерактивная карта для планирования и арты с функцией команд для одновременного отображения у участников команды. Лучший в своей сфере инструментарий",
  // .external-tool-tag выводит тег капсом → «КАЛЬКУЛЯТОРЫ ПРОИЗВОДСТВА».
  tag: "Калькуляторы производства",
};
const FOXWAR_FALLBACK_ICON = "🧮";

function buildExternalTools(source: readonly ExternalTool[]): ExternalTool[] {
  const index = source.findIndex((tool) => tool.name === REPLACED_EXTERNAL_TOOL);
  if (index === -1) {
    // Если ANV уже убрали из constants.ts — не теряем FoxWar и не дублируем его.
    return source.some((tool) => tool.url === FOXWAR_TOOL.url) ? [...source] : [{ ...FOXWAR_TOOL, icon: FOXWAR_FALLBACK_ICON }, ...source];
  }
  return source.map((tool, position) => (position === index ? { ...FOXWAR_TOOL, icon: tool.icon } : tool));
}

const CLAN_EXTERNAL_TOOLS = buildExternalTools(EXTERNAL_TOOLS);

interface ToolsWorkspaceProps {
  /** Вкладка из адреса /tools?tool=factory|mpf|refinery (невалидные значения игнорируются). */
  initialTool?: string | null;
}

export function ToolsWorkspace({ initialTool = null }: ToolsWorkspaceProps) {
  // null = ни один инструмент клана не выбран → показываются внешние инструменты.
  const [activeTool, setActiveTool] = useState<ClanToolId | null>(isClanToolId(initialTool) ? initialTool : null);

  function selectTool(next: ClanToolId | null) {
    setActiveTool(next);
    // Адрес синхронизируется без перезагрузки, чтобы вкладку можно было обновить или отправить ссылкой.
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("tool", next);
    else url.searchParams.delete("tool");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <div className="tab-fade tools-page">
      <section className="panel panel-corners tools-header">
        <div className="flex min-w-0 items-center gap-3">
          <span className="tools-signal" aria-hidden />
          <div className="min-w-0">
            <div className="hud-label text-muted">SINDARIS FIELD UTILITIES</div>
            <h1 className="panel-title mt-1 text-[1.05rem] md:text-[1.3rem]">▣ Инструменты</h1>
            <p className="mt-1 text-sm text-white/70">Калькуляторы клана и проверенные внешние сервисы Foxhole.</p>
          </div>
        </div>
        <span className="tools-header-status">
          <span className="status-dot" /> {CLAN_TOOLS.length} МОДУЛЯ • {CLAN_EXTERNAL_TOOLS.length} ССЫЛОК
        </span>
      </section>

      {/* ВЕРХНЯЯ ПАНЕЛЬ: вкладки инструментов клана. Повторный клик по активной вкладке сбрасывает выбор. */}
      <nav className="panel panel-corners rounded-md p-2.5" aria-label="Инструменты клана">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
          <span className="hud-label text-accent">ИНСТРУМЕНТЫ КЛАНА • OFFLINE READY</span>
          {activeTool ? (
            <button type="button" className="btn btn-danger px-2 py-1" onClick={() => selectTool(null)}>
              ✕ Сбросить выбор
            </button>
          ) : (
            <span className="hud-label text-muted">Выберите вкладку</span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-orientation="horizontal">
          {CLAN_TOOLS.map((tool) => {
            const active = tool.id === activeTool;
            return (
              <button
                key={tool.id}
                type="button"
                role="tab"
                id={`clan-tool-tab-${tool.id}`}
                aria-selected={active}
                aria-controls={active ? "clan-tool-panel" : undefined}
                className={`btn h-auto min-h-[58px] min-w-[13.5rem] flex-1 justify-start gap-3 px-3 py-2 text-left whitespace-normal ${active ? "btn-active" : ""}`}
                onClick={() => selectTool(active ? null : tool.id)}
                title={active ? "Повторный клик сбрасывает выбор" : tool.hint}
              >
                <Image src={tool.icon} alt="" width={36} height={36} unoptimized className="ui-icon h-9 w-9 shrink-0 object-contain" />
                <span className="min-w-0">
                  <span className={`block text-[0.78rem] ${active ? "text-accent" : "text-white"}`}>{tool.label}</span>
                  <span className="mt-1 block text-[0.62rem] font-normal tracking-normal text-white/60 normal-case">{tool.hint}</span>
                </span>
                {active ? <span className="status-dot ml-auto shrink-0" style={{ color: "var(--accent)", background: "var(--accent)" }} aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      </nav>

      {/* АКТИВНЫЙ ИНСТРУМЕНТ КЛАНА. Factory и MPF — один экземпляр, поэтому очередь сохраняется при переключении
          (удобно сравнить стоимость со скидкой MPF). Обёртка без .panel: его backdrop-filter ломает fixed-блок итогов. */}
      {activeTool ? (
        <div id="clan-tool-panel" role="tabpanel" aria-labelledby={`clan-tool-tab-${activeTool}`} className="min-w-0">
          {activeTool === "refinery" ? <RefineryWorkspace /> : null}
          {activeTool === "factory" || activeTool === "mpf" ? <FactoryWorkspace facility={activeTool} /> : null}
        </div>
      ) : null}

      {/* НИЖНЯЯ ЧАСТЬ: внешние инструменты. Рендерятся только пока вкладка не выбрана (через состояние, не CSS). */}
      {activeTool === null ? (
        <section className="panel panel-corners rounded-md p-4">
          <div className="flex items-center gap-2">
            <span className="hud-label text-accent">СТОРОННИЕ РЕСУРСЫ</span>
            <span className="badge-count min-w-0 px-2">{CLAN_EXTERNAL_TOOLS.length} ССЫЛОК</span>
          </div>
          <h2 className="panel-title mt-1 text-[0.95rem]">🔗 Внешние инструменты клана</h2>
          <p className="mt-1 text-[0.8rem] text-white/65">Проверенные сторонние сервисы для производства, планирования баз, артиллерии и воздушного боя.</p>
          <div className="external-tools-grid mt-3">
            {CLAN_EXTERNAL_TOOLS.map((tool) => (
              <a key={tool.url} className="external-tool-card" href={tool.url} target="_blank" rel="noreferrer">
                <span className="external-tool-icon" aria-hidden>{tool.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="external-tool-tag">{tool.tag}</span>
                  <span className="external-tool-name">{tool.name}</span>
                  <span className="external-tool-desc">{tool.description}</span>
                </span>
                <span className="external-tool-arrow" aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
