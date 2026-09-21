"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = token.trim();
    if (!value || busy) return;

    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token: value }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "[ОТКАЗАНО В ДОСТУПЕ]");
        setToken("");
        return;
      }

      router.replace("/orders");
      router.refresh();
    } catch {
      setError("[СИСТЕМА] НЕТ СВЯЗИ С КАНАЛОМ АВТОРИЗАЦИИ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="/Videos/Video Project.mp4"
        aria-hidden
      />
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" aria-hidden />

      <section className="auth-panel panel panel-corners relative z-10">
        <div className="auth-scanline" aria-hidden />
        <div className="auth-header">
          <Image src="/clan-logo.png" alt="Герб клана SINDARIS" width={180} height={230} priority className="auth-logo" />
          <h1 className="auth-title">SINDARIS Terminal</h1>
        </div>

        <div className="auth-rule" />

        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="access-token" className="auth-label">
            ВВЕДИТЕ КЛЮЧ ДОСТУПА СИНДИКАТА (TOKEN)
          </label>
          <div className={`auth-input-wrap ${error ? "auth-input-error" : ""}`}>
            <span className="auth-prompt" aria-hidden>&gt;_</span>
            <input
              id="access-token"
              type="password"
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
                if (error) setError("");
              }}
              placeholder="СЕКРЕТНЫЙ КЛАНОВЫЙ КЛЮЧ"
              autoComplete="current-password"
              autoFocus
              spellCheck={false}
              disabled={busy}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "auth-error" : undefined}
            />
          </div>

          {error && (
            <div id="auth-error" className="auth-error" role="alert">
              <span className="auth-error-mark">!</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-submit" disabled={!token.trim() || busy}>
            <span className={busy ? "pulse" : ""}>{busy ? "ПРОВЕРКА КЛЮЧА..." : "ИНИЦИАЛИЗИРОВАТЬ ПОДКЛЮЧЕНИЕ"}</span>
            {!busy && <span aria-hidden>↵</span>}
          </button>
        </form>
      </section>
    </main>
  );
}
