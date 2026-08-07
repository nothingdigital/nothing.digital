import { getServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database";

import { leadStatusForImport, type ParsedLeadRow } from "./parse-csv";

export type LeadCandidateRow =
  Database["public"]["Tables"]["lead_candidates"]["Row"];

export type LeadCandidateStatus =
  "needs_email" | "ready" | "approved" | "rejected" | "suppressed";

function notConfigured<T>(): { rows: T[]; error: string } {
  return { rows: [], error: "Supabase is not configured." };
}

export async function listLeadCandidates(filters?: {
  status?: LeadCandidateStatus;
}): Promise<{ rows: LeadCandidateRow[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured();

  let query = supabase
    .from("lead_candidates")
    .select("*")
    .order("score", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function countLeadsByStatus(
  status: LeadCandidateStatus,
): Promise<{ count: number; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return { count: 0, error: "Supabase is not configured." };

  const { count, error } = await supabase
    .from("lead_candidates")
    .select("*", { count: "exact", head: true })
    .eq("status", status);

  if (error) return { count: 0, error: error.message };
  return { count: count ?? 0, error: null };
}

export async function importLeadCandidates(
  rows: ParsedLeadRow[],
): Promise<{ runId: string | null; imported: number; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return {
      runId: null,
      imported: 0,
      error: "Supabase is not configured.",
    };
  }

  const runId = crypto.randomUUID();
  const payload = rows.map((row) => ({
    run_id: runId,
    place_id: row.placeId,
    name: row.name,
    website: row.website,
    phone: row.phone,
    address: row.address,
    city: row.city,
    vertical: row.vertical,
    query: row.query,
    score: row.score,
    reasons: row.reasons,
    email: row.email,
    email_source: row.emailSource,
    rating: row.rating,
    review_count: row.reviewCount,
    status: leadStatusForImport(row),
  }));

  if (payload.length === 0) {
    return { runId, imported: 0, error: null };
  }

  const { error } = await supabase.from("lead_candidates").insert(payload);
  if (error) {
    return { runId: null, imported: 0, error: error.message };
  }

  return { runId, imported: payload.length, error: null };
}

export async function updateLeadCandidate(input: {
  id: string;
  status?: LeadCandidateStatus;
  email?: string | null;
}): Promise<{ error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const patch: Database["public"]["Tables"]["lead_candidates"]["Update"] = {
    updated_at: new Date().toISOString(),
  };
  if (input.status !== undefined) patch.status = input.status;
  if (input.email !== undefined) {
    patch.email = input.email;
    if (input.email && input.status === undefined) {
      patch.status = "ready";
    }
  }

  const { error } = await supabase
    .from("lead_candidates")
    .update(patch)
    .eq("id", input.id);

  return { error: error?.message ?? null };
}

export async function addDoNotContact(input: {
  email_or_domain: string;
  reason?: string | null;
}): Promise<{ error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const value = input.email_or_domain.trim().toLowerCase();
  if (!value) return { error: "Value required." };

  const { error } = await supabase.from("do_not_contact").upsert(
    {
      email_or_domain: value,
      reason: input.reason ?? "suppressed",
      added_at: new Date().toISOString(),
    },
    { onConflict: "email_or_domain" },
  );

  return { error: error?.message ?? null };
}

export async function listDoNotContact(): Promise<{
  rows: Database["public"]["Tables"]["do_not_contact"]["Row"][];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured();

  const { data, error } = await supabase
    .from("do_not_contact")
    .select("*")
    .order("added_at", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}
