import { randomBytes } from "node:crypto";

import { getServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database";
import { DOCUMENT_BUCKET, uploadPrivatePdf } from "@/lib/pdf/storage";

export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export const DOCUMENT_KINDS = [
  "contract",
  "msa",
  "sow",
  "invoice",
  "other",
] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export function isDocumentKind(value: string): value is DocumentKind {
  return (DOCUMENT_KINDS as readonly string[]).includes(value);
}

export async function listClientDocuments(
  clientId: string,
): Promise<{ rows: DocumentRow[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { rows: [], error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function createDocumentWithUpload(input: {
  client_id: string;
  title: string;
  kind: DocumentKind;
  notes?: string | null;
  external_url?: string | null;
  fileBytes?: Buffer | null;
}): Promise<{ row: DocumentRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const viewToken = randomBytes(24).toString("hex");

  const { data: inserted, error: insertError } = await supabase
    .from("documents")
    .insert({
      client_id: input.client_id,
      title: input.title,
      kind: input.kind,
      notes: input.notes ?? null,
      external_url: input.external_url ?? null,
      view_token: viewToken,
    })
    .select("*")
    .single();

  if (insertError || !inserted) {
    return { row: null, error: insertError?.message ?? "Create failed." };
  }

  if (input.fileBytes && input.fileBytes.byteLength > 0) {
    const storagePath = `${input.client_id}/${inserted.id}.pdf`;
    const upload = await uploadPrivatePdf(
      DOCUMENT_BUCKET,
      storagePath,
      input.fileBytes,
    );
    if (!upload.ok) {
      await supabase.from("documents").delete().eq("id", inserted.id);
      return { row: null, error: upload.error };
    }

    const { data: updated, error: updateError } = await supabase
      .from("documents")
      .update({
        storage_path: storagePath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", inserted.id)
      .select("*")
      .single();

    if (updateError || !updated) {
      return { row: null, error: updateError?.message ?? "Update failed." };
    }
    return { row: updated, error: null };
  }

  return { row: inserted, error: null };
}

export async function findClientByEmail(email: string): Promise<{
  row: Database["public"]["Tables"]["clients"]["Row"] | null;
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const normalized = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .ilike("primary_email", normalized)
    .maybeSingle();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}
