"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin/auth";
import { isBlockedByDnc } from "@/lib/admin/outbound/map-lead";
import { parseLeadFinderCsv } from "@/lib/admin/outbound/parse-csv";
import {
  addDoNotContact,
  findLeadByPlaceId,
  importLeadCandidates,
  insertLeadFromMap,
  listDoNotContact,
  updateLeadCandidate,
  type LeadCandidateStatus,
} from "@/lib/admin/outbound/queries";
import { MAP_HOME } from "@/lib/leads/places";
import { outboundPersonalizationSchema } from "@/lib/ai/types";

const mapLeadSchema = z.object({
  placeId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  website: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  vertical: z.string().nullable(),
  query: z.string().nullable(),
  rating: z.number().nullable().optional(),
  reviewCount: z.number().nullable().optional(),
  lat: z.number(),
  lng: z.number(),
  email: z.string().nullable().optional(),
});

const STATUSES: LeadCandidateStatus[] = [
  "needs_email",
  "ready",
  "approved",
  "rejected",
  "suppressed",
];

function isStatus(value: string): value is LeadCandidateStatus {
  return (STATUSES as readonly string[]).includes(value);
}

export async function importLeadsCsvAction(
  formData: FormData,
): Promise<{ ok: true; imported: number } | { ok: false; error: string }> {
  await requireAdmin();

  const file = formData.get("csv");
  if (!(file instanceof File)) {
    return { ok: false, error: "Choose a CSV file." };
  }

  const text = await file.text();
  const parsed = parseLeadFinderCsv(text);
  if (parsed.error) {
    return { ok: false, error: parsed.error };
  }
  if (parsed.rows.length === 0) {
    return { ok: false, error: "No lead rows found in CSV." };
  }

  const result = await importLeadCandidates(parsed.rows);
  if (result.error) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/outbound");
  revalidatePath("/admin");
  return { ok: true, imported: result.imported };
}

export async function setLeadStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();
  if (!id || !isStatus(statusRaw)) {
    throw new Error("Invalid lead status update.");
  }

  if (statusRaw === "suppressed") {
    const email = String(formData.get("email") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();
    const value = email || website.replace(/^https?:\/\//, "").split("/")[0];
    if (value) {
      const suppress = await addDoNotContact({
        email_or_domain: value,
        reason: "admin-suppress",
      });
      if (suppress.error) throw new Error(suppress.error);
    }
  }

  const { error } = await updateLeadCandidate({ id, status: statusRaw });
  if (error) throw new Error(error);

  revalidatePath("/admin/outbound");
  revalidatePath("/admin");
}

export async function updateLeadEmailAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const emailRaw = String(formData.get("email") ?? "").trim();
  if (!id) throw new Error("Lead id required.");

  const email = emailRaw === "" ? null : emailRaw;
  const { error } = await updateLeadCandidate({
    id,
    email,
    status: email ? "ready" : "needs_email",
  });
  if (error) throw new Error(error);

  revalidatePath("/admin/outbound");
}

export async function saveOutboundPersonalizationAction(
  leadId: string,
  line: string,
) {
  await requireAdmin();

  const parsed = outboundPersonalizationSchema.safeParse({ line });
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid personalization line." };
  }

  const { error } = await updateLeadCandidate({
    id: leadId,
    personalization: parsed.data.line,
  });
  if (error) return { ok: false as const, error };

  revalidatePath("/admin/outbound");
  return { ok: true as const };
}

export async function addLeadFromMapAction(
  input: z.infer<typeof mapLeadSchema>,
): Promise<
  | { ok: true; id: string; alreadyInQueue?: boolean }
  | { ok: false; error: string }
> {
  await requireAdmin();

  const parsed = mapLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid map lead." };
  }

  const existing = await findLeadByPlaceId(parsed.data.placeId);
  if (existing.error) return { ok: false, error: existing.error };
  if (existing.row) {
    return { ok: true, id: existing.row.id, alreadyInQueue: true };
  }

  const dnc = await listDoNotContact();
  if (dnc.error) return { ok: false, error: dnc.error };
  const blocklist = new Set(
    dnc.rows.map((row) => row.email_or_domain.toLowerCase()),
  );
  if (
    isBlockedByDnc(blocklist, parsed.data.email, parsed.data.website ?? null)
  ) {
    return { ok: false, error: "On do-not-contact list." };
  }

  const result = await insertLeadFromMap({
    placeId: parsed.data.placeId,
    name: parsed.data.name,
    website: parsed.data.website,
    phone: parsed.data.phone,
    address: parsed.data.address,
    city: MAP_HOME.city,
    vertical: parsed.data.vertical,
    query: parsed.data.query,
    rating: parsed.data.rating ?? null,
    reviewCount: parsed.data.reviewCount ?? null,
    email: parsed.data.email ?? null,
    lat: parsed.data.lat,
    lng: parsed.data.lng,
  });

  if (result.error || !result.row) {
    return { ok: false, error: result.error ?? "Insert failed." };
  }

  revalidatePath("/admin/outbound");
  revalidatePath("/admin/outbound/map");
  revalidatePath("/admin");
  return { ok: true, id: result.row.id };
}
