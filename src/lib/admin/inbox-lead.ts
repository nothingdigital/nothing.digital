import type { Database } from "@/lib/supabase/database";

type ContactSubmission =
  Database["public"]["Tables"]["contact_submissions"]["Row"];

export function buildClientNotesFromSubmission(
  submission: Pick<
    ContactSubmission,
    "id" | "service" | "budget" | "message"
  >,
): string {
  const lines = [`Inbox lead ${submission.id}`];

  if (submission.service) {
    lines.push(`Service: ${submission.service}`);
  }
  if (submission.budget) {
    lines.push(`Budget: ${submission.budget}`);
  }

  lines.push("", submission.message.trim());
  return lines.join("\n");
}
