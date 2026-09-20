"use client";

import { iconPath } from "@/lib/constants";
import Image from "next/image";
import { useState } from "react";

interface Module {
  id: string;
  title: string;
  status: "ready" | "wip";
  icon: string;
  summary: string;
  body?: string[];
}

const MODULES: Module[] = [
  {
    id: "terminal",
    title: "Работа с терминалом SINDARIS",
    status: "ready",
    icon: iconPath("browsing"),
    summary: "Импорт склада, конструктор заказа, экспорт рапортов.",
    body: [
      "1. Раздел «Заказы» → левая панель: загрузите JSON/TXT сканера, вставьте текст из буфера обмена или просканируйте бинарный MapData.sav.",
      "2. Правая панель: выберите предмет из матрицы (фильтр по названию, категории, английскому имени или коду), задайте количество и единицу (ЯЩ/ШТ), нажмите «Добавить в заказ».",
      "3. Кнопка «РЕЖИМ» переключает нижние клавиши между экспортом (TXT/XLSX/PNG/буфер) и импортом внешних файлов.",
      "4. «Отправить рапорт в штаб» сохраняет заказ в базе данных — архив доступен всем интендантам.",
    ],
  },
  {
    id: "formats",
    title: "Форматы отчётов сканера",
    status: "ready",
    icon: iconPath("json"),
    summary: "Какие строки понимает парсер терминала.",
    body: [
      "• «Название предмета, 50» — классический формат сканера.",
      "• «Название предмета -> 50 шт.» — формат экспорта терминала.",
      "• «Название предмета: 12 ящ» — формат сообщений Discord.",
      "• Маркеры •, *, «шт», «ящ», «ящиков» очищаются автоматически.",
      "• JSON: массив объектов {name, count} или словарь {\"Название\": 50}.",
      "• MapData.sav: бинарный поиск 396 кодов Foxhole Wiki с чтением Int16Property.",
    ],
  },
  {
    id: "timers",
    title: "Таймеры деспавна складов",
    status: "ready",
    icon: iconPath("24-hour-clock"),
    summary: "Правило 48 часов и протокол обновления.",
    body: [
      "• Публичные и приватные склады Foxhole исчезают через 48 часов без обновления.",
      "• Красный статус — менее 1 часа: срочно отправьте бойца обновить склад.",
      "• Оранжевый — менее 24 часов: планируйте обновление в ближайшую смену.",
      "• После обновления в игре нажмите «Сбросить на 48 часов» или задайте точное время из игрового интерфейса.",
      "• Все действия фиксируются в журнале склада с меткой времени.",
    ],
  },
  { id: "logistics", title: "Основы логистики Foxhole", status: "wip", icon: iconPath("pallets"), summary: "Цепочки снабжения, MPF, фасилити." },
  { id: "protocol", title: "Протокол рапорта снабжения", status: "wip", icon: iconPath("parchment"), summary: "Стандарт оформления заявок для штаба клана." },
  { id: "front", title: "Передовая логистика", status: "wip", icon: iconPath("deadline"), summary: "Доставка под огнём, приоритеты, маршруты." },
];

export function TrainingWorkspace() {
  const [openId, setOpenId] = useState<string | null>("terminal");
  const ready = MODULES.filter((m) => m.status === "ready").length;

  return (
    <div className="tab-fade flex min-h-full flex-col items-center justify-center py-2">
      <section className="panel panel-corners w-full max-w-5xl rounded-md p-4 md:p-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="relative shrink-0">
            <Image src="/clan-logo.png" alt="Герб клана SINDARIS" width={112} height={112} className="ui-icon crest-frame h-24 w-24 rounded-md object-cover md:h-28 md:w-28" />
            <Image src={iconPath("brain")} alt="" width={44} height={44} unoptimized className="ui-icon absolute -right-3 -bottom-3 h-11 w-11 object-contain drop-shadow-lg" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="hud-label text-muted">Учебный центр штаба клана</div>
            <h1 className="title-brand mt-1 text-[1.35rem] md:text-[1.7rem]">📚 Обучение</h1>
            <p className="mt-2 text-[0.85rem] text-white/85">
              Материалы обучения находятся в разработке штаба клана. Базовые модули по работе с терминалом уже доступны — остальные разделы пополняются по мере утверждения интендантской службой.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="badge-count min-w-0 px-2">ДОСТУПНО: {ready}</span>
              <span className="badge-count min-w-0 px-2" style={{ color: "var(--warn)", borderColor: "var(--warn)" }}>В РАЗРАБОТКЕ: {MODULES.length - ready}</span>
              <div className="progress-track w-40">
                <div className="progress-bar" style={{ width: `${(ready / MODULES.length) * 100}%`, background: "var(--accent)" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="stencil-line my-5" />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m) => {
            const open = openId === m.id;
            const wip = m.status === "wip";
            return (
              <article
                key={m.id}
                className={`panel-inner flex flex-col rounded p-3 transition-all ${open ? "ring-1 ring-[var(--accent)]" : ""} ${wip ? "opacity-80" : ""} ${open && m.body ? "md:col-span-2 xl:col-span-3" : ""}`}
              >
                <button className="flex w-full items-start gap-3 text-left" onClick={() => setOpenId(open ? null : m.id)} disabled={wip}>
                  <Image src={m.icon} alt="" width={40} height={40} unoptimized className="ui-icon h-10 w-10 shrink-0 object-contain drop-shadow" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-[0.9rem] font-bold text-white">{m.title}</h3>
                      <span className="hud-label shrink-0 rounded border px-1.5 py-0.5" style={{ color: wip ? "var(--warn)" : "var(--accent)", borderColor: wip ? "var(--warn)" : "var(--accent)" }}>
                        {wip ? "В РАЗРАБОТКЕ" : open ? "ОТКРЫТО" : "ДОСТУПНО"}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.78rem] text-white/70">{m.summary}</p>
                  </div>
                </button>
                {open && m.body && (
                  <div className="console-log mt-3 rounded px-3 py-3 text-[0.78rem] leading-relaxed">
                    {m.body.map((line, i) => (
                      <div key={i} className="py-0.5">{line}</div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
