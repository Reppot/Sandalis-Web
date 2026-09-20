import { parseMapData } from "@/lib/mapdata";
import type { ScanResponse } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 64 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Файл сохранения не передан" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: "Файл слишком большой (лимит 64 МБ)" }, { status: 413 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const result = parseMapData(buf);
    const payload: ScanResponse = {
      items: result.items,
      matchedCodes: result.matchedCodes,
      fileName: file.name,
      fileSize: file.size,
      strict: result.strict,
    };
    return Response.json(payload);
  } catch (error) {
    console.error("POST /api/scan", error);
    return Response.json({ error: "Сбой парсинга бинарного сохранения" }, { status: 500 });
  }
}
