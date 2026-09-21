import { useEffect } from "react";
import { Backdrop } from "./components/Backdrop";
import { Login } from "./components/Login";
import { TerminalShell } from "./components/Shell";
import { LOGIN_BG, NAV_ITEMS, type SectionId } from "./lib/data";
import { TerminalProvider, useTerminal } from "./lib/state";

const PAGE_TITLES: Record<SectionId, string> = {
  orders: "Заказы",
  timers: "Таймеры",
  codes: "База кодов",
  map: "Карта сектора",
  tools: "Инструменты",
  training: "Обучение",
  cabinet: "Личный кабинет",
};
import { CabinetView } from "./views/Cabinet";
import { CodesView } from "./views/Codes";
import { MapView } from "./views/MapView";
import { OrdersView } from "./views/Orders";
import { TimersView } from "./views/Timers";
import { ToolsView } from "./views/Tools";
import { TrainingView } from "./views/Training";

function Workspace() {
  const { session, page } = useTerminal();

  useEffect(() => {
    document.title = session ? `${PAGE_TITLES[page]} — SINDARIS Терминал` : "Вход — SINDARIS Терминал";
  }, [session, page]);

  if (!session) {
    return (
      <>
        <Backdrop src={LOGIN_BG} />
        <Login />
      </>
    );
  }

  const current = NAV_ITEMS.find((n) => n.id === page) ?? NAV_ITEMS[0];

  return (
    <>
      <Backdrop src={current.bg} />
      <TerminalShell>
        {page === "orders" && <OrdersView />}
        {page === "timers" && <TimersView />}
        {page === "codes" && <CodesView />}
        {page === "map" && <MapView />}
        {page === "tools" && <ToolsView />}
        {page === "training" && <TrainingView />}
        {page === "cabinet" && <CabinetView />}
      </TerminalShell>
    </>
  );
}

export default function App() {
  return (
    <TerminalProvider>
      <Workspace />
    </TerminalProvider>
  );
}
