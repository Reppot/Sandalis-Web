"use client";

import { iconPath } from "@/lib/constants";
import type { ExportFormat, PanelMode } from "@/lib/types";
import Image from "next/image";

const FORMATS: { fmt: ExportFormat; label: string; icon: string; importable: boolean; hintExport: string; hintImport: string }[] = [
  { fmt: "txt", label: "TXT", icon: iconPath("txt-file"), importable: true, hintExport: "Выгрузить рапорт в TXT", hintImport: "Загрузить JSON/TXT отчёт сканера" },
  { fmt: "xlsx", label: "XLSX", icon: iconPath("xls"), importable: true, hintExport: "Выгрузить таблицу XLSX", hintImport: "Загрузить таблицу XLSX" },
  { fmt: "png", label: "PNG", icon: iconPath("png-file"), importable: false, hintExport: "Сформировать графические страницы отчёта", hintImport: "Импорт из PNG недоступен" },
  { fmt: "clipboard", label: "БУФЕР", icon: iconPath("log-file"), importable: true, hintExport: "Скопировать первую страницу отчёта в буфер обмена", hintImport: "Вставить данные из буфера обмена" },
];

interface Props {
  mode: PanelMode;
  onToggleMode: () => void;
  onAction: (fmt: ExportFormat) => void;
  busy?: boolean;
}

export function ExportBar({ mode, onToggleMode, onAction, busy }: Props) {
  const isImport = mode === "import";
  return (
    <div className="mt-3 flex flex-col gap-2">
      <button className={`btn w-full justify-between ${isImport ? "btn-warn btn-active" : ""}`} onClick={onToggleMode} title="Переключить режим панели">
        <span className="flex items-center gap-2">
          <span className={`status-dot ${isImport ? "pulse" : ""}`} style={{ color: isImport ? "var(--warn)" : "var(--accent)", background: isImport ? "var(--warn)" : "var(--accent)" }} />
          {isImport ? "РЕЖИМ: ИМПОРТ ДАННЫХ" : "РЕЖИМ: ЭКСПОРТ ДАННЫХ"}
        </span>
        <span className="hud-label opacity-70">{isImport ? "⬇ чтение файлов" : "⬆ выгрузка рапортов"}</span>
      </button>
      <div className="grid grid-cols-4 gap-2">
        {FORMATS.map((f) => {
          const disabled = busy || (isImport && !f.importable);
          return (
            <button
              key={f.fmt}
              className="btn h-[42px] px-1"
              disabled={disabled}
              onClick={() => onAction(f.fmt)}
              title={isImport ? f.hintImport : f.hintExport}
            >
              <Image src={f.icon} alt="" width={22} height={22} unoptimized className="ui-icon h-[22px] w-[22px] object-contain" />
              <span className="hidden sm:inline">{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
