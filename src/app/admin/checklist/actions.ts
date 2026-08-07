"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { setChecklistItem } from "@/lib/admin/loops/queries";

export async function toggleChecklistItemAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const checklistKey = String(formData.get("checklist_key") ?? "").trim();
  const itemKey = String(formData.get("item_key") ?? "").trim();
  const checked = String(formData.get("checked") ?? "") === "true";

  if (!checklistKey || !itemKey) {
    throw new Error("checklist_key and item_key required");
  }

  const { error } = await setChecklistItem({
    checklist_key: checklistKey,
    item_key: itemKey,
    checked,
  });
  if (error) throw new Error(error);

  revalidatePath("/admin");
  revalidatePath("/admin/health");
  revalidatePath("/admin/outbound");
}
