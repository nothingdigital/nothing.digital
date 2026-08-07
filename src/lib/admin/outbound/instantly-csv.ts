export type InstantlyExportLead = {
  email: string | null;
  name: string;
  website: string | null;
  phone: string | null;
  city: string;
  score: number;
  reasons: string[];
  status: string;
  personalization?: string | null;
};

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function cell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return escapeCsv(String(value));
}

const LEGACY_HEADER = "email,companyName,website,phone,city,score,reasons";
const PERSONALIZATION_HEADER = `${LEGACY_HEADER},personalization`;

/** Instantly-friendly subset — mirrors scripts/lead-finder/csv.ts */
export function buildInstantlyCsv(
  leads: InstantlyExportLead[],
  requirePersonalization = false,
): string {
  const lines = [
    requirePersonalization ? PERSONALIZATION_HEADER : LEGACY_HEADER,
  ];
  for (const lead of leads) {
    if (lead.status !== "approved" || !lead.email) continue;
    if (requirePersonalization && !lead.personalization?.trim()) {
      continue;
    }
    const cells = [
      cell(lead.email),
      cell(lead.name),
      cell(lead.website),
      cell(lead.phone),
      cell(lead.city),
      cell(lead.score),
      cell(lead.reasons.join("|")),
    ];
    if (requirePersonalization) {
      cells.push(cell(lead.personalization));
    }
    lines.push(cells.join(","));
  }
  return `${lines.join("\n")}\n`;
}

export function countApprovedReady(leads: InstantlyExportLead[]): number {
  return leads.filter(
    (lead) => lead.status === "approved" && Boolean(lead.email),
  ).length;
}

export function countMissingPersonalization(
  leads: InstantlyExportLead[],
): number {
  return leads.filter(
    (lead) =>
      lead.status === "approved" &&
      Boolean(lead.email) &&
      !lead.personalization?.trim(),
  ).length;
}
