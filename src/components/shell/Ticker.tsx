"use client";

import { PHRASE_CHANCE, PHRASE_HOLD_SECONDS, TACTICAL_CUSTOM_PHRASES } from "@/lib/constants";
import { DAY, HOUR, formatCountdown, secondsLeft } from "@/lib/time";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useClock, useTerminal } from "../providers/TerminalProvider";

interface Segment {
  text: string;
  tone: "critical" | "warning" | "safe";
}

const SPEED_PX_S = 70;

export function Ticker() {
  const { stockpiles, loading, connection } = useTerminal();
  const now = useClock();
  const [phrase, setPhrase] = useState("");
  const phraseState = useRef({ hold: 0, lastTick: 0 });

  // 📻 Случайный радиоперехват: шанс 10% каждую секунду, удержание 12 секунд
  useEffect(() => {
    const st = phraseState.current;
    const tick = Math.floor(now / 1000);
    if (tick === st.lastTick) return;
    st.lastTick = tick;
    if (st.hold > 0) {
      st.hold -= 1;
      if (st.hold === 0) setPhrase("");
    } else if (Math.random() < PHRASE_CHANCE) {
      st.hold = PHRASE_HOLD_SECONDS;
      setPhrase(TACTICAL_CUSTOM_PHRASES[Math.floor(Math.random() * TACTICAL_CUSTOM_PHRASES.length)]);
    }
  }, [now]);

  const segments = useMemo<Segment[]>(() => {
    const out: Segment[] = [];
    for (const s of stockpiles) {
      const ts = secondsLeft(s.expiresAt, now);
      if (ts >= DAY) continue;
      if (ts <= 0) {
        out.push({ text: `🔴 [ПОТЕРЯН] Склад в порту ${s.region} (${s.location}) — таймер истёк! Немедленно обновите удержание!`, tone: "critical" });
        continue;
      }
      const crit = ts < HOUR;
      out.push({
        text: `${crit ? "🔴 [КРИТИЧЕСКИ]" : "🟠 [ВНИМАНИЕ]"} Склад в порту ${s.region} (${s.location}) пропадёт через ${formatCountdown(ts)}!`,
        tone: crit ? "critical" : "warning",
      });
    }
    if (phrase) out.push({ text: `🟢 ${phrase}`, tone: "safe" });
    if (loading) out.push({ text: "📡 ЗАГРУЗКА ВОЕННЫХ СПУТНИКОВ СЕКТОРА...", tone: "safe" });
    else if (connection === "offline") out.push({ text: "🔴 [СВЯЗЬ] ПОТЕРЯН КАНАЛ С БАЗОЙ СЕКТОРОВ — ПОВТОРНОЕ ПОДКЛЮЧЕНИЕ...", tone: "critical" });
    if (!out.length) out.push({ text: "🟢 ВСЕ СЕКТОРА СНАБЖЕНИЯ В ПОЛНОЙ БЕЗОПАСНОСТИ", tone: "safe" });
    return out;
  }, [stockpiles, now, phrase, loading, connection]);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);
  const offset = useRef(0);
  const paused = useRef(false);
  const [minWidth, setMinWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMinWidth(el.clientWidth));
    ro.observe(el);
    setMinWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      const copyW = copyRef.current?.offsetWidth ?? 0;
      if (copyW > 0 && !paused.current) {
        offset.current -= (SPEED_PX_S * dt) / 1000;
        if (-offset.current >= copyW) offset.current += copyW;
      }
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${offset.current.toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const renderCopy = (hidden: boolean) => (
    <span className="ticker-copy" ref={hidden ? undefined : copyRef} aria-hidden={hidden} style={{ minWidth: minWidth || undefined }}>
      {segments.map((s, i) => (
        <Fragment key={i}>
          <span className={`tk-${s.tone}`}>{s.text}</span>
          <span className="tk-sep">•</span>
        </Fragment>
      ))}
    </span>
  );

  return (
    <div
      ref={containerRef}
      className="ticker w-full"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      role="marquee"
      aria-label="Лента предупреждений"
    >
      <div ref={trackRef} className="ticker-track">
        {renderCopy(false)}
        {renderCopy(true)}
      </div>
    </div>
  );
}
