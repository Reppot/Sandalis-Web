// ─────────────────────────────────────────────────────────────
// SINDARIS Terminal — данные реестров штаба
// ─────────────────────────────────────────────────────────────

export type SectionId =
  | "orders"
  | "timers"
  | "codes"
  | "map"
  | "tools"
  | "training"
  | "cabinet";

export interface NavItem {
  id: SectionId;
  label: string;
  hint: string;
  bg: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "orders", label: "Заказы", hint: "Конструктор заказов и монитор склада", bg: "/images/bg-orders.jpg" },
  { id: "timers", label: "Таймеры", hint: "Таймеры деспавна складов", bg: "/images/bg-timers.jpg" },
  { id: "codes", label: "База кодов", hint: "Реестр кодов предметов Foxhole", bg: "/images/bg-codes.jpg" },
  { id: "map", label: "Карта сектора", hint: "Контроль регионов и линия фронта", bg: "/images/bg-map.jpg" },
  { id: "tools", label: "Инструменты", hint: "Factory-калькулятор и внешние сервисы", bg: "/images/bg-tools.jpg" },
  { id: "training", label: "Обучение", hint: "Учебный центр штаба", bg: "/images/bg-training.jpg" },
  { id: "cabinet", label: "Личный кабинет", hint: "Профиль участника клана", bg: "/images/bg-home.jpg" },
];

export const LOGIN_BG = "/images/bg-home.jpg";

// ─────────── ФРАЗЫ ШТАБА (радиоперехваты для бегущей строки) ───────────
export const TACTICAL_PHRASES = [
  "РАБОТАЙ СУКА — ШТАБ НАБЛЮДАЕТ",
  "СДЕЛАЙ САНДАЛИС СНОВА ВЕЛИКИМ",
  "ЦЫГАНИС НА СВЯЗИ: СПУТНИКОВЫЙ МОНИТОРИНГ ШЕЙКЕЛЕЙ КОЛОНИСТОВ",
  "РОЗЫГРЫШ КАРВАЛОЛА ЧЕРЕЗ 12 ЧАСОВ",
  "ПРОВЕРЬ СВОЙ СКЛАД ДО КОНЦА СМЕНЫ",
  "ЛОГИ В КАНАЛЕ 3 — НЕ ОПОЗДАЙ НА КОНВОЙ",
  "СНАБЖЕНИЕ ФРОНТА — ПРИОРИТЕТ НОМЕР ОДИН",
] as const;

export const DEFAULT_RESET_SECONDS = 172800; // 48 часов

// ─────────── РЕГИОНЫ FOXHOLE ───────────
export const FOXHOLE_REGIONS = [
  "Acrithia", "Allod's Bight", "Ash Fields", "Basin Sionnach", "Callahan's Passage",
  "Callum's Cape", "Clahstra", "Clanshead Valley", "Deadlands", "Drowned Vale",
  "Endless Shore", "Farranac Coast", "Fisherman's Row", "Godcrofts", "Great March",
  "Heartlands", "Howl County", "Kalokai", "King's Cage", "Loch Mór", "Marban Hollow",
  "Morgen's Crossing", "Nevish Line", "Oarbreaker", "Origin", "Reaching Trail",
  "Reaver's Pass", "Red River", "Sableport", "Shackled Chasm", "Speaking Woods",
  "Stema Landing", "Stlican Shelf", "Stonecradle", "Tempest Island", "Terminus",
  "The Fingers", "The Linn of Lights", "The Moors", "Umbral Wildwood", "Viper Pit",
  "Weathered Expanse", "Westgate",
] as const;

// ─────────── СТАРТОВАЯ МАТРИЦА СКЛАДОВ ───────────
export interface StockpileSeed {
  region: string;
  location: string;
  offsetSeconds: number;
  note: string;
}

export const INITIAL_STOCKPILES: StockpileSeed[] = [
  { region: "Clanshead Valley", location: "Порт Clanshead", offsetSeconds: 56257, note: "Инициализация терминала секторов" },
  { region: "The Linn of Lights", location: "Склад снабжения «Запад»", offsetSeconds: 3420, note: "Обнаружена критическая просадка по времени" },
  { region: "Heartlands", location: "Центральный лог-хаб HQ", offsetSeconds: 86400, note: "Склад зарегистрирован интендантской службой" },
  { region: "Marban Hollow", location: "Передовой бункер", offsetSeconds: 12450, note: "Запущена резервная линия мониторинга" },
  { region: "Drowned Vale", location: "Морской док", offsetSeconds: 1800, note: "Зафиксирован дефицит поставок" },
];

// ─────────── БАЗА КОДОВ ПРЕДМЕТОВ ───────────
export type CodeCategory =
  | "Оружие"
  | "Боеприпасы"
  | "Материалы"
  | "Снаряжение"
  | "Предметы"
  | "Техника"
  | "Сооружения";

export type CodeFaction = "Колонисты" | "Варден" | "Нейтральные";

export interface CodeEntry {
  code: string;
  nameEn: string;
  nameRu: string;
  category: CodeCategory;
  faction: CodeFaction;
  review?: boolean;
}

export const CODE_BASE_CATEGORIES: CodeCategory[] = [
  "Оружие", "Боеприпасы", "Материалы", "Снаряжение", "Предметы", "Техника", "Сооружения",
];

export const CODE_BASE_FACTIONS: CodeFaction[] = ["Колонисты", "Варден", "Нейтральные"];

export const CODE_CATALOG: CodeEntry[] = [
  // ── ОРУЖИЕ ──
  { code: "RifleW", nameEn: "No.2 Loughcaster", nameRu: "Винтовка «Лафкастер»", category: "Оружие", faction: "Варден" },
  { code: "RifleC", nameEn: "Argenti r.II Rifle", nameRu: "Винтовка «Аргенти»", category: "Оружие", faction: "Колонисты" },
  { code: "AssaultRifleW", nameEn: "Aalto Storm Rifle 24", nameRu: "Штурмовая винтовка «Аалто»", category: "Оружие", faction: "Варден" },
  { code: "AssaultRifleC", nameEn: "KH-2 Booker Storm Rifle", nameRu: "Штурмовая винтовка «Букер»", category: "Оружие", faction: "Колонисты" },
  { code: "SMGW", nameEn: "Fiddler Submachine Gun", nameRu: "Пистолет-пулемёт «Фидлер»", category: "Оружие", faction: "Варден" },
  { code: "SMGC", nameEn: "The Pitch Gun mc.V", nameRu: "Пистолет-пулемёт «Питч Ган»", category: "Оружие", faction: "Колонисты" },
  { code: "PistolW", nameEn: "Cascadier 873", nameRu: "Пистолет «Каскадьер»", category: "Оружие", faction: "Варден", review: true },
  { code: "PistolC", nameEn: "Ferro 879", nameRu: "Пистолет «Ферро»", category: "Оружие", faction: "Колонисты" },
  { code: "RevolverW", nameEn: "Ahti Model 2", nameRu: "Револьвер «Ахти»", category: "Оружие", faction: "Варден" },
  { code: "RevolverC", nameEn: "Cometa T2-9", nameRu: "Револьвер «Комета»", category: "Оружие", faction: "Колонисты" },
  { code: "ShotgunW", nameEn: "Brasa Shotgun", nameRu: "Дробовик «Браса»", category: "Оружие", faction: "Нейтральные" },
  { code: "LongRifleW", nameEn: "Clancy Cinder M3", nameRu: "Длинная винтовка «Синдер»", category: "Оружие", faction: "Варден" },
  { code: "SniperRifleC", nameEn: "KRR3-792 Auger", nameRu: "Снайперская винтовка «Ожер»", category: "Оружие", faction: "Колонисты" },
  { code: "MGW", nameEn: "KRN886-127 Gast Machine Gun", nameRu: "Пулемёт «Гаст»", category: "Оружие", faction: "Варден", review: true },
  { code: "MGC", nameEn: "Lamentum mm.IV", nameRu: "Пулемёт «Ламентум»", category: "Оружие", faction: "Колонисты" },
  { code: "AntiTankRifleW", nameEn: "Mounted Bonesaw MK.3", nameRu: "ПТ-ружьё «Боунсо»", category: "Оружие", faction: "Нейтральные", review: true },
  { code: "RPGW", nameEn: "Cutler Foebreaker?", nameRu: "Гранатомёт «Фобрейкер»", category: "Оружие", faction: "Варден", review: true },
  { code: "RPGC", nameEn: "Bane 45", nameRu: "Гранатомёт «Бэйн»", category: "Оружие", faction: "Колонисты", review: true },
  { code: "MortarW", nameEn: "Cremari Mortar", nameRu: "Миномёт «Кремари»", category: "Оружие", faction: "Нейтральные" },
  { code: "FlameTorchC", nameEn: "Daucus isg.III", nameRu: "Огнемёт «Даукус»", category: "Оружие", faction: "Колонисты", review: true },
  { code: "GrenadeC", nameEn: "A3 Harpa Fragmentation Grenade", nameRu: "Граната «Харпа»", category: "Оружие", faction: "Колонисты" },
  { code: "GrenadeW", nameEn: "Mammon 91-b", nameRu: "Граната «Маммон»", category: "Оружие", faction: "Варден" },
  { code: "StickyGrenadeC", nameEn: "Bomastone Grenade", nameRu: "Липкая граната «Бомастоун»", category: "Оружие", faction: "Колонисты" },
  { code: "SmokeGrenadeW", nameEn: "PT-815 Smoke Grenade", nameRu: "Дымовая граната", category: "Оружие", faction: "Варден" },
  { code: "GasGrenadeC", nameEn: "Green Ash Grenade", nameRu: "Газовая граната «Зелёный Пепел»", category: "Оружие", faction: "Нейтральные" },
  { code: "ATMineC", nameEn: "Abisme AT-99 Mine", nameRu: "Противотанковая мина", category: "Оружие", faction: "Нейтральные" },
  { code: "SatchelC", nameEn: "Hydra's Whisper?", nameRu: "Подрывной заряд", category: "Оружие", faction: "Нейтральные", review: true },
  { code: "Bayonet", nameEn: "Bayonet", nameRu: "Штык-нож", category: "Оружие", faction: "Нейтральные" },

  // ── БОЕПРИПАСЫ ──
  { code: "762mm", nameEn: "7.62mm", nameRu: "Патрон 7.62мм", category: "Боеприпасы", faction: "Колонисты" },
  { code: "792mm", nameEn: "7.92mm", nameRu: "Патрон 7.92мм", category: "Боеприпасы", faction: "Варден" },
  { code: "8mm", nameEn: "8mm", nameRu: "Патрон 8мм", category: "Боеприпасы", faction: "Колонисты" },
  { code: "9mm", nameEn: "9mm", nameRu: "Пистолетный патрон 9мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "44Cal", nameEn: ".44", nameRu: "Револьверный патрон .44", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "Shrapnel", nameEn: "Buckshot", nameRu: "Картечь", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "127mm", nameEn: "12.7mm", nameRu: "Патрон 12.7мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "145mm", nameEn: "14.5mm", nameRu: "Патрон 14.5мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "20mm", nameEn: "20mm", nameRu: "Снаряд 20мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "30mm", nameEn: "30mm Round", nameRu: "Снаряд 30мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "40mm", nameEn: "40mm Round", nameRu: "Снаряд 40мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "68mm", nameEn: "68mm AT Round", nameRu: "ПТ-снаряд 68мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "75mm", nameEn: "75mm Round", nameRu: "Снаряд 75мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "945mm", nameEn: "94.5mm Round", nameRu: "Снаряд 94.5мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "120mm", nameEn: "120mm Shell", nameRu: "Снаряд 120мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "150mm", nameEn: "150mm Shell", nameRu: "Снаряд 150мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "250mm", nameEn: "250mm Shell", nameRu: "Снаряд 250мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "300mm", nameEn: "300mm Round", nameRu: "Снаряд 300мм", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "RPGAmmoC", nameEn: "RPG Round", nameRu: "Выстрел РПГ", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "ATRPGAmmo", nameEn: "AT RPG Round", nameRu: "ПТ-выстрел РПГ", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "MortarAmmo", nameEn: "Mortar Shell", nameRu: "Мина для миномёта", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "MortarAmmoSH", nameEn: "Shrapnel Mortar Shell", nameRu: "Осколочная мина", category: "Боеприпасы", faction: "Нейтральные", review: true },
  { code: "MortarAmmoFL", nameEn: "Flare Mortar Shell", nameRu: "Осветительная мина", category: "Боеприпасы", faction: "Нейтральные" },
  { code: "RivHereticAmmo", nameEn: "Ignifist 30", nameRu: "Выстрел «Игнифист»", category: "Боеприпасы", faction: "Колонисты", review: true },
  { code: "FlameAmmoC", nameEn: "Flame Ammo", nameRu: "Огнесмесь", category: "Боеприпасы", faction: "Колонисты" },

  // ── МАТЕРИАЛЫ ──
  { code: "Cloth", nameEn: "Basic Materials", nameRu: "Базовые материалы (bmat)", category: "Материалы", faction: "Нейтральные" },
  { code: "Metal", nameEn: "Refined Materials", nameRu: "Очищенные материалы (rmat)", category: "Материалы", faction: "Нейтральные" },
  { code: "Explosive", nameEn: "Explosive Materials", nameRu: "Взрывчатые материалы (emat)", category: "Материалы", faction: "Нейтральные" },
  { code: "HeavyExplosive", nameEn: "Heavy Explosive Materials", nameRu: "Тяжёлая взрывчатка (hemat)", category: "Материалы", faction: "Нейтральные" },
  { code: "Concrete", nameEn: "Concrete Materials", nameRu: "Бетонные смеси", category: "Материалы", faction: "Нейтральные" },
  { code: "Wood", nameEn: "Salvage", nameRu: "Металлолом", category: "Материалы", faction: "Нейтральные" },
  { code: "Components", nameEn: "Components", nameRu: "Компоненты", category: "Материалы", faction: "Нейтральные" },
  { code: "Sulfur", nameEn: "Sulfur", nameRu: "Сера", category: "Материалы", faction: "Нейтральные" },
  { code: "Coal", nameEn: "Coal", nameRu: "Уголь", category: "Материалы", faction: "Нейтральные" },
  { code: "Coke", nameEn: "Coke", nameRu: "Кокс", category: "Материалы", faction: "Нейтральные" },
  { code: "IronOre", nameEn: "Iron", nameRu: "Железная руда", category: "Материалы", faction: "Нейтральные" },
  { code: "IronAlloy", nameEn: "Iron Alloy", nameRu: "Железный сплав", category: "Материалы", faction: "Нейтральные" },
  { code: "CopperOre", nameEn: "Copper", nameRu: "Медная руда", category: "Материалы", faction: "Нейтральные" },
  { code: "CopperAlloy", nameEn: "Copper Alloy", nameRu: "Медный сплав", category: "Материалы", faction: "Нейтральные" },
  { code: "AluminumOre", nameEn: "Aluminum", nameRu: "Алюминий (рудник)", category: "Материалы", faction: "Нейтральные" },
  { code: "AluminumAlloy", nameEn: "Aluminum Alloy", nameRu: "Алюминиевый сплав", category: "Материалы", faction: "Нейтральные" },
  { code: "Oil", nameEn: "Crude Oil", nameRu: "Сырая нефть", category: "Материалы", faction: "Нейтральные" },
  { code: "Diesel", nameEn: "Diesel", nameRu: "Дизельное топливо", category: "Материалы", faction: "Нейтральные" },
  { code: "Petrol", nameEn: "Petrol", nameRu: "Бензин", category: "Материалы", faction: "Нейтральные" },
  { code: "Water", nameEn: "Water", nameRu: "Вода", category: "Материалы", faction: "Нейтральные" },
  { code: "Stone", nameEn: "Stone", nameRu: "Камень", category: "Материалы", faction: "Нейтральные" },
  { code: "Sand", nameEn: "Sand", nameRu: "Песок", category: "Материалы", faction: "Нейтральные" },
  { code: "AssemblyMaterials1", nameEn: "Construction Materials", nameRu: "Строительные материалы (cmat)", category: "Материалы", faction: "Нейтральные", review: true },

  // ── СНАРЯЖЕНИЕ ──
  { code: "UniformSoldierW", nameEn: "Soldier Uniform (Warden)", nameRu: "Форма бойца (Варден)", category: "Снаряжение", faction: "Варден" },
  { code: "UniformSoldierC", nameEn: "Soldier Uniform (Colonial)", nameRu: "Форма бойца (Колонисты)", category: "Снаряжение", faction: "Колонисты" },
  { code: "UniformEngineer", nameEn: "Engineer Uniform", nameRu: "Форма сапёра", category: "Снаряжение", faction: "Нейтральные" },
  { code: "UniformTank", nameEn: "Gunner's Breastplate", nameRu: "Форма артиллериста", category: "Снаряжение", faction: "Нейтральные", review: true },
  { code: "Backpack", nameEn: "Backpack", nameRu: "Рюкзак", category: "Снаряжение", faction: "Нейтральные" },
  { code: "RadioBackpack", nameEn: "Radio Backpack", nameRu: "Радиоранец", category: "Снаряжение", faction: "Нейтральные" },
  { code: "Binoculars", nameEn: "Binoculars", nameRu: "Бинокль", category: "Снаряжение", faction: "Нейтральные" },
  { code: "GasMask", nameEn: "Gas Mask", nameRu: "Противогаз", category: "Снаряжение", faction: "Нейтральные" },
  { code: "GasMaskFilter", nameEn: "Gas Mask Filter", nameRu: "Фильтр противогаза", category: "Снаряжение", faction: "Нейтральные" },
  { code: "Shovel", nameEn: "Shovel", nameRu: "Сапёрная лопата", category: "Снаряжение", faction: "Нейтральные" },
  { code: "WorkHammer", nameEn: "Hammer", nameRu: "Молоток", category: "Снаряжение", faction: "Нейтральные" },
  { code: "SledgeHammer", nameEn: "Sledge Hammer", nameRu: "Кувалда", category: "Снаряжение", faction: "Нейтральные" },
  { code: "Wrench", nameEn: "Wrench", nameRu: "Гаечный ключ", category: "Снаряжение", faction: "Нейтральные" },
  { code: "ListeningKit", nameEn: "Listening Kit", nameRu: "Акустический комплект", category: "Снаряжение", faction: "Нейтральные" },
  { code: "Tripod", nameEn: "Tripod", nameRu: "Тренога для оружия", category: "Снаряжение", faction: "Нейтральные" },
  { code: "Bandages", nameEn: "Bandages", nameRu: "Бинты", category: "Снаряжение", faction: "Нейтральные" },
  { code: "FirstAidKit", nameEn: "First Aid Kit", nameRu: "Аптечка первой помощи", category: "Снаряжение", faction: "Нейтральные" },
  { code: "TraumaKit", nameEn: "Trauma Kit", nameRu: "Полевая хирургическая сумка", category: "Снаряжение", faction: "Нейтральные" },
  { code: "BloodPlasma", nameEn: "Blood Plasma", nameRu: "Плазма крови", category: "Снаряжение", faction: "Нейтральные" },

  // ── ПРЕДМЕТЫ ──
  { code: "Sandbag", nameEn: "Sandbags", nameRu: "Мешки с песком", category: "Предметы", faction: "Нейтральные" },
  { code: "BarbedWireMaterial", nameEn: "Barbed Wire", nameRu: "Колючая проволока", category: "Предметы", faction: "Нейтральные" },
  { code: "MetalBeam", nameEn: "Metal Beam", nameRu: "Металлическая балка", category: "Предметы", faction: "Нейтральные" },
  { code: "PipeLarge", nameEn: "Pipe", nameRu: "Труба", category: "Предметы", faction: "Нейтральные" },

  // ── ТЕХНИКА ──
  { code: "ConstrVehicle", nameEn: "Construction Vehicle", nameRu: "Строительная машина (CV)", category: "Техника", faction: "Нейтральные" },
  { code: "TruckC", nameEn: "R-1 Hauler", nameRu: "Грузовик «Хаулер»", category: "Техника", faction: "Колонисты" },
  { code: "TruckW", nameEn: "Dunne Transport", nameRu: "Грузовик «Данн»", category: "Техника", faction: "Варден" },
  { code: "FlatbedTruck", nameEn: "Flatbed Truck", nameRu: "Бортовой грузовик", category: "Техника", faction: "Нейтральные" },
  { code: "AmbulanceC", nameEn: "R-12 Salus Ambulance", nameRu: "Санитарная машина (К)", category: "Техника", faction: "Колонисты", review: true },
  { code: "AmbulanceW", nameEn: "Dunne Responder 3e", nameRu: "Санитарная машина (В)", category: "Техника", faction: "Варден", review: true },
  { code: "Harvester", nameEn: "Scrap Harvester", nameRu: "Харвестер металлолома", category: "Техника", faction: "Нейтральные", review: true },
  { code: "LightTankC", nameEn: "Devitt Mk. III", nameRu: "Лёгкий танк «Девитт»", category: "Техника", faction: "Колонисты" },
  { code: "LightTankW", nameEn: "H-5 Hatchet", nameRu: "Лёгкий танк «Хэтчет»", category: "Техника", faction: "Варден" },
  { code: "BattleTankC", nameEn: "Colonial Battle Tank", nameRu: "Тяжёлый танк (К)", category: "Техника", faction: "Колонисты", review: true },
  { code: "BattleTankW", nameEn: "Warden Battle Tank", nameRu: "Тяжёлый танк (В)", category: "Техника", faction: "Варден", review: true },
  { code: "FieldArtilleryW", nameEn: "Huber Lariat 120mm", nameRu: "Полевая артиллерия (В)", category: "Техника", faction: "Варден", review: true },
  { code: "FieldArtilleryC", nameEn: "120-68 Koronides Field Gun", nameRu: "Полевое орудие (К)", category: "Техника", faction: "Колонисты", review: true },
  { code: "HalfTrack", nameEn: "Half-Track", nameRu: "Полугусеничный транспорт", category: "Техника", faction: "Нейтральные", review: true },
  { code: "Motorboat", nameEn: "BMS Aquatipper", nameRu: "Баржа", category: "Техника", faction: "Нейтральные" },
  { code: "Freighter", nameEn: "BMS Alliant Charge", nameRu: "Сухогруз", category: "Техника", faction: "Нейтральные", review: true },

  // ── СООРУЖЕНИЯ ──
  { code: "ShippingContainer", nameEn: "Shipping Container", nameRu: "Грузовой контейнер", category: "Сооружения", faction: "Нейтральные" },
  { code: "ResourceContainer", nameEn: "Resource Container", nameRu: "Ресурсный контейнер", category: "Сооружения", faction: "Нейтральные" },
  { code: "StorageBox", nameEn: "Storage Box", nameRu: "Ящик хранения", category: "Сооружения", faction: "Нейтральные" },
  { code: "MaterialPallet", nameEn: "Material Pallet", nameRu: "Поддон материалов", category: "Сооружения", faction: "Нейтральные" },
  { code: "FuelContainer", nameEn: "Fuel Container", nameRu: "Топливный контейнер", category: "Сооружения", faction: "Нейтральные", review: true },
];

// ─────────── FACTORY-КАЛЬКУЛЯТОР ───────────
export interface Recipe {
  id: string;
  name: string;
  ru: string;
  crate: number; // единиц в ящике
  bmat: number;
  rmat: number;
  emat: number;
  hemat: number;
  secPerCrate: number;
  group: "Пехота" | "Боеприпасы" | "Тяжёлое вооружение" | "Медицина";
}

export const FACTORY_RECIPES: Recipe[] = [
  { id: "rifle", name: "Argenti r.II", ru: "Винтовка «Аргенти»", crate: 20, bmat: 100, rmat: 0, emat: 0, hemat: 0, secPerCrate: 30, group: "Пехота" },
  { id: "storm-rifle", name: "Booker Storm Rifle", ru: "Штурмовая винтовка", crate: 15, bmat: 150, rmat: 30, emat: 0, hemat: 0, secPerCrate: 45, group: "Пехота" },
  { id: "smg", name: "Pitch Gun", ru: "Пистолет-пулемёт", crate: 20, bmat: 80, rmat: 0, emat: 0, hemat: 0, secPerCrate: 35, group: "Пехота" },
  { id: "mg", name: "Lamentum MG", ru: "Пулемёт", crate: 10, bmat: 120, rmat: 20, emat: 0, hemat: 0, secPerCrate: 50, group: "Пехота" },
  { id: "rpg-launcher", name: "RPG Launcher", ru: "Гранатомёт", crate: 5, bmat: 60, rmat: 30, emat: 0, hemat: 0, secPerCrate: 60, group: "Пехота" },
  { id: "grenade", name: "Harpa Grenade", ru: "Граната «Харпа»", crate: 20, bmat: 100, rmat: 0, emat: 25, hemat: 0, secPerCrate: 40, group: "Пехота" },
  { id: "sticky", name: "Bomastone", ru: "Липкая граната", crate: 10, bmat: 50, rmat: 0, emat: 40, hemat: 0, secPerCrate: 40, group: "Пехота" },
  { id: "bandages", name: "Bandages", ru: "Бинты", crate: 80, bmat: 80, rmat: 0, emat: 0, hemat: 0, secPerCrate: 20, group: "Медицина" },
  { id: "firstaid", name: "First Aid Kit", ru: "Аптечка", crate: 10, bmat: 60, rmat: 0, emat: 0, hemat: 0, secPerCrate: 25, group: "Медицина" },
  { id: "plasma", name: "Blood Plasma", ru: "Плазма крови", crate: 80, bmat: 160, rmat: 0, emat: 0, hemat: 0, secPerCrate: 30, group: "Медицина" },
  { id: "ammo-762", name: "7.62mm", ru: "Патрон 7.62мм", crate: 40, bmat: 80, rmat: 0, emat: 0, hemat: 0, secPerCrate: 20, group: "Боеприпасы" },
  { id: "ammo-792", name: "7.92mm", ru: "Патрон 7.92мм", crate: 40, bmat: 80, rmat: 0, emat: 0, hemat: 0, secPerCrate: 20, group: "Боеприпасы" },
  { id: "ammo-127", name: "12.7mm", ru: "Патрон 12.7мм", crate: 30, bmat: 100, rmat: 5, emat: 0, hemat: 0, secPerCrate: 25, group: "Боеприпасы" },
  { id: "shell-30", name: "30mm Round", ru: "Снаряд 30мм", crate: 20, bmat: 120, rmat: 0, emat: 15, hemat: 0, secPerCrate: 30, group: "Боеприпасы" },
  { id: "shell-68", name: "68mm AT", ru: "ПТ-снаряд 68мм", crate: 10, bmat: 100, rmat: 0, emat: 35, hemat: 0, secPerCrate: 35, group: "Боеприпасы" },
  { id: "shell-75", name: "75mm Round", ru: "Снаряд 75мм", crate: 5, bmat: 120, rmat: 0, emat: 70, hemat: 0, secPerCrate: 40, group: "Боеприпасы" },
  { id: "shell-120", name: "120mm Shell", ru: "Снаряд 120мм", crate: 3, bmat: 100, rmat: 0, emat: 40, hemat: 0, secPerCrate: 45, group: "Боеприпасы" },
  { id: "shell-150", name: "150mm Shell", ru: "Снаряд 150мм", crate: 3, bmat: 200, rmat: 0, emat: 100, hemat: 0, secPerCrate: 60, group: "Боеприпасы" },
  { id: "shell-250", name: "250mm Shell", ru: "Снаряд 250мм", crate: 1, bmat: 0, rmat: 0, emat: 120, hemat: 15, secPerCrate: 90, group: "Тяжёлое вооружение" },
  { id: "shell-300", name: "300mm Round", ru: "Снаряд 300мм", crate: 1, bmat: 0, rmat: 0, emat: 160, hemat: 25, secPerCrate: 120, group: "Тяжёлое вооружение" },
  { id: "rpg-round", name: "RPG Round", ru: "Выстрел РПГ", crate: 10, bmat: 60, rmat: 0, emat: 30, hemat: 0, secPerCrate: 35, group: "Боеприпасы" },
  { id: "at-rpg", name: "AT RPG", ru: "ПТ-выстрел РПГ", crate: 10, bmat: 60, rmat: 0, emat: 45, hemat: 0, secPerCrate: 40, group: "Боеприпасы" },
  { id: "mortar", name: "Mortar Shell", ru: "Мина миномётная", crate: 15, bmat: 70, rmat: 0, emat: 20, hemat: 0, secPerCrate: 30, group: "Боеприпасы" },
  { id: "flare", name: "Flare Shell", ru: "Осветительная мина", crate: 10, bmat: 40, rmat: 0, emat: 5, hemat: 0, secPerCrate: 20, group: "Боеприпасы" },
];

// ─────────── ВНЕШНИЕ ИНСТРУМЕНТЫ ───────────
export interface ToolLink {
  name: string;
  url: string;
  desc: string;
  tag: string;
}

export const TOOL_LINKS: ToolLink[] = [
  { name: "Foxhole Wiki", url: "https://foxhole.wiki.gg/wiki/Foxhole_Wiki", desc: "Официальная вики: предметы, карты, рецепты производства.", tag: "СПРАВКА" },
  { name: "FoxholeStats", url: "https://www.foxholestats.com", desc: "Живая статистика войны: потери, территории, населёнка фронтов.", tag: "РАЗВЕДКА" },
  { name: "Foxhole Planner", url: "https://foxholeplanner.com", desc: "Планировщик баз и расчёт содержания: бункеры, объекты, снабжение.", tag: "СТРОИТЕЛЬСТВО" },
  { name: "LogiWaze", url: "https://logiwaze.netlify.app", desc: "Маршруты доставки, рейтинги логистов и учёт поставок клана.", tag: "ЛОГИСТИКА" },
  { name: "Foxhole Game", url: "https://www.foxholegame.com", desc: "Официальный сайт: девблоги, ветви обновлений, стримы разработчиков.", tag: "ШТАБ" },
  { name: "WarHub", url: "https://warhub.app", desc: "Карта текущей войны с состоянием городских залов и ключевых объектов.", tag: "КАРТА" },
];

// ─────────── ОБУЧЕНИЕ ───────────
export interface TrainingModule {
  id: string;
  title: string;
  status: "ready" | "wip";
  summary: string;
  body?: string[];
}

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "terminal",
    title: "Работа с терминалом SINDARIS",
    status: "ready",
    summary: "Импорт склада, конструктор заказа, экспорт рапортов.",
    body: [
      "1. Раздел «Заказы» → левая панель: вставьте отчёт сканера из буфера обмена или загрузите текстовый файл.",
      "2. Правая панель: выберите предмет из матрицы (фильтр по названию, категории или коду), задайте количество и единицу (ЯЩ / ШТ), нажмите «Добавить в заказ».",
      "3. Кнопка режима переключает нижние клавиши между экспортом (TXT / CSV / буфер) и импортом внешних файлов.",
      "4. «Отправить рапорт в штаб» сохраняет заказ в архив терминала — он доступен всем интендантам смены.",
    ],
  },
  {
    id: "formats",
    title: "Форматы отчётов сканера",
    status: "ready",
    summary: "Какие строки понимает парсер терминала.",
    body: [
      "• «Название предмета, 50» — классический формат сканера.",
      "• «Название предмета -> 50 шт.» — формат экспорта терминала.",
      "• «Название предмета: 12 ящ» — формат сообщений Discord.",
      "• Маркеры «•», «*», «шт», «ящ», «ящиков» очищаются автоматически.",
      "• Пустые строки и строки без чисел пропускаются без ошибок.",
    ],
  },
  {
    id: "timers",
    title: "Таймеры деспавна складов",
    status: "ready",
    summary: "Правило 48 часов и протокол обновления.",
    body: [
      "• Публичные и приватные склады Foxhole исчезают через 48 часов без обновления.",
      "• Красный статус — менее 1 часа: срочно отправьте бойца обновить склад.",
      "• Оранжевый — менее 24 часов: планируйте обновление в ближайшую смену.",
      "• После обновления в игре нажмите «Сбросить на 48 часов» или задайте точное время из игрового интерфейса.",
      "• Все действия фиксируются в журнале склада с меткой времени.",
    ],
  },
  { id: "logistics", title: "Основы логистики Foxhole", status: "wip", summary: "Цепочки снабжения, MPF, фасилити." },
  { id: "protocol", title: "Протокол рапорта снабжения", status: "wip", summary: "Стандарт оформления заявок для штаба клана." },
  { id: "front", title: "Передовая логистика", status: "wip", summary: "Доставка под огнём, приоритеты, маршруты." },
];

// ─────────── КАРТА / ФРОНТ ───────────
export type Faction = "warden" | "colonial" | "contested";

export interface RegionControl {
  name: string;
  faction: Faction;
  x: number;
  y: number;
}

// Схематичная сетка сектора (6 колонок)
export const REGION_LAYOUT: Omit<RegionControl, "faction">[] = [
  { name: "Clanshead Valley", x: 0, y: 0 },
  { name: "The Linn of Lights", x: 1, y: 0 },
  { name: "Morgen's Crossing", x: 2, y: 0 },
  { name: "Callahan's Passage", x: 3, y: 0 },
  { name: "Marban Hollow", x: 4, y: 0 },
  { name: "Stema Landing", x: 5, y: 0 },
  { name: "Deadlands", x: 0, y: 1 },
  { name: "Umbral Wildwood", x: 1, y: 1 },
  { name: "The Moors", x: 2, y: 1 },
  { name: "Loch Mór", x: 3, y: 1 },
  { name: "Westgate", x: 4, y: 1 },
  { name: "Oarbreaker", x: 5, y: 1 },
  { name: "Drowned Vale", x: 0, y: 2 },
  { name: "Speaking Woods", x: 1, y: 2 },
  { name: "Heartlands", x: 2, y: 2 },
  { name: "Farranac Coast", x: 3, y: 2 },
  { name: "Origin", x: 4, y: 2 },
  { name: "Great March", x: 5, y: 2 },
  { name: "Weathered Expanse", x: 0, y: 3 },
  { name: "Endless Shore", x: 1, y: 3 },
  { name: "Reaching Trail", x: 2, y: 3 },
  { name: "Terminus", x: 3, y: 3 },
  { name: "Howl County", x: 4, y: 3 },
  { name: "Viper Pit", x: 5, y: 3 },
];

export const INITIAL_REGION_STATE: Record<string, Faction> = {
  "Clanshead Valley": "warden",
  "The Linn of Lights": "contested",
  "Morgen's Crossing": "warden",
  "Callahan's Passage": "warden",
  "Marban Hollow": "contested",
  "Stema Landing": "colonial",
  Deadlands: "contested",
  "Umbral Wildwood": "warden",
  "The Moors": "warden",
  "Loch Mór": "contested",
  Westgate: "colonial",
  Oarbreaker: "colonial",
  "Drowned Vale": "colonial",
  "Speaking Woods": "contested",
  Heartlands: "warden",
  "Farranac Coast": "contested",
  Origin: "warden",
  "Great March": "colonial",
  "Weathered Expanse": "colonial",
  "Endless Shore": "colonial",
  "Reaching Trail": "warden",
  Terminus: "contested",
  "Howl County": "colonial",
  "Viper Pit": "colonial",
};

export const RANKS = [
  "Ополченец",
  "Логиста",
  "Интендант",
  "Старший интендант",
  "Офицер штаба",
  "Командир сектора",
] as const;
