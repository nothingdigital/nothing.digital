"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { isInboxStatus, type InboxStatus } from "@/lib/admin/config";
import { updateContactStatus } from "@/lib/admin/queries";

export async function updateInboxStatusAction(id: string, status: InboxStatus) {
  await requireAdmin();

  if (!isInboxStatus(status)) {
    return { ok: false as const, error: "Invalid status." };
  }

  const result = await updateContactStatus(id, status);
  if (result.ok) {
    revalidatePath("/admin/inbox");
  }
  return result;
}
