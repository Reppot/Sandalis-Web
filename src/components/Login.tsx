import { ChevronRight, Fingerprint, Radio, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RANKS } from "../lib/data";
import { useTerminal } from "../lib/state";

const BOOT_LINES = [
  "[BOOT] SINDARIS OS v7.3.1 // ядро логистики сектора",
  "[ IO ] Проверка шифрованного канала КАНАЛ-07 .......... OK",
  "[AUTH] Рукопожатие со штабом ......................... OK (218 мс)",
  "[SYNC] Матрица складов: 5 секторов на мониторинге .... OK",
  "[SIG ] Радиоперехват: «Сделай САНДАЛИС снова великим»",
  "[GATE] Ожидание удостоверения оператора",
];

export function Login() {
  const { login } = useTerminal();
  const [lines, setLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [callsign, setCallsign] = useState("");
  const [rank, setRank] = useState<string>(RANKS[1]);
  const [phase, setPhase] = useState<"idle" | "auth">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let i = 0;
    const t = window.setInterval(() => {
      i++;
      setLines(BOOT_LINES.slice(0, i));
      if (i >= BOOT_LINES.length) {
        window.clearInterval(t);
        window.setTimeout(() => {
          setBootDone(true);
        }, 350);
      }
    }, 300);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (bootDone) inputRef.current?.focus();
  }, [bootDone]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (phase !== "idle") return;
    const name = callsign.trim() || "ОПОЛЧЕНЕЦ-07";
    setPhase("auth");
    setLines((l) => [...l, `[GATE] Запрос удостоверения: ${name.toUpperCase()}`]);
    window.setTimeout(() => {
      setLines((l) => [...l, "[AUTH] Доступ разрешён. Добро пожаловать в смену."]);
    }, 700);
    window.setTimeout(() => login(name.toUpperCase(), rank), 1500);
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="rise-in w-full max-w-3xl">
        {/* Шапка герба */}
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <img
              src="/images/clan-logo.jpg"
              alt="Герб клана SINDARIS"
              className="crest-frame h-28 w-28 rounded-md object-cover md:h-36 md:w-36"
              draggable={false}
            />
            <div className="radar-sweep absolute -inset-6 -z-10 rounded-full opacity-40" />
          </div>
          <div>
            <h1 className="title-brand glitch-hover text-4xl tracking-[0.08em] text-white md:text-6xl">
              SINDARIS
            </h1>
            <div className="mt-2 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-accent/50" />
              <span className="hud-label text-accent">ТЕРМИНАЛ ЛОГИСТИКИ</span>
              <span className="h-px w-10 bg-accent/50" />
            </div>
            <p className="hud-label mt-2 text-white/40">LOGISTICS OVERWATCH CONTROL • FOXHOLE</p>
          </div>
        </div>

        {/* Терминальная панель */}
        <div className="panel panel-corners rounded-md">
          <div className="flex items-center justify-between border-b border-[var(--line-2)] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-accent" />
              <span className="hud-label text-white/70">КАНАЛ-07 // SINDARIS.NET</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff5555]/80" />
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]/80" />
              <span className="pulse h-2 w-2 rounded-full bg-accent" />
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
            {/* Boot log */}
            <div className="console-log min-h-[240px] border-b border-[var(--line)] p-4 text-[0.72rem] leading-[1.9] md:border-r md:border-b-0">
              {lines.map((l, i) => (
                <div key={i} className="rise-in" style={{ animationDuration: "0.25s" }}>
                  <span className="text-accent/50">❯</span>{" "}
                  <span className={l.includes("OK") ? "text-white/80" : l.includes("перехват") ? "text-accent/90" : "text-white/60"}>
                    {l}
                  </span>
                </div>
              ))}
              {!bootDone && <div className="terminal-caret text-accent/80" />}
              {phase === "auth" && <div className="terminal-caret mt-1 text-accent/80" />}
            </div>

            {/* Форма допуска */}
            <form onSubmit={submit} className="flex flex-col gap-3 p-4 md:p-5">
              <div className="hud-label text-white/50">УДОСТОВЕРЕНИЕ ОПЕРАТОРА</div>

              <label className="flex flex-col gap-1.5">
                <span className="hud-label text-accent/80">Позывной</span>
                <input
                  ref={inputRef}
                  className="field"
                  placeholder="НАПР.: ЦЫГАНИС"
                  value={callsign}
                  maxLength={18}
                  onChange={(e) => setCallsign(e.target.value)}
                  disabled={phase === "auth"}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="hud-label text-accent/80">Должность</span>
                <select
                  className="field"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  disabled={phase === "auth"}
                >
                  {RANKS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                className="btn btn-primary mt-1 h-11 w-full text-[0.8rem]"
                disabled={phase !== "idle" || !bootDone}
              >
                {phase === "auth" ? (
                  <>
                    <ShieldCheck size={15} className="pulse" /> ИДЕНТИФИКАЦИЯ...
                  </>
                ) : (
                  <>
                    <Fingerprint size={15} /> ПОДКЛЮЧИТЬСЯ К СМЕНЕ <ChevronRight size={15} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn w-full"
                disabled={phase !== "idle" || !bootDone}
                onClick={() => {
                  setCallsign("ОПОЛЧЕНЕЦ-07");
                  setRank(RANKS[0]);
                }}
              >
                Гостевой допуск
              </button>

              <div className="hud-label mt-auto pt-2 text-white/30">
                ДОСТУП: ЛИЧНЫЙ СОСТАВ КЛАНА // ВЕРСИЯ 7.3.1
              </div>
            </form>
          </div>
        </div>

        <div className="hud-label mt-4 flex items-center justify-center gap-4 text-white/30">
          <span>SHIFT + S // ТИШИНА В ЭФИРЕ</span>
          <span>·</span>
          <span>© ШТАБ САНДАЛИС</span>
        </div>
      </div>
    </div>
  );
}
