import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Условия использования — SINDARIS Terminal",
  description:
    "Условия использования внутреннего информационно-логистического терминала SINDARIS для Foxhole.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="auth-screen">
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" aria-hidden />

      <section className="auth-panel panel panel-corners relative z-10 my-4 max-h-[92dvh] w-full max-w-3xl overflow-y-auto">
        <div className="auth-scanline" aria-hidden />

        <header className="auth-header">
          <h1 className="auth-title">Условия использования SINDARIS Terminal</h1>
          <p className="auth-subtitle">Публичная редакция для Discord Developer Portal</p>
        </header>

        <div className="auth-rule" />

        <article className="space-y-6 text-sm leading-relaxed text-white/90">
          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              1. Общие положения
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                SINDARIS Terminal — внутренний информационно-логистический сайт игрового сообщества SINDARIS для Foxhole.
              </li>
              <li>Использование сайта означает согласие с настоящими условиями.</li>
              <li>Если пользователь не согласен, он должен прекратить использование сайта.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              2. Доступ к сайту
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Доступ предназначен для участников Discord-сервера сообщества.</li>
              <li>Для авторизации используется Discord OAuth2.</li>
              <li>Администраторы могут ограничить или отключить доступ пользователя.</li>
              <li>Нельзя передавать доступ третьим лицам.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              3. Правила использования
            </h2>
            <p className="mb-2">Запрещено:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>пытаться получить несанкционированный доступ;</li>
              <li>обходить проверку ролей и разрешений;</li>
              <li>использовать сайт для атак, спама или вредоносных действий;</li>
              <li>загружать вредоносные данные;</li>
              <li>нарушать работу сайта;</li>
              <li>выдавать себя за другого участника.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              4. Пользовательские данные
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Данные Discord используются для авторизации и управления доступом.</li>
              <li>Пользователь должен предоставлять корректную информацию в своём Discord-профиле.</li>
              <li>
                Подробности обработки описаны на странице{" "}
                <Link href="/privacy" className="text-accent-soft underline hover:text-accent">
                  /privacy
                </Link>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              5. Доступность сайта
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Сайт предоставляется «как есть».</li>
              <li>Возможны технические работы, ошибки, перерывы и изменения функциональности.</li>
              <li>Администрация не гарантирует постоянную доступность сайта.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              6. Изменение условий
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Условия могут изменяться.</li>
              <li>
                Актуальная версия всегда публикуется на странице{" "}
                <Link href="/terms" className="text-accent-soft underline hover:text-accent">
                  /terms
                </Link>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              7. Контакты
            </h2>
            <p>
              По вопросам доступа обращаться к администрации Discord-сервера SINDARIS.
            </p>
          </section>
        </article>

        <div className="auth-rule" />

        <footer className="flex flex-col gap-3 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>Последнее обновление: 21 сентября 2026 г.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="text-accent-soft underline hover:text-accent">
              ← Назад к входу
            </Link>
            <Link href="/privacy" className="text-accent-soft underline hover:text-accent">
              Политика конфиденциальности
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
