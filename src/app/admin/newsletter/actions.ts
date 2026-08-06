"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { unsubscribeNewsletterSubscriber } from "@/lib/admin/queries";

export async function unsubscribeNewsletterAction(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { ok: false, error: "Subscriber id is required." };
  }

  const result = await unsubscribeNewsletterSubscriber(id);
  if (result.ok) {
    revalidatePath("/admin/newsletter");
  }
  return result;
}
