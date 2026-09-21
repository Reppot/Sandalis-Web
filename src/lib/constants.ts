// 📝 ТАКТИЧЕСКИЙ СПИСОК КАСТОМНЫХ ФРАЗ ШТАБА (радиоперехваты)
export const TACTICAL_CUSTOM_PHRASES = [
  "Работай сука",
  "Сделай САНДАЛИС снова великим!",
  "💀ЦЫГАНИС на связи. Спутниковый мониторинг шейкелей колонистов...",
  "Розыгрыш карвалола",
];

export const PHRASE_CHANCE = 0.1;
export const PHRASE_HOLD_SECONDS = 12;

// 🗺️ НАЧАЛЬНАЯ МАТРИЦА РЕГИОНОВ (seed для базы данных)
export const INITIAL_STOCKPILES = [
  { region: "Clanshead Valley", location: "Порт Clanshead", timeLeft: 56257, history: ["[СИСТЕМА]: Инициализация терминала секторов."] },
  { region: "The Linn of Lights", location: "Склад снабжения Запад", timeLeft: 3420, history: ["[СИСТЕМА]: Обнаружена критическая просадка по времени."] },
  { region: "Heartlands HQ", location: "Центральный Лог-Хаб", timeLeft: 86400, history: ["[СИСТЕМА]: Склад зарегистрирован интендантской службой."] },
  { region: "Marban Hollow", location: "Передовой бункер", timeLeft: 12450, history: ["[СИСТЕМА]: Запущена резервная линия мониторинга."] },
  { region: "Drowned Vale", location: "Морской Док", timeLeft: 1800, history: ["[СИСТЕМА]: Зафиксирован дефицит поставок."] },
];

export const FOXHOLE_REGIONS = [
  "Acrithia", "Allod's Bight", "Ash Fields", "Basin Sionnach", "Callahan's Passage", "Callum's Cape", "Clahstra",
  "Clanshead Valley", "Deadlands", "Drowned Vale", "Endless Shore", "Farranac Coast", "Fisherman's Row", "Godcrofts",
  "Great March", "Heartlands", "Howl County", "Kalokai", "King's Cage", "Loch Mór", "Marban Hollow", "Morgen's Crossing",
  "Nevish Line", "Oarbreaker Isles", "Origin", "Reaching Trail", "Reaver's Pass", "Red River", "Sableport", "Shackled Chasm",
  "Speaking Woods", "Stema Landing", "Stlican Shelf", "Stonecradle", "Tempest Island", "Terminus", "The Clahstra",
  "The Fingers", "The Heartlands", "The Linn of Lights", "The Moors", "The Oarbreaker Isles", "Umbral Wildwood",
  "Viper Pit", "Weathered Expanse", "Westgate",
];

export const STORAGE_KEYS = {
  theme: "sindaris-theme",
  sidebar: "sindaris-sidebar",
  order: "sindaris-order-draft",
} as const;

export const DEFAULT_RESET_SECONDS = 172800; // 48 часов

// ───────────────────────── РЕЕСТР ИКОНОК ─────────────────────────
// Это единая конфигурация public/icons. Имена хранятся без пути и расширения.
// Добавление нового PNG в папку требует только добавления его имени сюда.
export const ICON_FILES = [
  "24-hour-clock",
  "barracks",
  "braces",
  "brain",
  "browsing",
  "business",
  "clock",
  "conveyor-belt",
  "deadline",
  "delivery-van",
  "ecommerce",
  "find",
  "forklift",
  "json",
  "log-file",
  "military-base",
  "parcel",
  "pallets",
  "parchment",
  "png-file",
  "pre-forklift",
  "products",
  "second",
  "stopwatch",
  "txt-file",
  "xls",
] as const;

export type IconName = (typeof ICON_FILES)[number];
export const DEFAULT_ICON_NAME: IconName = "parchment";
export const DEFAULT_ICON_PATH = `/icons/${DEFAULT_ICON_NAME}.png`;

const ICON_SET = new Set<string>(ICON_FILES);
const ICON_ALIASES: Record<string, IconName> = {
  order: "parchment",
  orders: "parchment",
  report: "parchment",
  warehouse: "barracks",
  stockpile: "pallets",
  stockpiles: "pallets",
  storage: "pallets",
  supplies: "parcel",
  timer: "24-hour-clock",
  timers: "24-hour-clock",
  import: "json",
  clipboard: "log-file",
  log: "log-file",
  xlsx: "xls",
  excel: "xls",
  png: "png-file",
  text: "txt-file",
  txt: "txt-file",
  base: "military-base",
  headquarters: "military-base",
  training: "brain",
};

function normalizeAssetName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^\/icons\//, "")
    .replace(/\.png$/i, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

/** Возвращает безопасный путь к PNG из public/icons. */
export function iconPath(name: string | null | undefined): string {
  const normalized = normalizeAssetName(name ?? "");
  const resolved = ICON_ALIASES[normalized] ?? normalized;
  return ICON_SET.has(resolved) ? `/icons/${resolved}.png` : DEFAULT_ICON_PATH;
}

export const ICON_MAP: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(ICON_FILES.map((name) => [name, `/icons/${name}.png`])),
);

// ───────────────────────── РЕЕСТР ФОНОВ ─────────────────────────
export interface BackgroundAsset {
  name: string;
  src: string;
  label: string;
  position: string;
}

// Полный список доступных файлов из public/bg.
export const BACKGROUND_ASSETS: readonly BackgroundAsset[] = [
  { name: "606565_smittyymann_warden-field-artillery.png", src: "/bg/606565_smittyymann_warden-field-artillery.png", label: "Полевая артиллерия", position: "center" },
  { name: "c516.jpg", src: "/bg/c516.jpg", label: "Тактическая текстура", position: "center" },
  { name: "card-bg.jpg.jpg", src: "/bg/card-bg.jpg.jpg", label: "Фон карточек", position: "center" },
  { name: "foxhole_banner_commission_for_the_27th_by_tomisa_deqkutr-pre.jpg", src: "/bg/foxhole_banner_commission_for_the_27th_by_tomisa_deqkutr-pre.jpg", label: "Штабной баннер", position: "center" },
  { name: "Gg4RBjVXQAA5Zh2.jfif", src: "/bg/Gg4RBjVXQAA5Zh2.jfif", label: "Береговой сектор", position: "center" },
  { name: "gray-background.jpg", src: "/bg/gray-background.jpg", label: "Рапорт", position: "center" },
  { name: "GYRLHtMXEAAolXS.jfif", src: "/bg/GYRLHtMXEAAolXS.jfif", label: "Зелёная линия", position: "center" },
  { name: "page_bg_raw.jpg", src: "/bg/page_bg_raw.jpg", label: "Северное сияние", position: "center" },
  { name: "wp13764959-foxhole-wallpapers.jpg", src: "/bg/wp13764959-foxhole-wallpapers.jpg", label: "Зимняя оборона", position: "58% center" },
  { name: "wp13764968-foxhole-wallpapers.jpg", src: "/bg/wp13764968-foxhole-wallpapers.jpg", label: "Береговая высадка", position: "center" },
  { name: "wp13764972.png", src: "/bg/wp13764972.png", label: "Наблюдательный пост", position: "center" },
  { name: "wp13765010-foxhole-wallpapers.jpg", src: "/bg/wp13765010-foxhole-wallpapers.jpg", label: "Ночная база", position: "center" },
  { name: "war-plan-foxhole-fan-art-warden-version-v0-v8c2b4w3a42c1.webp", src: "/bg/war-plan-foxhole-fan-art-warden-version-v0-v8c2b4w3a42c1.webp", label: "Warden War Plan V8", position: "center" },
  { name: "war-plan-foxhole-fan-art-warden-version-v0-l7l7cn6u942c1.webp", src: "/bg/war-plan-foxhole-fan-art-warden-version-v0-l7l7cn6u942c1.webp", label: "Warden War Plan L7", position: "center" },
  { name: "war-plan-foxhole-fan-art-warden-version-v0-qzo9oqg4a42c1.webp", src: "/bg/war-plan-foxhole-fan-art-warden-version-v0-qzo9oqg4a42c1.webp", label: "Warden War Plan QZ", position: "center" },
] as const;

export const BACKGROUND_MAP: Readonly<Record<string, BackgroundAsset>> = Object.freeze(
  Object.fromEntries(BACKGROUND_ASSETS.map((asset) => [asset.name, asset])),
);

const background = (name: string): BackgroundAsset => BACKGROUND_MAP[name] ?? BACKGROUND_ASSETS[0];

// Разные пулы сохраняют атмосферу раздела и позволяют легко заменить порядок арт-ов.
export const SECTION_BACKGROUNDS = {
  home: [background("page_bg_raw.jpg"), background("wp13764968-foxhole-wallpapers.jpg"), background("c516.jpg")],
  orders: [background("war-plan-foxhole-fan-art-warden-version-v0-v8c2b4w3a42c1.webp"), background("606565_smittyymann_warden-field-artillery.png"), background("wp13764959-foxhole-wallpapers.jpg")],
  storage: [background("war-plan-foxhole-fan-art-warden-version-v0-l7l7cn6u942c1.webp"), background("wp13764959-foxhole-wallpapers.jpg"), background("wp13764972.png")],
  timers: [background("war-plan-foxhole-fan-art-warden-version-v0-qzo9oqg4a42c1.webp"), background("foxhole_banner_commission_for_the_27th_by_tomisa_deqkutr-pre.jpg"), background("wp13765010-foxhole-wallpapers.jpg")],
  training: [background("war-plan-foxhole-fan-art-warden-version-v0-l7l7cn6u942c1.webp"), background("page_bg_raw.jpg"), background("wp13765010-foxhole-wallpapers.jpg")],
  codes: [background("war-plan-foxhole-fan-art-warden-version-v0-qzo9oqg4a42c1.webp"), background("c516.jpg")],
  tools: [background("page_bg_raw.jpg"), background("war-plan-foxhole-fan-art-warden-version-v0-v8c2b4w3a42c1.webp")],
  report: [background("gray-background.jpg"), background("c516.jpg")],
  card: [background("card-bg.jpg.jpg")],
  default: [background("war-plan-foxhole-fan-art-warden-version-v0-v8c2b4w3a42c1.webp"), background("wp13764968-foxhole-wallpapers.jpg"), background("GYRLHtMXEAAolXS.jfif")],
} as const;

export type BackgroundSection = keyof typeof SECTION_BACKGROUNDS;
export type PageBackground = BackgroundAsset;

export function backgroundAsset(section: BackgroundSection): BackgroundAsset {
  return SECTION_BACKGROUNDS[section][0];
}

/** Выбирает фон раздела по URL; CSS bg-neutral-950 остаётся подложкой всегда. */
export function backgroundForPath(pathname: string): BackgroundAsset {
  if (pathname.startsWith("/training")) return backgroundAsset("training");
  if (pathname.startsWith("/codes")) return backgroundAsset("codes");
  if (pathname.startsWith("/tools")) return backgroundAsset("tools");
  if (pathname.startsWith("/timers")) return backgroundAsset("timers");
  if (pathname.startsWith("/storage")) return backgroundAsset("storage");
  if (pathname.startsWith("/orders")) return backgroundAsset("orders");
  if (pathname === "/" || pathname === "") return backgroundAsset("home");
  return backgroundAsset("default");
}

export const NAV_ITEMS = [
  { href: "/orders", label: "Заказы", icon: iconPath("parchment"), hint: "Конструктор заказов и монитор склада" },
  { href: "/timers", label: "Таймеры", icon: iconPath("24-hour-clock"), hint: "Таймеры деспавна складов" },
  { href: "/codes", label: "База кодов", icon: iconPath("braces"), hint: "Реестр кодов предметов Foxhole" },
  { href: "/cabinet", label: "Личный кабинет", icon: iconPath("business"), hint: "Профиль участника клана" },
  { href: "/tools", label: "Инструменты", icon: iconPath("browsing"), hint: "Внешние инструменты Foxhole" },
  { href: "/training", label: "Обучение", icon: iconPath("brain"), hint: "Учебный центр штаба" },
] as const;

// ───────────────────────── ВНЕШНИЕ ИНСТРУМЕНТЫ ─────────────────────────
export interface ExternalTool {
  name: string;
  url: string;
  description: string;
  tag: string;
  icon: string;
}

/** Сторонние инструменты клана: калькуляторы производства, карты, логистика, авиация. */
export const EXTERNAL_TOOLS: ExternalTool[] = [
  {
    name: "ANV Foxhole ToolHub",
    url: "https://anv-fh.eu/toolhub/",
    description: "Большой набор калькуляторов заводов и фабрик, безопасный GPS логистов и другие утилиты снабжения.",
    tag: "Калькуляторы производства",
    icon: "🧮",
  },
  {
    name: "Foxhole HQ",
    url: "https://foxholehq.com/",
    description: "Огромная библиотека 3D-моделей построек и техники, а также карта с пользовательскими заметками.",
    tag: "3D-модели и карта",
    icon: "🗺️",
  },
  {
    name: "Foxhole Planner",
    url: "https://foxholeplanner.com/",
    description: "Планировщик застройки баз со множеством готовых пресетов фортов, складов и оборонительных линий.",
    tag: "Планировщик построек",
    icon: "📐",
  },
  {
    name: "Fharty Artillery Calculator",
    url: "https://fharty.craftingthrulife.com/",
    description: "Простой и быстрый калькулятор для расчёта артиллерийских дистанций и поправок.",
    tag: "Артиллерия",
    icon: "🎯",
  },
  {
    name: "Plane Damage Calculator",
    url: "https://planes.nfml.net/#t=AircraftFighterC&p=AircraftScoutC&g=AircraftScoutC_HMG&v=top",
    description: "Калькулятор урона для расчёта воздушного боя: сравнение самолётов, вооружения и живучести.",
    tag: "Авиация",
    icon: "✈️",
  },
];
