import type { ScoredLead } from "./types";

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function cell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  return escapeCsv(String(value));
}

const CITY = "Northport, AL";

export function leadsToCsv(leads: ScoredLead[]): string {
  const lines = [
    "email,companyName,website,phone,address,city,vertical,query,placeId,score,reasons,emailSource,rating,reviewCount,suppressed,aiScore,aiReason,personalization",
  ];
  for (const l of leads) {
    lines.push(
      [
        cell(l.email),
        cell(l.name),
        cell(l.website),
        cell(l.phone),
        cell(l.address),
        cell(CITY),
        cell(l.vertical),
        cell(l.query),
        cell(l.placeId),
        cell(l.score),
        cell(l.reasons.join("|")),
        cell(l.emailSource),
        cell(l.rating),
        cell(l.reviewCount),
        cell(l.suppressed),
        cell(l.aiScore ?? ""),
        cell(l.aiReason ?? ""),
        cell(l.personalization ?? ""),
      ].join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

/** Instantly-friendly subset: only non-suppressed rows with email. */
export function leadsToInstantlyCsv(leads: ScoredLead[]): string {
  const withPerso = leads.some(
    (l) => l.email && !l.suppressed && l.personalization?.trim(),
  );
  const header = withPerso
    ? "email,companyName,website,phone,city,score,reasons,personalization"
    : "email,companyName,website,phone,city,score,reasons";

  const lines = [header];
  for (const l of leads) {
    if (!l.email || l.suppressed) continue;
    const score = l.aiScore ?? l.score;
    const cells = [
      cell(l.email),
      cell(l.name),
      cell(l.website),
      cell(l.phone),
      cell(CITY),
      cell(score),
      cell(l.reasons.join("|")),
    ];
    if (withPerso) cells.push(cell(l.personalization ?? ""));
    lines.push(cells.join(","));
  }
  return `${lines.join("\n")}\n`;
}
