import { formatCents } from "@/lib/admin/client-ops";
import { selectOverdueInvoices } from "@/lib/admin/ops-glance";

import { invoiceLoop } from "../keys";
import type { Loop } from "../types";

export type OverdueInvoiceInput = {
  id: string;
  client_id: string;
  number: string;
  amount_cents: number;
  currency: string;
  status: string;
  due_at: string | null;
  clients: { id: string; name: string } | null;
};

export function overdueInvoiceLoops(
  invoices: OverdueInvoiceInput[],
  now: Date = new Date(),
): Loop[] {
  return selectOverdueInvoices(invoices, now).map((invoice) => {
    const clientName = invoice.clients?.name ?? "Unknown client";
    const dueLabel = invoice.due_at
      ? `due ${invoice.due_at.slice(0, 10)}`
      : "no due date";
    return {
      key: invoiceLoop(invoice.id),
      source: "billing",
      title: `${invoice.number} · ${clientName}`,
      detail: `${formatCents(invoice.amount_cents, invoice.currency)} · ${dueLabel}`,
      href: `/admin/clients/${invoice.client_id}/invoices/${invoice.id}/edit`,
      priority: 10,
    };
  });
}
