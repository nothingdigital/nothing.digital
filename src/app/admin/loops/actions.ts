"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { insertLoopEvent } from "@/lib/admin/loops/queries";
import type { LoopActionKind } from "@/lib/admin/loops/types";

function snoozeUntil(choice: string, now = new Date()): string {
  const date = new Date(now);
  if (choice === "3d") {
    date.setUTCDate(date.getUTCDate() + 3);
  } else if (choice === "monday") {
    const day = date.getUTCDay();
    const daysUntilMonday = day === 0 ? 1 : day === 1 ? 7 : 8 - day;
    date.setUTCDate(date.getUTCDate() + daysUntilMonday);
  } else {
    date.setUTCDate(date.getUTCDate() + 1);
  }
  date.setUTCHours(12, 0, 0, 0);
  return date.toISOString();
}

async function recordLoop(
  formData: FormData,
  action: LoopActionKind,
  extras?: { note?: string | null; snoozed_until?: string },
): Promise<void> {
  await requireAdmin();
  const loopKey = String(formData.get("loop_key") ?? "").trim();
  if (!loopKey) throw new Error("loop_key required");

  const { error } = await insertLoopEvent({
    loop_key: loopKey,
    action,
    ...extras,
  });
  if (error) throw new Error(error);
  revalidatePath("/admin");
}

export async function closeLoopAction(formData: FormData): Promise<void> {
  const note = String(formData.get("note") ?? "").trim() || null;
  await recordLoop(formData, "closed", { note });
}

export async function reopenLoopAction(formData: FormData): Promise<void> {
  await recordLoop(formData, "reopened");
}

export async function snoozeLoopAction(formData: FormData): Promise<void> {
  const choice = String(formData.get("snooze") ?? "tomorrow").trim();
  await recordLoop(formData, "snoozed", {
    snoozed_until: snoozeUntil(choice),
  });
}

export async function muteLoopAction(formData: FormData): Promise<void> {
  await recordLoop(formData, "muted");
}

export async function logOutboundHandoffAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const loopKey = String(formData.get("loop_key") ?? "").trim();
  const imported = String(formData.get("imported") ?? "").trim();
  if (!loopKey) throw new Error("loop_key required");

  const note = imported
    ? `imported ${imported} leads`
    : "outbound handoff logged";

  const { error } = await insertLoopEvent({
    loop_key: loopKey,
    action: "closed",
    note,
  });
  if (error) throw new Error(error);
  revalidatePath("/admin");
  revalidatePath("/admin/outbound");
}
