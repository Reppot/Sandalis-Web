import { ITEM_CODES } from "./itemCodes";
import type { StorageItem } from "./types";

const MARKER = Buffer.from("Int16Property", "utf8");
const LOOKAHEAD = 60;
const VALUE_OFFSET = 9;

export interface MapDataResult {
  items: StorageItem[];
  matchedCodes: number;
  strict: boolean;
}

/**
 * Побайтовый парсер MapData.sav (Unreal Engine save).
 * Для каждого кода предмета ищем вхождение, затем маркер "Int16Property"
 * в блоке 60 байт после имени — значение (Int16 LE) лежит через 9 байт после маркера.
 * Сначала строгий проход (код завершается NUL-байтом), при пустом результате — мягкий.
 */
function scan(buf: Buffer, strict: boolean): Map<string, number> {
  const parsed = new Map<string, number>();
  for (const [code, item] of Object.entries(ITEM_CODES)) {
    const name = item.name_ru;
    const needle = Buffer.from(code, "utf8");
    let pos = buf.indexOf(needle, 0);
    while (pos !== -1) {
      const after = buf[pos + needle.length];
      const okBoundary = !strict || after === 0x00 || after === undefined;
      if (okBoundary) {
        const block = buf.subarray(pos, Math.min(pos + LOOKAHEAD, buf.length));
        const markerPos = block.indexOf(MARKER);
        if (markerPos !== -1) {
          const valPos = pos + markerPos + MARKER.length + VALUE_OFFSET;
          if (valPos + 2 <= buf.length) {
            const value = buf.readInt16LE(valPos);
            if (value > 0 && value < 32000) {
              parsed.set(name, Math.max(parsed.get(name) ?? 0, value));
            }
          }
        }
      }
      pos = buf.indexOf(needle, pos + needle.length);
    }
  }
  return parsed;
}

export function parseMapData(buf: Buffer): MapDataResult {
  let strict = true;
  let parsed = scan(buf, true);
  if (parsed.size === 0) {
    strict = false;
    parsed = scan(buf, false);
  }
  const items = [...parsed.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
  return { items, matchedCodes: parsed.size, strict };
}
