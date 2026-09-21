"use client";

import { EXTERNAL_TOOLS } from "@/lib/constants";

export function ToolsWorkspace() {
  return (
    <div className="tab-fade flex flex-col gap-3">
      <section className="panel panel-corners rounded-md p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-2xl" aria-hidden>🧭</span>
          <div className="min-w-0">
            <div className="hud-label text-muted">SINDARIS FIELD UTILITIES</div>
            <h1 className="panel-title mt-1 text-[1.05rem] md:text-[1.3rem]">▣ Инструменты</h1>
            <p className="mt-1 text-sm text-white/70">Внешние сервисы для навигации, планирования построек, расчёта производства и боя Foxhole.</p>
          </div>
        </div>
      </section>

      <section className="tools-grid">
        {EXTERNAL_TOOLS.map((tool) => (
          <article key={tool.url} className="panel panel-corners tool-card rounded-md p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden>{tool.icon}</span>
              <div className="min-w-0">
                <div className="hud-label text-accent">{tool.tag}</div>
                <h2 className="mt-0.5 truncate font-display text-base text-white">{tool.name}</h2>
              </div>
            </div>
            <p className="flex-1 text-[0.82rem] leading-relaxed text-white/70">{tool.description}</p>
            <a className="btn btn-primary justify-center" href={tool.url} target="_blank" rel="noreferrer">
              ↗ Открыть инструмент
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
