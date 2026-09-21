"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

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
      <div className="auth-backdrop" aria-hidden />
      <section className="auth-panel">
        <div className="auth-header">
          <div className="auth-crest">SD</div>
          <h1 className="auth-title">SINDARIS Terminal</h1>
          <p className="auth-subtitle">Logistics Overwatch Control • Foxhole</p>
        </div>

        <div className="auth-rule" />

        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="access-token" className="auth-label">
            ВВЕДИТЕ КЛЮЧ ДОСТУПА КЛАНА (TOKEN)
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
