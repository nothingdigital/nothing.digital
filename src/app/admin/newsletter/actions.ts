"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { unsubscribeNewsletterSubscriber } from "@/lib/admin/queries";

export async function unsubscribeNewsletterAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Subscriber id is required.");
  }

  const result = await unsubscribeNewsletterSubscriber(id);
  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath("/admin/newsletter");
}
