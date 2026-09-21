import { downloadText } from "./format";
import type { OrderLine } from "./state";

// ─────────── ТЕКСТОВЫЙ РАПОРТ ───────────
export function reportLines(order: OrderLine[], author: string): string[] {
  const stamp = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const total = order.reduce((a, l) => a + l.qty, 0);
  return [
    "=== РАПОРТ СНАБЖЕНИЯ // SINDARIS ===",
    `Автор: ${author}`,
    `Время: ${p(stamp.getDate())}.${p(stamp.getMonth() + 1)}.${stamp.getFullYear()} ${p(stamp.getHours())}:${p(stamp.getMinutes())}`,
    "",
    ...order.map((l) => `${l.name} -> ${l.qty} ${l.unit.toLowerCase()}.`),
    "",
    `ИТОГО: ${order.length} поз. / ${total} ед.`,
  ];
}

// ─────────── XLS (SpreadsheetML 2003) ───────────
export function exportReportXls(order: OrderLine[], author: string): void {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cell = (v: string | number, type: "String" | "Number" = "String") =>
    `<Cell><Data ss:Type="${type}">${typeof v === "number" ? v : esc(v)}</Data></Cell>`;
  const total = order.reduce((a, l) => a + l.qty, 0);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Рапорт"><Table>
<Row>${cell("Предмет")}${cell("Код")}${cell("Кол-во")}${cell("Ед.")}</Row>
${order.map((l) => `<Row>${cell(l.name)}${cell(l.code ?? "—")}${cell(l.qty, "Number")}${cell(l.unit)}</Row>`).join("\n")}
<Row></Row>
<Row>${cell("ИТОГО")}${cell("")}${cell(total, "Number")}${cell("")}</Row>
<Row>${cell(`Автор: ${author}`)}</Row>
</Table></Worksheet></Workbook>`;
  downloadText(`raport_xls_${Date.now()}.xls`, xml, "application/vnd.ms-excel;charset=utf-8");
}

// ─────────── PNG-СТРАНИЦА РАПОРТА ───────────
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function exportReportPng(order: OrderLine[], author: string): Promise<number> {
  const W = 1240;
  const H = 1754;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  if (!g) return 0;

  // Бумага рапорта (тёмная штабная форма)
  g.fillStyle = "#0d110d";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#10160f";
  g.fillRect(48, 48, W - 96, H - 96);
  g.strokeStyle = "#2a3a2a";
  g.lineWidth = 3;
  g.strokeRect(48, 48, W - 96, H - 96);
  g.strokeStyle = "#a3e635";
  g.lineWidth = 2;
  g.strokeRect(60, 60, W - 120, H - 120);

  // Фоновая сетка
  g.strokeStyle = "rgba(163,230,53,0.05)";
  g.lineWidth = 1;
  for (let x = 60; x < W - 60; x += 62) {
    g.beginPath();
    g.moveTo(x, 60);
    g.lineTo(x, H - 60);
    g.stroke();
  }

  const stamp = new Date();
  const p = (n: number) => String(n).padStart(2, "0");

  // Эмблема
  const logo = await loadImage("/images/clan-logo.jpg");
  if (logo) {
    g.save();
    g.drawImage(logo, 96, 96, 132, 132);
    g.restore();
  }

  g.fillStyle = "#a3e635";
  g.font = "700 30px 'JetBrains Mono', monospace";
  g.fillText("SINDARIS // ШТАБ ЛОГИСТИКИ", logo ? 252 : 96, 130);
  g.fillStyle = "#ffffff";
  g.font = "700 52px 'Russo One', sans-serif";
  g.fillText("РАПОРТ СНАБЖЕНИЯ", logo ? 250 : 94, 196);

  g.fillStyle = "#9aa89b";
  g.font = "400 24px 'JetBrains Mono', monospace";
  g.fillText(`АВТОР: ${author}`, 96, 288);
  g.fillText(
    `ВРЕМЯ: ${p(stamp.getDate())}.${p(stamp.getMonth() + 1)}.${stamp.getFullYear()}  ${p(stamp.getHours())}:${p(stamp.getMinutes())}`,
    96,
    326,
  );
  g.fillText(`КАНАЛ-07 · SANDALIS-PRIME`, 96, 364);

  // Шапка таблицы
  const top = 420;
  g.fillStyle = "#a3e635";
  g.fillRect(96, top, W - 192, 42);
  g.fillStyle = "#0d110d";
  g.font = "700 22px 'JetBrains Mono', monospace";
  g.fillText("№", 116, top + 29);
  g.fillText("ПРЕДМЕТ", 220, top + 29);
  g.fillText("КОЛ-ВО", W - 400, top + 29);
  g.fillText("ЕД.", W - 220, top + 29);

  const MAX_ROWS = 26;
  const shown = order.slice(0, MAX_ROWS);
  let y = top + 42;
  shown.forEach((l, i) => {
    y += 46;
    g.fillStyle = i % 2 ? "rgba(163,230,53,0.035)" : "transparent";
    g.fillRect(96, y - 32, W - 192, 46);
    g.fillStyle = "#6b7a6b";
    g.font = "700 20px 'JetBrains Mono', monospace";
    g.fillText(String(i + 1).padStart(2, "0"), 116, y);
    g.fillStyle = "#f3f4f1";
    g.font = "600 22px 'JetBrains Mono', monospace";
    const name = l.name.length > 38 ? l.name.slice(0, 37) + "…" : l.name;
    g.fillText(name, 220, y);
    g.fillStyle = "#a3e635";
    g.font = "700 22px 'JetBrains Mono', monospace";
    g.fillText(String(l.qty), W - 400, y);
    g.fillStyle = "#9aa89b";
    g.fillText(l.unit.toLowerCase() + ".", W - 220, y);
  });

  const total = order.reduce((a, l) => a + l.qty, 0);
  y += 62;
  if (order.length > MAX_ROWS) {
    g.fillStyle = "#fbbf24";
    g.font = "700 22px 'JetBrains Mono', monospace";
    g.fillText(`… И ЕЩЁ ${order.length - MAX_ROWS} ПОЗИЦИЙ (СМ. TXT/XLS ВЫГРУЗКУ)`, 116, y);
    y += 46;
  }
  g.fillStyle = "#0d110d";
  g.fillRect(96, y - 36, W - 192, 4);
  g.fillStyle = "#ffffff";
  g.font = "700 30px 'Russo One', sans-serif";
  g.fillText(`ИТОГО: ${order.length} ПОЗ. / ${total} ЕД.`, 116, y + 32);

  // Печать
  g.save();
  g.translate(W - 320, H - 320);
  g.rotate(-0.16);
  g.strokeStyle = "rgba(163,230,53,0.7)";
  g.lineWidth = 4;
  g.strokeRect(-10, -60, 260, 110);
  g.fillStyle = "rgba(163,230,53,0.7)";
  g.font = "700 22px 'JetBrains Mono', monospace";
  g.fillText("УТВЕРЖДЕНО", 14, -18);
  g.font = "600 18px 'JetBrains Mono', monospace";
  g.fillText("ШТАБ САНДАЛИС", 14, 12);
  g.restore();

  g.fillStyle = "#4a5a4a";
  g.font = "400 18px 'JetBrains Mono', monospace";
  g.fillText("СФОРМИРОВАНО ТЕРМИНАЛОМ SINDARIS · КОПИЯ ВЕРНА", 96, H - 96);

  return new Promise((resolve) => {
    canvas.toBlob((b) => {
      if (b) downloadBlob(`raport_${Date.now()}.png`, b);
      resolve(b ? shown.length : 0);
    }, "image/png");
  });
}
