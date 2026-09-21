import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Инициализация темы до первого кадра (как theme-init в оригинале)
try {
  const t = localStorage.getItem("sindaris-theme");
  document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");
} catch {
  document.documentElement.setAttribute("data-theme", "dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
