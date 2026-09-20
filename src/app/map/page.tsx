import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Карта Foxhole — SINDARIS Терминал",
  description: "Интерактивная карта Foxhole Sravdar внутри защищённого терминала SINDARIS.",
};

const MAP_URL = "https://sravdar.github.io/";

export default function MapPage() {
  return (
    <div className="map-workspace">
      <section className="map-toolbar panel panel-corners">
        <div className="flex min-w-0 items-center gap-3">
          <span className="map-radar-dot" aria-hidden />
          <div className="min-w-0">
            <h1 className="panel-title truncate">⌖ Интерактивная карта Foxhole</h1>
            <p className="hud-label mt-1 truncate text-muted">Внешний картографический модуль Sravdar • live tilemap</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="map-status"><span className="status-dot pulse" /> EXTERNAL MAP LINK</span>
          <a className="btn hidden sm:inline-flex" href={MAP_URL} target="_blank" rel="noreferrer">↗ Открыть отдельно</a>
        </div>
      </section>

      <section className="map-frame panel panel-corners" aria-label="Интерактивная карта Foxhole">
        <iframe
          title="Sravdar Foxhole interactive map"
          src={MAP_URL}
          className="h-full w-full border-0"
          allow="fullscreen; geolocation"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="map-loading-hint" aria-hidden>
          <span className="hud-label">ЗАГРУЗКА КАРТОГРАФИЧЕСКОГО МОДУЛЯ...</span>
        </div>
      </section>
    </div>
  );
}
