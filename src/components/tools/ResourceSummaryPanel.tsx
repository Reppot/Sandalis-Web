"use client";

import { useState, type ReactNode } from "react";
import { ToolExportBar } from "./ToolExportBar";
import { ToolItemIcon } from "./ToolControls";
import type { ToolReport, ToolReportLine } from "./tool-export";

interface ResourceSummaryPanelProps {
  /** Данные расчёта: название инструмента, режим, выбранные предметы, итоговые ресурсы, сводка. */
  report: ToolReport;
  /** Заголовок блока: «Производственная очередь», «Очередь переработки». */
  title: string;
  /** Подсказка, когда ничего не выбрано. */
  emptyHint: string;
  /** Строки выбранных предметов (иконка + степпер) — их рисует сам калькулятор. */
  children?: ReactNode;
  onClear: () => void;
}

function formatValue(value: number | string): string {
  return typeof value === "number" ? value.toLocaleString("ru-RU") : value;
}

function TotalCell({ line }: { line: ToolReportLine }) {
  return (
    <div className="min-w-0">
      <span className="flex min-w-0 items-center gap-1.5">
        {line.icon ? <ToolItemIcon sources={[line.icon]} size={28} label={line.name} /> : null}
        <span className="hud-label truncate text-muted">{line.name}</span>
      </span>
      <strong className="truncate">{formatValue(line.quantity)}</strong>
    </div>
  );
}

/**
 * Плавающий блок итоговых ресурсов — общий для всех калькуляторов клана (задачи 6–7).
 *
 * Один и тот же элемент меняет поведение по брейкпоинтам (без дублирования разметки):
 *  - телефоны (< md): аккордеон, закреплённый внизу над MobileNav (MobileNav: bottom-2 + h-14 + p-1.5 ≈ 76px);
 *  - планшеты (md…lg): свёрнутая карточка в правом нижнем углу (MobileNav там скрыт);
 *  - ПК (≥ lg): правая колонка с position: sticky; top: 0. На lg прокручивается <main>, а шапка
 *    находится вне <main>, поэтому блок прилипает под шапкой и не перекрывает её.
 * Важно: не вкладывать блок внутрь элемента с классом .panel — его backdrop-filter ломает position: fixed.
 */
export function ResourceSummaryPanel({ report, title, emptyHint, children, onClear }: ResourceSummaryPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = report.items.length;
  const preview = report.resources
    .slice(0, 3)
    .map((line) => `${line.name} ${formatValue(line.quantity)}`)
    .join(" · ");

  return (
    <aside
      aria-label={`${title}: итоговые ресурсы`}
      className={[
        "panel panel-corners z-[55] flex flex-col rounded-md",
        "fixed inset-x-2 bottom-[5.25rem] max-h-[calc(100dvh-7rem)]",
        "md:left-auto md:right-3 md:bottom-3 md:w-[26rem]",
        "lg:sticky lg:top-0 lg:right-auto lg:bottom-auto lg:left-auto lg:z-auto lg:w-auto lg:max-h-[calc(100dvh-9.5rem)] lg:self-start",
      ].join(" ")}
    >
      {/* Шапка аккордеона — только телефоны/планшеты */}
      <button
        type="button"
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left lg:hidden"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
      >
        <span className="status-dot shrink-0" style={{ color: "var(--accent)", background: "var(--accent)" }} />
        <span className="min-w-0 flex-1">
          <span className="panel-title block truncate">{report.toolName}</span>
          <span className="hud-label mt-0.5 block truncate text-muted">
            {count ? `${count} поз. • ${preview || "ресурсы не требуются"}` : "Ничего не выбрано"}
          </span>
        </span>
        <span className="hud-label shrink-0 text-accent">{mobileOpen ? "▼ Свернуть" : "▲ Итоги"}</span>
      </button>

      {/* Содержимое: на мобильных — по состоянию аккордеона, на ПК — всегда */}
      <div
        className={`${mobileOpen ? "flex" : "hidden"} min-h-0 flex-1 flex-col overflow-y-auto border-t border-white/10 p-3 lg:flex lg:overflow-hidden lg:border-t-0 lg:p-4`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="panel-title">{title}</div>
            <div className="hud-label mt-1 text-muted">{report.subtitle}</div>
          </div>
          <button type="button" className="btn btn-danger px-2" onClick={onClear} disabled={!count} title="Очистить список">
            ✕
          </button>
        </div>
        <div className="factory-rule" />
        <div className="factory-plan-list scroll-area min-h-[120px] max-lg:flex-none max-lg:overflow-visible lg:min-h-[140px]">
          {count ? children : <div className="hud-label py-8 text-center text-muted">{emptyHint}</div>}
        </div>
        <div className="factory-totals shrink-0">
          <div className="hud-label mb-2 text-accent">Итоговые ресурсы</div>
          <div className="factory-total-grid">
            {report.resources.map((line) => (
              <TotalCell key={`resource-${line.name}`} line={line} />
            ))}
            {report.stats.map((line) => (
              <TotalCell key={`stat-${line.name}`} line={line} />
            ))}
          </div>
          <ToolExportBar report={report} />
        </div>
      </div>
    </aside>
  );
}
