"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";

const errorMessages: Record<string, string> = {
  not_on_server: "Этот Discord-аккаунт не на сервере SINDARIS.",
  state_mismatch: "Сессия авторизации истекла, попробуйте снова.",
  oauth_failed: "Discord отклонил вход или произошла ошибка.",
  oauth_not_configured: "Discord OAuth не настроен на сервере.",
  rate_limited: "Слишком много попыток. Попробуйте позже.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [checking, setChecking] = useState(true);

  const oauthError = searchParams.get("error");
  const next = searchParams.get("next") ?? "/cabinet";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((res) => {
        if (res.ok && !cancelled) {
          router.replace(next);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router, next]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = token.trim();
    if (!value || busy) return;

    setBusy(true);
    setTokenError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token: value }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setTokenError(payload?.error ?? "[ОТКАЗАНО В ДОСТУПЕ]");
        setToken("");
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setTokenError("[СИСТЕМА] НЕТ СВЯЗИ С КАНАЛОМ АВТОРИЗАЦИИ");
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <main className="auth-screen">
        <div className="absolute inset-0 z-0 bg-black/80" aria-hidden />
        <section className="auth-panel panel panel-corners relative z-10 flex min-h-[20rem] items-center justify-center">
          <span className="pulse text-muted">Проверка сессии...</span>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-screen">
      <div className="absolute inset-0 z-0 bg-black/80" aria-hidden />

      <section className="auth-panel panel panel-corners relative z-10">
        <div className="auth-scanline" aria-hidden />
        <div className="auth-header">
          <Image src="/clan-logo.png" alt="Герб клана SINDARIS" width={160} height={200} priority className="auth-logo" />
          <h1 className="auth-title">SINDARIS Terminal</h1>
        </div>

        <div className="auth-rule" />

        {oauthError && (
          <div className="auth-error mb-4" role="alert">
            <span className="auth-error-mark">!</span>
            <span>{errorMessages[oauthError] ?? "Ошибка авторизации"}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <a
            href="/api/auth/discord/authorize"
            className="btn btn-primary auth-submit flex items-center justify-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>ВОЙТИ ЧЕРЕЗ DISCORD</span>
          </a>

          <button
            type="button"
            className="text-xs text-white/60 underline hover:text-white"
            onClick={() => setShowToken((v) => !v)}
          >
            {showToken ? "Скрыть вход по токену" : "Вход по токену (резерв)"}
          </button>

          {showToken && (
            <form className="auth-form" onSubmit={submit}>
              <label htmlFor="access-token" className="auth-label">
                РЕЗЕРВНЫЙ КЛЮЧ ДОСТУПА
              </label>
              <div className={`auth-input-wrap ${tokenError ? "auth-input-error" : ""}`}>
                <span className="auth-prompt" aria-hidden>&gt;_</span>
                <input
                  id="access-token"
                  type="password"
                  value={token}
                  onChange={(event) => {
                    setToken(event.target.value);
                    if (tokenError) setTokenError("");
                  }}
                  placeholder="СЕКРЕТНЫЙ КЛАНОВЫЙ КЛЮЧ"
                  autoComplete="current-password"
                  spellCheck={false}
                  disabled={busy}
                  aria-invalid={Boolean(tokenError)}
                  aria-describedby={tokenError ? "auth-token-error" : undefined}
                />
              </div>

              {tokenError && (
                <div id="auth-token-error" className="auth-error" role="alert">
                  <span className="auth-error-mark">!</span>
                  <span>{tokenError}</span>
                </div>
              )}

              <button type="submit" className="btn btn-secondary auth-submit" disabled={!token.trim() || busy}>
                <span className={busy ? "pulse" : ""}>{busy ? "ПРОВЕРКА..." : "ИНИЦИАЛИЗИРОВАТЬ"}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="auth-screen">
        <div className="absolute inset-0 z-0 bg-black/80" aria-hidden />
        <section className="auth-panel panel panel-corners relative z-10 flex min-h-[20rem] items-center justify-center">
          <span className="pulse text-muted">Загрузка...</span>
        </section>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
