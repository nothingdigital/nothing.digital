"use server";

import { requireAdmin } from "@/lib/admin/auth";
import type { LoopCollection } from "@/lib/admin/loops/types";
import { draftOpsBrief, isOpsBriefEnabled } from "@/lib/ai";

export async function draftOpsBriefAction(collection: LoopCollection) {
  await requireAdmin();
  if (!isOpsBriefEnabled()) {
    return { ok: false as const, error: "Ops brief AI is disabled." };
  }
  try {
    const brief = await draftOpsBrief(collection);
    return { ok: true as const, brief };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Draft failed.",
    };
  }
}
