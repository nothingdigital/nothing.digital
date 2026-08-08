import { getServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database";

import { leadStatusForImport, type ParsedLeadRow } from "./parse-csv";

export type LeadCandidateRow =
  Database["public"]["Tables"]["lead_candidates"]["Row"];

export type LeadCandidateStatus =
  "needs_email" | "ready" | "approved" | "rejected" | "suppressed";

export async function listLeadCandidates(filters?: {
  status?: LeadCandidateStatus;
  withGeo?: boolean;
}): Promise<{ rows: LeadCandidateRow[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { rows: [], error: "Supabase is not configured." };
  }

  let query = supabase
    .from("lead_candidates")
    .select("*")
    .order("score", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.withGeo) {
    query = query.not("lat", "is", null).not("lng", "is", null);
  }

  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function findLeadByPlaceId(
  placeId: string,
): Promise<{ row: LeadCandidateRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("lead_candidates")
    .select("*")
    .eq("place_id", placeId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export type MapLeadInput = {
  placeId: string;
  name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string;
  vertical: string | null;
  query: string | null;
  email?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  lat: number;
  lng: number;
};

export async function insertLeadFromMap(
  input: MapLeadInput,
): Promise<{ row: LeadCandidateRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const email = input.email?.trim() || null;
  const runId = crypto.randomUUID();
  const { data, error } = await supabase
    .from("lead_candidates")
    .insert({
      run_id: runId,
      place_id: input.placeId,
      name: input.name,
      website: input.website,
      phone: input.phone,
      address: input.address,
      city: input.city,
      vertical: input.vertical,
      query: input.query,
      score: 50,
      reasons: ["map-pin"],
      email,
      email_source: "none",
      rating: input.rating ?? null,
      review_count: input.reviewCount ?? null,
      status: email ? "ready" : "needs_email",
      lat: input.lat,
      lng: input.lng,
    })
    .select("*")
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
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
    personalization: row.personalization,
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

export async function getLeadCandidate(
  id: string,
): Promise<{ row: LeadCandidateRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("lead_candidates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export async function updateLeadCandidate(input: {
  id: string;
  status?: LeadCandidateStatus;
  email?: string | null;
  personalization?: string | null;
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
  if (input.personalization !== undefined) {
    patch.personalization = input.personalization;
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
  if (!supabase) {
    return { rows: [], error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("do_not_contact")
    .select("*")
    .order("added_at", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}
