import { BookOpen, Brain, ChevronDown } from "lucide-react";
import { useState } from "react";
import { HudLabel, Panel } from "../components/ui";
import { TRAINING_MODULES } from "../lib/data";
import { cx } from "../lib/format";

export function TrainingView() {
  const [openId, setOpenId] = useState<string | null>("terminal");
  const ready = TRAINING_MODULES.filter((m) => m.status === "ready").length;

  return (
    <div className="tab-fade flex flex-col items-center py-1">
      <Panel className="w-full max-w-5xl p-4 md:p-6">
        {/* Шапка */}
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="relative shrink-0">
            <img
              src="/images/clan-logo.jpg"
              alt="Герб клана SINDARIS"
              className="crest-frame h-24 w-24 rounded-md object-cover md:h-28 md:w-28"
              draggable={false}
            />
            <span className="absolute -right-3 -bottom-3 flex h-11 w-11 items-center justify-center rounded-md border border-accent/50 bg-[#0b100b] text-accent shadow-lg shadow-black/60">
              <Brain size={22} />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <HudLabel className="text-white/45">УЧЕБНЫЙ ЦЕНТР ШТАБА КЛАНА</HudLabel>
            <h1 className="title-brand mt-1.5 flex items-center justify-center gap-2.5 text-[1.35rem] text-white md:justify-start md:text-[1.7rem]">
              <BookOpen size={22} className="text-accent" /> Обучение
            </h1>
            <p className="mt-2.5 max-w-2xl text-[0.85rem] leading-relaxed text-white/70">
              Материалы находятся в разработке штаба. Базовые модули по работе с терминалом уже доступны —
              остальные разделы пополняются по мере утверждения интендантской службой.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="badge-count">ДОСТУПНО: {ready}</span>
              <span className="badge-count !border-[#f59e0b] !text-[#fbbf24]">
                В РАЗРАБОТКЕ: {TRAINING_MODULES.length - ready}
              </span>
              <div className="progress-track w-40">
                <div
                  className="progress-bar"
                  style={{ width: `${(ready / TRAINING_MODULES.length) * 100}%`, background: "var(--accent)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="stencil-line my-5" />

        {/* Модули */}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TRAINING_MODULES.map((m, i) => {
            const open = openId === m.id;
            const wip = m.status === "wip";
            return (
              <article
                key={m.id}
                className={cx(
                  "panel-inner rise-in flex flex-col rounded-sm p-3.5 transition-all",
                  open && "ring-1 ring-accent/50",
                  wip && "opacity-75",
                  open && m.body && "md:col-span-2 xl:col-span-3",
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <button
                  className="flex w-full items-start gap-3 text-left"
                  onClick={() => setOpenId(open ? null : m.id)}
                  disabled={wip}
                >
                  <span
                    className={cx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border",
                      wip ? "border-[#f59e0b]/40 text-[#fbbf24]/70" : "border-accent/50 bg-accent/10 text-accent",
                    )}
                  >
                    <Brain size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cx("truncate text-[0.88rem] font-bold", wip ? "text-white/60" : "text-white")}>
                        {m.title}
                      </span>
                      <span
                        className={cx(
                          "hud-label flex shrink-0 items-center gap-1 rounded-sm border px-1.5 py-0.5 !text-[0.52rem]",
                          wip ? "border-[#f59e0b]/50 text-[#fbbf24]" : "border-accent/50 text-accent",
                        )}
                      >
                        {wip ? "В РАЗРАБОТКЕ" : open ? "ОТКРЫТО" : "ДОСТУПНО"}
                        {!wip && (
                          <ChevronDown size={10} className={cx("transition-transform duration-300", open && "rotate-180")} />
                        )}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[0.76rem] text-white/55">{m.summary}</span>
                  </span>
                </button>
                {open && m.body && (
                  <div className="console-log tab-fade mt-3 rounded-sm px-3.5 py-3 text-[0.76rem] leading-relaxed">
                    {m.body.map((line, j) => (
                      <div key={j} className="border-l-2 border-accent/20 py-1 pl-3">
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
