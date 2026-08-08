import { getServiceRoleClient } from "@/lib/supabase/server";

import type { LoopActionKind, LoopEvent } from "./types";

export async function listLoopEvents(): Promise<{
  rows: LoopEvent[];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { rows: [], error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("admin_loop_events")
    .select("loop_key, action, note, snoozed_until, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as LoopEvent[], error: null };
}

export async function insertLoopEvent(input: {
  loop_key: string;
  action: LoopActionKind;
  note?: string | null;
  snoozed_until?: string | null;
}): Promise<{ error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase.from("admin_loop_events").insert({
    loop_key: input.loop_key,
    action: input.action,
    note: input.note ?? null,
    snoozed_until: input.snoozed_until ?? null,
  });

  return { error: error?.message ?? null };
}

export async function listCheckedChecklistKeys(
  checklistKey: string,
): Promise<{ keys: string[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { keys: [], error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("ops_checklist_items")
    .select("item_key")
    .eq("checklist_key", checklistKey);

  if (error) return { keys: [], error: error.message };
  return { keys: (data ?? []).map((row) => row.item_key), error: null };
}

export async function setChecklistItem(input: {
  checklist_key: string;
  item_key: string;
  checked: boolean;
}): Promise<{ error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return { error: "Supabase is not configured." };

  if (input.checked) {
    const { error } = await supabase.from("ops_checklist_items").upsert(
      {
        checklist_key: input.checklist_key,
        item_key: input.item_key,
        checked_at: new Date().toISOString(),
      },
      { onConflict: "checklist_key,item_key" },
    );
    return { error: error?.message ?? null };
  }

  const { error } = await supabase
    .from("ops_checklist_items")
    .delete()
    .eq("checklist_key", input.checklist_key)
    .eq("item_key", input.item_key);

  return { error: error?.message ?? null };
}
