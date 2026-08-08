import { formatCents } from "@/lib/admin/client-ops";
import { getInvoice } from "@/lib/admin/client-ops-queries";
import type { InvoiceCoverFacts } from "@/lib/ai/format-prompt-input";
import { env } from "@/lib/env";
import { ensureInvoicePdf } from "@/lib/pdf/resolve-view";

export type InvoiceEmailContext = {
  invoiceId: string;
  to: string;
  clientName: string;
  number: string;
  title: string;
  amount_cents: number;
  currency: string;
  due_at: string | null;
  notes: string | null;
  viewUrl: string;
  status: string;
  sentEmailedAt: string | null;
  coverFacts: InvoiceCoverFacts;
};

export async function buildInvoiceEmailContext(
  invoiceId: string,
): Promise<
  { ok: true; context: InvoiceEmailContext } | { ok: false; error: string }
> {
  const existing = await getInvoice(invoiceId);
  if (existing.error || !existing.row) {
    return { ok: false, error: existing.error ?? "Invoice not found." };
  }

  const generated = await ensureInvoicePdf(invoiceId);
  if (!generated.ok) {
    return { ok: false, error: generated.error };
  }

  const siteUrl =
    env.public.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://nothing.digital";
  const viewUrl = `${siteUrl}/v/${generated.viewToken}`;
  const dueLabel = generated.invoice.due_at
    ? new Date(generated.invoice.due_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;
  const amountLabel = formatCents(
    generated.invoice.amount_cents,
    generated.invoice.currency,
  );

  return {
    ok: true,
    context: {
      invoiceId,
      to: generated.client.primary_email,
      clientName: generated.client.name,
      number: generated.invoice.number,
      title: generated.invoice.title,
      amount_cents: generated.invoice.amount_cents,
      currency: generated.invoice.currency,
      due_at: generated.invoice.due_at,
      notes: generated.invoice.notes,
      viewUrl,
      status: generated.invoice.status,
      sentEmailedAt: generated.invoice.sent_emailed_at,
      coverFacts: {
        clientName: generated.client.name,
        number: generated.invoice.number,
        title: generated.invoice.title,
        amountLabel,
        dueLabel,
        notes: generated.invoice.notes,
      },
    },
  };
}
