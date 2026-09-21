# SIND-site — инструкция для ИИ-ассистента и владельца

> Прочитай этот файл целиком перед любыми действиями с проектом.
> Если что-то здесь противоречит твоим предположениям — прав этот файл.

---

## 1. Что это за проект (TL;DR)

Веб-сайт клана для игры Foxhole: заказы на производство, склады, таймеры, кодовая база предметов, карта, тренировки.

| Параметр | Значение |
|---|---|
| Фреймворк | **Next.js 16.2.6** (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 (`@tailwindcss/postcss`) |
| Язык | TypeScript 5.9 |
| БД | **PostgreSQL** через Drizzle ORM 0.45 (`pg`, `postgres`) |
| Middleware | `src/proxy.ts` — это middleware Next 16 (новое имя вместо `middleware.ts`) |
| Прочее | `xlsx` (экспорт Excel), `ffmpeg-static`, `dotenv` |
| Запуск | `npm run dev` → http://localhost:3000 |
| Репозиторий | https://github.com/Reppot/Sandalis-Web, ветка `main` |
| Локальный путь | `D:\Sandalis Web\SIND-site` |
| Эталонный бэкап | `D:\Sandalis Web\BackUps\39` — не изменять |

---

## 2. ЗАПРЕЩЕНО (красные флаги)

Если ты собираешься сделать что-то из списка — **остановись и спроси владельца**:

- ❌ Переводить проект на Vite / CRA / любой другой сборщик
- ❌ Создавать `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/views/*`
- ❌ Переписывать `package.json` / `package-lock.json` / `tsconfig.json` с нуля
- ❌ Менять структуру `src/app` (страницы и API) и `src/components`
- ❌ Предлагать `npm install` для «восстановления» — сначала проверить, что `package.json` содержит `"next": "16.2.6"`
- ❌ Делать `git pull` без предварительного `git fetch` + `git log --stat origin/main -1`
- ❌ Использовать ветку `vite-rewrite` — это мусор, оставлен только как архив

**Разрешено:** править и добавлять файлы внутри существующей структуры, добавлять зависимости через `npm install <pkg>`, менять схему БД через Drizzle.

---

## 3. Почему эти запреты существуют (история инцидента)

1. Сайт разрабатывался в чате с ИИ. Чат переполнился, работа перешла в новый чат.
2. Новый чат **не имел контекста** и, не видя проекта, начал переписывать его на Vite.
3. В папку проекта попал `package.json` от `react-vite-tailwind`. Команда `npm install` **снесла 340 пакетов Next.js**.
4. Коммит с обманчивым названием «Add missing 18 icons» на самом деле залил в `main` целый Vite-проект и перезаписал конфиги.
5. Восстановлено из бэкапа 39. `main` откачен на рабочий коммит, Vite-версия вынесена в ветку `vite-rewrite`.

**Вывод:** ИИ без контекста склонен «пересоздать проект». Этот файл и снимки `SNAP_*.md` — защита от повторения.

---

## 4. Структура проекта

```
src/
  proxy.ts                  middleware (auth, редиректы)
  app/
    layout.tsx, page.tsx, globals.css
    api/                    route.ts — REST-эндпоинты
      auth/{login,logout,me}
      orders/, orders/[id]
      stockpiles/, stockpiles/[id]
      scan/, storage/, health/
    cabinet/ codes/ map/ orders/ timers/ tools/ tools/factory/ training/   — страницы (page.tsx)
  components/
    shell/        Header, Sidebar, MobileNav, Ticker, BackgroundLayer, TerminalShell
    providers/    Theme, Notification, Terminal
    ui/           Modal
    orders/       OrdersWorkspace, OrderBuilder, StorageMonitor, ExportBar, ReportPreviewModal, GameItemIcon
    codes/        CodeBaseWorkspace
    timers/       TimersWorkspace, StockpileModals
    tools/        ToolsWorkspace, FactoryWorkspace
    cabinet/      CabinetWorkspace
    training/     TrainingWorkspace
  lib/
    factory-data.ts (118 КБ), item-catalog.ts (58 КБ), itemCodes.ts (56 КБ)   — большие файлы данных
    constants.ts, types.ts, parsers.ts, exporters.ts, time.ts, mapdata.ts
    auth-profiles.ts, code-base.ts, foxhole-data.ts, item-icon-overrides.ts
    server/stockpile-repo.ts
  db/
    index.ts (подключение), schema.ts (Drizzle-схема)
data/         catalog.json, fs_vanilla.h5, README.md
public/
  FoxholeWikiPhotos/   378 иконок предметов (это полное число, не 396)
  bg/ gifs/ icons/ stikers/ Videos/ (видео не в git — >100 МБ)
scripts/
  import-foxhole-data.mjs
  snapshot.ps1          генератор SNAP_*.md
```

---

## 5. Как ИИ получает контекст проекта (система снимков)

Файлы `SNAP_1_core.md … SNAP_4_workspaces.md` в корне — автоматический слепок кода.
Они **не в git** (`.gitignore`) и **пересобираются сами** после каждого `git commit` (хук `.git/hooks/post-commit`).

| Файл | Содержимое | ~Размер |
|---|---|---|
| `SNAP_1_core.md` | шапка, дерево, конфиги, `src/db`, `src/lib` | 92 КБ |
| `SNAP_2_app.md` | `src/app/api`, все `page.tsx`, `scripts` | 31 КБ |
| `SNAP_3_shell.md` | shell, providers, ui, cabinet, training | 58 КБ |
| `SNAP_4_workspaces.md` | orders, codes, timers, tools | 114 КБ |

Файлы больше 25 КБ (`factory-data.ts`, `item-catalog.ts`, `itemCodes.ts`, `globals.css`) в снимках **обрезаны до 40 строк**. Если нужен полный текст — ИИ должен запросить его отдельно.

**Для ИИ:** после получения всех 4 частей ты знаешь актуальное состояние кода. Не проси «покажи структуру» — она в SNAP_1. Хеш коммита в шапке снимка = последнее состояние `main`.

---

## 6. Рабочий процесс

### Начало сессии с ИИ (владелец)
1. Убедиться: `git status` чистый.
2. Открыть новый чат, вставить 4 сообщения `SNAP_1…4` с пометкой «часть N/4, пока не отвечай».
3. Пятым сообщением — задача.

### Внесение изменений
```
ИИ даёт код  →  владелец вставляет в файлы  →  npm run dev / npm run typecheck
  ├─ работает → git add -A; git commit -m "..."; git push   (снимки обновятся сами)
  └─ сломалось → git checkout .   (мгновенный откат к последнему коммиту)
```

### Правила для ИИ при выдаче кода
- Указывать **полный путь файла** и давать файл целиком или чёткий diff.
- Не предлагать изменений более чем в 3–4 файлах за один шаг — владелец должен успевать проверять.
- Перед изменением схемы БД (`src/db/schema.ts`) предупредить: потребуется `npx drizzle-kit push`.
- Не менять `package.json` без явной причины; новые пакеты — через `npm install <pkg>`.

---

## 7. Команды

```powershell
cd "D:\Sandalis Web\SIND-site"

npm run dev          # dev-сервер, localhost:3000
npm run build        # прод-сборка
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run snapshot     # пересобрать SNAP_*.md вручную

npx drizzle-kit push     # применить schema.ts к БД
npx drizzle-kit studio   # GUI для БД
```

### Git — безопасный цикл
```powershell
git status                              # перед любыми правками — должно быть чисто
git add -A; git commit -m "msg"; git push
git checkout .                          # откат незакоммиченных правок
git reset --hard <hash>                 # откат к коммиту (локально)
git fetch; git log --stat origin/main -1   # ВСЕГДА перед git pull
```

### Восстановление хука (если склонировал репо заново или удалил `.git`)
```powershell
$hook = "#!/bin/sh`npowershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/snapshot.ps1 >/dev/null 2>&1`nexit 0`n"
[IO.File]::WriteAllText("$PWD\.git\hooks\post-commit", $hook)
```

### Аварийное восстановление из бэкапа 39
```powershell
$B="D:\Sandalis Web\BackUps\39"; $S="D:\Sandalis Web\SIND-site"
Rename-Item $S "SIND-site_broken"
robocopy $B $S /E /XD ".git" /MT:16 /NFL /NDL /NJH /NJS
robocopy "D:\Sandalis Web\SIND-site_broken\.git" "$S\.git" /E /MT:16 /NFL /NDL /NJH /NJS
cd $S; npm run dev
```

---

## 8. Окружение

- `.env` — локальный, содержит `DATABASE_URL` и секреты. **Не коммитить.** Шаблон — `.env.example`.
- Для работы страниц `orders`, `timers`, `cabinet` нужна запущенная PostgreSQL.
- `scripts/snapshot.ps1` должен быть сохранён в **UTF-8 with BOM**, иначе Windows PowerShell 5.1 не разберёт кириллицу.
- Предупреждения `LF will be replaced by CRLF` при коммите — безвредны.
- Лимит GitHub — 100 МБ на файл. `public/Videos/*.mp4` исключены через `.gitignore`.

---

## 9. Известные факты (чтобы не переспрашивать)

- Иконок в `public/FoxholeWikiPhotos` — **378**. Цифра «396» была ошибочной.
- `all_files_paths.txt` (2.9 МБ) — служебный листинг, на работу не влияет.
- `data/fs_vanilla.h5` — данные игры, используются скриптом импорта.
- Ветка `vite-rewrite` — архив ошибочной переделки, можно удалить.

---

## 10. Журнал (дописывать при значимых изменениях)

| Дата | Коммит | Что |
|---|---|---|
| 2026-09-20 | `d2e8b7d` | Initial commit — рабочее состояние = бэкап 39 |
| 2026-09-21 | `906a263` | ❌ Vite-переписывание (откачено, в ветке `vite-rewrite`) |
| 2026-09-21 | `cf113dd` | Добавлен `scripts/snapshot.ps1`, хук post-commit |
| 2026-09-21 | `f1e3c67` | Исправлена кодировка snapshot.ps1 |
