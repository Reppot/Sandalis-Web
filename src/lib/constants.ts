export const STORAGE_KEYS = {
  order: "sindaris-order-draft",
} as const;

export interface ExternalTool {
  name: string;
  url: string;
  description: string;
  tag: string;
  icon: string;
}

/** Внешние инструменты для клана: калькуляторы производства, карты, логистика. */
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
  {
    name: "Sravdar Foxhole Map",
    url: "https://sravdar.github.io/",
    description: "Интерактивная карта войны Foxhole с тайлами регионов для навигации по театру боевых действий.",
    tag: "Карта",
    icon: "🧭",
  },
];
