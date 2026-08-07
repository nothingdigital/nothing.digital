export type ParsedLeadRow = {
  placeId: string;
  name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string;
  vertical: string | null;
  query: string | null;
  score: number;
  reasons: string[];
  email: string | null;
  emailSource: "hunter" | "mailto" | "none";
  rating: number | null;
  reviewCount: number | null;
  suppressed: boolean;
};

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      cells.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  cells.push(current);
  return cells;
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseEmailSource(value: string | null): "hunter" | "mailto" | "none" {
  if (value === "hunter" || value === "mailto") return value;
  return "none";
}

export function parseLeadFinderCsv(csv: string): {
  rows: ParsedLeadRow[];
  error: string | null;
} {
  const lines = csv
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { rows: [], error: "CSV is empty." };
  }

  const header = splitCsvLine(lines[0] ?? "").map((h) => h.trim());
  const required = ["companyName", "placeId", "score"];
  for (const key of required) {
    if (!header.includes(key)) {
      return {
        rows: [],
        error: `Missing required column: ${key}`,
      };
    }
  }

  const index = (name: string) => header.indexOf(name);
  const rows: ParsedLeadRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cells = splitCsvLine(lines[i] ?? "");
    const get = (name: string) => {
      const idx = index(name);
      if (idx < 0) return null;
      return emptyToNull(cells[idx] ?? "");
    };

    const placeId = get("placeId");
    const name = get("companyName");
    if (!placeId || !name) continue;

    const score = parseNumber(get("score")) ?? 0;
    const reasonsRaw = get("reasons");
    const email = get("email");
    const suppressedRaw = (get("suppressed") ?? "false").toLowerCase();

    rows.push({
      placeId,
      name,
      website: get("website"),
      phone: get("phone"),
      address: get("address"),
      city: get("city") ?? "Northport, AL",
      vertical: get("vertical"),
      query: get("query"),
      score,
      reasons: reasonsRaw ? reasonsRaw.split("|").filter(Boolean) : [],
      email,
      emailSource: parseEmailSource(get("emailSource")),
      rating: parseNumber(get("rating")),
      reviewCount: parseNumber(get("reviewCount")),
      suppressed: suppressedRaw === "true" || suppressedRaw === "1",
    });
  }

  return { rows, error: null };
}

export function leadStatusForImport(row: ParsedLeadRow): string {
  if (row.suppressed) return "suppressed";
  if (row.email) return "ready";
  return "needs_email";
}
