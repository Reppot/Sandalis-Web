import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — SINDARIS Terminal",
  description:
    "Политика конфиденциальности внутреннего терминала SINDARIS: какие данные обрабатываются, для чего используются и как хранятся.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="auth-screen">
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" aria-hidden />

      <section className="auth-panel panel panel-corners relative z-10 my-4 max-h-[92dvh] w-full max-w-3xl overflow-y-auto">
        <div className="auth-scanline" aria-hidden />

        <header className="auth-header">
          <h1 className="auth-title">Политика конфиденциальности SINDARIS Terminal</h1>
          <p className="auth-subtitle">Публичная редакция для Discord Developer Portal</p>
        </header>

        <div className="auth-rule" />

        <article className="space-y-6 text-sm leading-relaxed text-white/90">
          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              1. Какие данные обрабатываются
            </h2>
            <p className="mb-2">Сайт может обрабатывать:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Discord user ID;</li>
              <li>Discord username;</li>
              <li>display name;</li>
              <li>URL аватара;</li>
              <li>идентификатор Discord-сервера;</li>
              <li>Discord-роли, если они используются для определения доступа;</li>
              <li>дату первого входа;</li>
              <li>дату последнего входа;</li>
              <li>технические данные сессии, необходимые для авторизации.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              2. Для чего используются данные
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>авторизация через Discord;</li>
              <li>проверка членства в Discord-сервере;</li>
              <li>определение ролей и уровня доступа;</li>
              <li>отображение профиля участника;</li>
              <li>защита сайта;</li>
              <li>ведение журнала действий, если такая функция включена;</li>
              <li>поддержание сессии пользователя.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              3. Какие данные не собираются
            </h2>
            <p className="mb-2">
              Сайт не использует рекламные трекеры, аналитические сервисы, платёжные системы, массовые рассылки и не
              продаёт пользовательские данные.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Не используется Google Analytics или аналогичные аналитические инструменты.</li>
              <li>Не собираются платёжные данные.</li>
              <li>Не проводятся рекламные рассылки.</li>
              <li>Данные не передаются третьим лицам в коммерческих целях.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              4. Где хранятся данные
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Данные аккаунта хранятся в базе PostgreSQL через Supabase.</li>
              <li>Сайт запускается на Render.</li>
              <li>Discord используется для OAuth2-аутентификации.</li>
              <li>Секреты приложения не отображаются пользователям.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              5. Cookies и сессии
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Для входа используются необходимые cookies.</li>
              <li>Сессионная cookie используется для поддержания авторизации.</li>
              <li>Сессионные cookies имеют HttpOnly и Secure в production.</li>
              <li>Аналитические cookies не используются.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              6. Срок хранения
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Данные хранятся столько, сколько необходимо для работы кланового сайта и управления доступом.</li>
              <li>Администратор может отключить или удалить профиль.</li>
              <li>Пользователь может обратиться к администрации с просьбой удалить или исправить данные.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              7. Сторонние сервисы
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Discord — OAuth2 и данные профиля.</li>
              <li>Supabase — база данных.</li>
              <li>Render — размещение приложения.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              8. Права пользователя
            </h2>
            <p className="mb-2">Пользователь может обратиться к администрации, чтобы:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>узнать, какие данные хранятся;</li>
              <li>исправить данные;</li>
              <li>удалить профиль или отключить доступ;</li>
              <li>получить разъяснения по обработке данных.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              9. Изменения политики
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Политика может изменяться.</li>
              <li>
                Актуальная версия находится на странице{" "}
                <Link href="/privacy" className="text-accent-soft underline hover:text-accent">
                  /privacy
                </Link>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">
              10. Контакты
            </h2>
            <p>
              По вопросам конфиденциальности обращаться к администрации Discord-сервера SINDARIS.
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
            <Link href="/terms" className="text-accent-soft underline hover:text-accent">
              Условия использования
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
