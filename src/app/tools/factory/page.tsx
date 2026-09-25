import { redirect } from "next/navigation";

/**
 * Калькулятор фабрики теперь открывается вкладкой в разделе «Инструменты».
 * Старый адрес /tools/factory сохранён для закладок: он перенаправляет на /tools?tool=factory.
 */
export default function FactoryPage() {
  redirect("/tools?tool=factory");
}
