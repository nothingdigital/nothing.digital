import { escapeCsvField } from "@/lib/admin/newsletter-csv";

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

function cell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return escapeCsvField(String(value));
}

const HEADER =
  "email,companyName,website,phone,city,score,reasons,personalization";

/** Instantly-friendly subset — mirrors scripts/lead-finder/csv.ts */
export function buildInstantlyCsv(leads: InstantlyExportLead[]): string {
  const lines = [HEADER];
  for (const lead of leads) {
    if (lead.status !== "approved" || !lead.email) continue;
    lines.push(
      [
        cell(lead.email),
        cell(lead.name),
        cell(lead.website),
        cell(lead.phone),
        cell(lead.city),
        cell(lead.score),
        cell(lead.reasons.join("|")),
        cell(lead.personalization),
      ].join(","),
    );
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
    (lead) => lead.status === "approved" && !lead.personalization,
  ).length;
}
