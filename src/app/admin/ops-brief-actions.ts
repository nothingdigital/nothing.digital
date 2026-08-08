"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { loadTodayLoopCollection } from "@/lib/admin/loops/load-today";
import { draftOpsBrief, isOpsBriefEnabled } from "@/lib/ai";
import {
  AI_DRAFT_FAILED_ERROR,
  aiDraftError,
  guardAdminAiDraft,
} from "@/lib/ai/admin-guard";

export async function draftOpsBriefAction() {
  const user = await requireAdmin();
  if (!isOpsBriefEnabled()) {
    return { ok: false as const, error: "Ops brief AI is disabled." };
  }

  const gated = await guardAdminAiDraft("ops-brief", user);
  if (!gated.ok) return gated;

  try {
    const { collection, dataError } = await loadTodayLoopCollection();
    if (dataError) {
      return { ok: false as const, error: AI_DRAFT_FAILED_ERROR };
    }
    const brief = await draftOpsBrief(collection);
    return { ok: true as const, brief };
  } catch (err) {
    return { ok: false as const, error: aiDraftError(err) };
  }
}
