import { getServiceRoleClient } from "@/lib/supabase/server";

export const KB_BUCKET = "kb-docs";

export async function uploadKbFile(
  path: string,
  bytes: Buffer | Uint8Array,
  contentType: string,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const body = bytes instanceof Buffer ? bytes : Buffer.from(bytes);
  const { error } = await supabase.storage.from(KB_BUCKET).upload(path, body, {
    contentType,
    upsert: true,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, path };
}

export async function downloadKbFile(
  path: string,
): Promise<{ data: Blob; error: null } | { data: null; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { data: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase.storage.from(KB_BUCKET).download(path);
  if (error || !data) {
    return { data: null, error: error?.message ?? "Download failed." };
  }
  return { data, error: null };
}
