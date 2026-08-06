"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/admin/client-ops-queries";
import { isInboxStatus, type InboxStatus } from "@/lib/admin/config";
import { buildClientNotesFromSubmission } from "@/lib/admin/inbox-lead";
import {
  getContactSubmission,
  updateContactStatus,
} from "@/lib/admin/queries";

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

export async function createClientFromInboxAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const submissionId = String(formData.get("submission_id") ?? "").trim();
  if (!submissionId) {
    throw new Error("Submission id is required.");
  }

  const markStatusRaw = String(formData.get("mark_status") ?? "").trim();
  const markStatus =
    markStatusRaw === ""
      ? null
      : isInboxStatus(markStatusRaw)
        ? markStatusRaw
        : null;
  if (markStatusRaw && !markStatus) {
    throw new Error("Invalid mark status.");
  }

  const { row: submission, error } = await getContactSubmission(submissionId);
  if (error) {
    throw new Error(error);
  }
  if (!submission) {
    throw new Error("Submission not found.");
  }

  const result = await createClient({
    name: submission.name,
    primary_email: submission.email,
    company: submission.company,
    status: "lead",
    billing_model: "none",
    payment_terms: "net_15",
    notes: buildClientNotesFromSubmission(submission),
  });

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
  }

  if (markStatus) {
    const statusResult = await updateContactStatus(submissionId, markStatus);
    if (!statusResult.ok) {
      throw new Error(statusResult.error);
    }
  }

  revalidatePath("/admin/inbox");
  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${result.row.id}`);
}
