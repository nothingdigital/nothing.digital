import { getServiceRoleClient } from "@/lib/supabase/server";

export const INVOICE_BUCKET = "invoices";
export const DOCUMENT_BUCKET = "documents";

export async function uploadPrivatePdf(
  bucket: string,
  path: string,
  bytes: Buffer | Uint8Array,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const body = bytes instanceof Buffer ? bytes : Buffer.from(bytes);
  const { error } = await supabase.storage.from(bucket).upload(path, body, {
    contentType: "application/pdf",
    upsert: true,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, path };
}

export async function downloadPrivatePdf(
  bucket: string,
  path: string,
): Promise<{ data: Blob; error: null } | { data: null; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { data: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error || !data) {
    return { data: null, error: error?.message ?? "Download failed." };
  }
  return { data, error: null };
}
