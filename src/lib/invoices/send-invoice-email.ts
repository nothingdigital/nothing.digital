import { getResendClient } from "@/lib/resend";
import { invoiceSentEmailTemplate } from "@/lib/email/templates";
import { formatCents } from "@/lib/admin/client-ops";

const FROM_EMAIL = "Nothing.Digital <hello@nothing.digital>";

export type InvoiceEmailPayload = {
  to: string;
  clientName: string;
  number: string;
  title: string;
  amount_cents: number;
  currency: string;
  due_at: string | null;
  viewUrl: string;
};

export async function sendInvoiceSentEmail(
  payload: InvoiceEmailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "Resend is not configured." };
  }

  const amount = formatCents(payload.amount_cents, payload.currency);
  const due = payload.due_at
    ? new Date(payload.due_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.to,
    subject: `Invoice ${payload.number} from Nothing.Digital`,
    html: invoiceSentEmailTemplate({
      clientName: payload.clientName,
      number: payload.number,
      title: payload.title,
      amount,
      due,
      viewUrl: payload.viewUrl,
    }),
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
