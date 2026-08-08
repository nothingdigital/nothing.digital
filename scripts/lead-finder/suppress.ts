import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Load email_or_domain,reason CSV (header optional). */
export function loadSuppressionList(filePath: string): Set<string> {
  const absolute = resolve(filePath);
  if (!existsSync(absolute)) return new Set();

  const values = new Set<string>();
  for (const line of readFileSync(absolute, "utf8").split(/\r?\n/)) {
    const [raw] = line.split(",");
    if (!raw) continue;
    const value = normalize(raw);
    if (!value || value === "email_or_domain") continue;
    values.add(value);
  }
  return values;
}

export function isSuppressed(
  email: string | null,
  website: string | null,
  blocklist: Set<string>,
): boolean {
  if (email) {
    const normalized = normalize(email);
    if (blocklist.has(normalized)) return true;
    const domain = normalized.split("@")[1];
    if (domain && blocklist.has(domain)) return true;
  }

  if (website) {
    try {
      const url = new URL(
        website.startsWith("http") ? website : `https://${website}`,
      );
      const host = url.hostname.toLowerCase().replace(/^www\./, "");
      if (blocklist.has(host)) return true;
    } catch {
      /* ignore bad URLs */
    }
  }

  return false;
}
