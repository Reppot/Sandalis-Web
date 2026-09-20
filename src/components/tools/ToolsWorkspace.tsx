"use client";

const MAP_URL = "https://sravdar.github.io/";

export function ToolsWorkspace() {
  return (
    <div className="tab-fade tools-page">
      <section className="panel panel-corners tools-header">
        <div className="flex min-w-0 items-center gap-3">
          <span className="tools-signal" aria-hidden />
          <div className="min-w-0">
            <div className="hud-label text-muted">SINDARIS FIELD UTILITIES</div>
            <h1 className="panel-title mt-1 text-[1.05rem] md:text-[1.3rem]">▣ Инструменты</h1>
            <p className="mt-1 text-sm text-white/70">Внешние сервисы для навигации, разведки и логистики Foxhole.</p>
          </div>
        </div>
        <span className="tools-header-status"><span className="status-dot" /> 2 МОДУЛЯ</span>
      </section>

      <section className="panel panel-corners tools-card">
        <div className="tools-preview" role="img" aria-label="Превью интерактивной карты Foxhole">
          <div className="tools-preview-grid" aria-hidden />
          <div className="tools-preview-route tools-preview-route-a" aria-hidden />
          <div className="tools-preview-route tools-preview-route-b" aria-hidden />
          <span className="tools-preview-marker tools-preview-marker-a" aria-hidden>◆</span>
          <span className="tools-preview-marker tools-preview-marker-b" aria-hidden>◆</span>
          <span className="tools-preview-marker tools-preview-marker-c" aria-hidden>◆</span>
          <div className="tools-preview-label"><span className="status-dot" /> FOXHOLE WAR MAP // LIVE LINK</div>
          <div className="tools-preview-coordinates">GRID 04-F • SHARD LIVE • MAP MODULE</div>
        </div>
        <div className="tools-card-body">
          <div className="min-w-0">
            <div className="hud-label text-accent">КАРТОГРАФИЧЕСКИЙ МОДУЛЬ</div>
            <h2 className="mt-1 font-display text-xl tracking-wide text-white">Sravdar Foxhole Map</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
              Интерактивная карта войны Foxhole с тайлами регионов и навигацией по театру боевых действий. Карта открывается отдельно, поэтому тяжёлое Flutter-приложение не загружается внутри терминала.
            </p>
          </div>
          <a className="btn btn-primary shrink-0" href={MAP_URL} target="_blank" rel="noreferrer">
            ↗ Открыть карту
          </a>
        </div>
        <div className="tools-card-footer">
          <span className="hud-label text-muted">EXTERNAL RESOURCE • sravdar.github.io</span>
          <span className="hud-label text-safe">● ДОСТУПЕН ПО ССЫЛКЕ</span>
        </div>
      </section>

      <section className="panel panel-corners tools-factory-card">
        <div className="tools-factory-icon"><img src="/icons/business.png" alt="" className="ui-icon" /></div>
        <div className="min-w-0 flex-1">
          <div className="hud-label text-accent">ВНУТРЕННИЙ МОДУЛЬ • OFFLINE READY</div>
          <h2 className="mt-1 font-display text-xl tracking-wide text-white">Factory Calculator</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">Планирование производства Factory и MPF: очередь предметов, лимиты, материалы, ящики и время. Все данные и расчёты работают внутри SINDARIS без сторонних встраиваемых приложений.</p>
        </div>
        <a className="btn btn-primary shrink-0" href="/tools/factory">Открыть калькулятор</a>
      </section>
    </div>
  );
}
