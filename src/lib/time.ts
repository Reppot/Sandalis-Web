const pad = (n: number) => String(n).padStart(2, "0");

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fileStamp(date: Date = new Date()): string {
  return `${pad(date.getHours())}-${pad(date.getMinutes())}_${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}
