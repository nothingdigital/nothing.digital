/** Pure helpers for map → outbound insert decisions (no Supabase). */

export function isBlockedByDnc(
  blocklist: Set<string>,
  email: string | null | undefined,
  website: string | null | undefined,
): boolean {
  const emailKey = email?.trim().toLowerCase();
  if (emailKey && blocklist.has(emailKey)) return true;
  if (!website) return false;
  const host = website
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    ?.toLowerCase();
  return Boolean(host && blocklist.has(host));
}
