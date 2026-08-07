"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/admin/client-ops-queries";
import { isInboxStatus, type InboxStatus } from "@/lib/admin/config";
import { buildClientNotesFromSubmission } from "@/lib/admin/inbox-lead";
import { getContactSubmission, updateContactStatus } from "@/lib/admin/queries";
import { draftInboxReply, isInboxDraftsEnabled } from "@/lib/ai";
import { aiDraftError, guardAdminAiDraft } from "@/lib/ai/admin-guard";
import { inboxDraftSchema } from "@/lib/ai/types";
import { inboxReplyEmailTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { getResendClient } from "@/lib/resend";

const FROM_EMAIL = "Nothing.Digital <hello@nothing.digital>";

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

export async function draftInboxReplyAction(submissionId: string) {
  const user = await requireAdmin();

  if (!isInboxDraftsEnabled()) {
    return { ok: false as const, error: "Inbox AI drafts are disabled." };
  }

  const gated = await guardAdminAiDraft("inbox", user);
  if (!gated.ok) return gated;

  const { row, error } = await getContactSubmission(submissionId);
  if (error) {
    return { ok: false as const, error };
  }
  if (!row) {
    return { ok: false as const, error: "Submission not found." };
  }

  try {
    const draft = await draftInboxReply({
      name: row.name,
      email: row.email,
      company: row.company,
      service: row.service,
      budget: row.budget,
      message: row.message,
    });
    return { ok: true as const, draft };
  } catch (err) {
    return { ok: false as const, error: aiDraftError(err) };
  }
}

export async function sendInboxReplyAction(input: {
  submissionId: string;
  subject: string;
  body: string;
}) {
  await requireAdmin();

  const parsed = inboxDraftSchema
    .pick({ subject: true, body: true })
    .safeParse({ subject: input.subject, body: input.body });
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid subject or body." };
  }

  const { row, error } = await getContactSubmission(input.submissionId);
  if (error) {
    return { ok: false as const, error };
  }
  if (!row) {
    return { ok: false as const, error: "Submission not found." };
  }

  const resend = getResendClient();
  if (!resend) {
    return { ok: false as const, error: "Resend is not configured." };
  }

  const bcc = env.private.CONTACT_NOTIFY_EMAIL;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: row.email,
      ...(bcc ? { bcc } : {}),
      subject: parsed.data.subject,
      html: inboxReplyEmailTemplate(parsed.data.body),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed.";
    return { ok: false as const, error: message };
  }

  const statusResult = await updateContactStatus(input.submissionId, "replied");
  if (!statusResult.ok) {
    return {
      ok: false as const,
      error: `Sent, but status update failed: ${statusResult.error}`,
    };
  }

  revalidatePath("/admin/inbox");
  return { ok: true as const };
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
