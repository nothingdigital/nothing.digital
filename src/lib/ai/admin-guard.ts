import type { User } from "@supabase/supabase-js";

import { getRateLimiter } from "@/lib/rate-limit";

export const AI_DRAFT_RATE_LIMIT_ERROR =
  "Too many AI drafts. Try again in an hour.";
export const AI_DRAFT_FAILED_ERROR = "Draft failed. Try again.";

export type AdminAiFeature =
  "inbox" | "ops-brief" | "invoice-cover" | "outbound";

export async function guardAdminAiDraft(
  feature: AdminAiFeature,
  user: User,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = user.email?.trim().toLowerCase() || "unknown";
  const rateLimit = await getRateLimiter().limit(
    `ai-admin:${email}:${feature}`,
  );
  if (!rateLimit.success) {
    return { ok: false, error: AI_DRAFT_RATE_LIMIT_ERROR };
  }
  return { ok: true };
}

export function aiDraftError(err: unknown): string {
  console.error("[ai-draft]", err);
  return AI_DRAFT_FAILED_ERROR;
}
