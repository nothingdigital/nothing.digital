import mammoth from "mammoth";
import * as XLSX from "xlsx";

export async function extractDocx(
  bytes: Buffer | Uint8Array,
): Promise<{ ok: boolean; markdown: string; error?: string }> {
  try {
    const buffer = bytes instanceof Buffer ? bytes : Buffer.from(bytes);
    // @ts-expect-error mammoth.convertToMarkdown exists in this version
    const result = await mammoth.convertToMarkdown({ buffer });
    const markdown = result.value.trim();
    if (!markdown) {
      return {
        ok: false,
        markdown: "",
        error: "Word extract produced empty content.",
      };
    }
    return { ok: true, markdown };
  } catch (err) {
    return {
      ok: false,
      markdown: "",
      error: err instanceof Error ? err.message : "DOCX extract failed.",
    };
  }
}

function sheetToMarkdown(name: string, sheet: XLSX.WorkSheet): string {
  const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(
    sheet,
    { header: 1, defval: "" },
  );
  if (rows.length === 0) return `## ${name}\n\n_(empty sheet)_`;

  const width = Math.max(...rows.map((r) => r.length), 1);
  const pad = (row: (string | number | boolean | null)[]) =>
    Array.from({ length: width }, (_, i) => String(row[i] ?? "").trim());

  const header = pad(rows[0] ?? []);
  const body = rows.slice(1).map(pad);
  const sep = header.map(() => "---");

  const lines = [
    `## ${name}`,
    "",
    `| ${header.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
    ...body.map((r) => `| ${r.join(" | ")} |`),
  ];
  return lines.join("\n");
}

export async function extractXlsx(
  bytes: Buffer | Uint8Array,
): Promise<{ ok: boolean; markdown: string; error?: string }> {
  try {
    const buffer = bytes instanceof Buffer ? bytes : Buffer.from(bytes);
    const wb = XLSX.read(buffer, { type: "buffer" });
    const parts = wb.SheetNames.map((name) =>
      sheetToMarkdown(name, wb.Sheets[name]!),
    );
    const markdown = parts.join("\n\n").trim();
    if (!markdown) {
      return {
        ok: false,
        markdown: "",
        error: "Excel extract produced empty content.",
      };
    }
    return { ok: true, markdown };
  } catch (err) {
    return {
      ok: false,
      markdown: "",
      error: err instanceof Error ? err.message : "XLSX extract failed.",
    };
  }
}

export async function extractByFilename(
  filename: string,
  bytes: Buffer | Uint8Array,
): Promise<{ ok: boolean; markdown: string; error?: string }> {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".docx")) return extractDocx(bytes);
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    return extractXlsx(bytes);
  }
  if (lower.endsWith(".numbers")) {
    return {
      ok: false,
      markdown: "",
      error:
        "Apple Numbers is not supported for extract. Export to XLSX and re-import, or paste content manually. Original file is kept as an attachment.",
    };
  }
  return {
    ok: false,
    markdown: "",
    error: `No extractor for ${filename}. Original file stored as attachment.`,
  };
}
