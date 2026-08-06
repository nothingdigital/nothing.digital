import type { Metadata } from "next";
import Link from "next/link";

import { AdminFilterChip } from "@/components/admin/admin-form";
import { InvoiceStatusSelect } from "@/components/admin/client-ops-selects";
import { Badge } from "@/components/ui/badge";
import {
  INVOICE_STATUSES,
  effectiveInvoiceStatus,
  formatCents,
  isInvoiceStatus,
} from "@/lib/admin/client-ops";
import { listInvoices } from "@/lib/admin/client-ops-queries";

export const metadata: Metadata = {
  title: "Billing",
  robots: { index: false, follow: false },
};

export default async function AdminBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; overdue?: string }>;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && isInvoiceStatus(params.status) ? params.status : undefined;
  const overdueOnly = params.overdue === "1";

  const { rows, error } = await listInvoices({ status: statusFilter });
  const now = new Date();
  const visible = overdueOnly
    ? rows.filter((row) => effectiveInvoiceStatus(row, now) === "overdue")
    : rows;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Billing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoices across clients ({visible.length})
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <AdminFilterChip
          href="/admin/billing"
          label="All"
          active={!statusFilter && !overdueOnly}
        />
        <AdminFilterChip
          href="/admin/billing?overdue=1"
          label="overdue (computed)"
          active={overdueOnly}
        />
        {INVOICE_STATUSES.map((status) => (
          <AdminFilterChip
            key={status}
            href={`/admin/billing?status=${status}`}
            label={status}
            active={statusFilter === status && !overdueOnly}
          />
        ))}
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {visible.length === 0 && !error ? (
        <p className="text-sm text-muted-foreground">No invoices yet.</p>
      ) : null}

      <ul className="space-y-3">
        {visible.map((invoice) => {
          const display = effectiveInvoiceStatus(invoice, now);
          return (
            <li
              key={invoice.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="font-medium">
                  {invoice.number} · {invoice.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  <Link
                    href={`/admin/clients/${invoice.client_id}?tab=billing`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {invoice.clients?.name ?? "Client"}
                  </Link>
                  {" · "}
                  {formatCents(invoice.amount_cents, invoice.currency)}
                  {invoice.due_at
                    ? ` · due ${new Date(invoice.due_at).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={display === "overdue" ? "destructive" : "secondary"}
                >
                  {display}
                </Badge>
                <InvoiceStatusSelect
                  id={invoice.id}
                  status={invoice.status}
                  clientId={invoice.client_id}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
