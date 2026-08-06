import { getServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database";
import type { InboxStatus } from "./config";

type ContactSubmission =
  Database["public"]["Tables"]["contact_submissions"]["Row"];

// ponytail: service role after requireAdmin() — skip admin RLS until Supabase live.

export async function listContactSubmissions(
  status?: InboxStatus,
): Promise<{ rows: ContactSubmission[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { rows: [], error: "Supabase is not configured." };
  }

  let query = supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return { rows: [], error: error.message };
  }

  return { rows: data ?? [], error: null };
}

export async function updateContactStatus(
  id: string,
  status: InboxStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function listNewsletterSubscribers(): Promise<{
  rows: Database["public"]["Tables"]["newsletter_subscribers"]["Row"][];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { rows: [], error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) {
    return { rows: [], error: error.message };
  }

  return { rows: data ?? [], error: null };
}
