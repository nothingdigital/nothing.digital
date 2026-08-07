import type { Metadata } from "next";
import Link from "next/link";

import { AdminFilterChip } from "@/components/admin/admin-form";
import { InvoiceStatusSelect } from "@/components/admin/client-ops-selects";
import { InvoiceCoverDraftPanel } from "@/components/admin/invoice-cover-draft-panel";
import { InvoicePdfLinks } from "@/components/admin/invoice-pdf-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  INVOICE_STATUSES,
  effectiveInvoiceStatus,
  formatCents,
  isInvoiceStatus,
} from "@/lib/admin/client-ops";
import { listInvoices } from "@/lib/admin/client-ops-queries";
import { isInvoiceCoverEnabled } from "@/lib/ai";

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
  const coverEnabled = isInvoiceCoverEnabled();
  const visible = overdueOnly
    ? rows.filter((row) => effectiveInvoiceStatus(row, now) === "overdue")
    : rows;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Billing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Invoices across clients ({visible.length})
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/billing/new">New invoice</Link>
        </Button>
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
        <div className="space-y-2 rounded-lg border border-border bg-card px-4 py-5 text-sm">
          <p className="font-medium text-foreground">No invoices yet.</p>
          <p className="text-muted-foreground">
            Create a client first, then add an invoice from here or from the
            client&apos;s Billing tab. Cancel an invoice by setting status to{" "}
            <span className="font-medium text-foreground">void</span> — invoices
            are not deleted.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/admin/clients"
              className="text-primary underline-offset-4 hover:underline"
            >
              View clients
            </Link>
            <Link
              href="/admin/clients/new"
              className="text-primary underline-offset-4 hover:underline"
            >
              New client
            </Link>
            <Link
              href="/admin/billing/new"
              className="text-primary underline-offset-4 hover:underline"
            >
              New invoice
            </Link>
          </div>
        </div>
      ) : null}

      <ul className="space-y-3">
        {visible.map((invoice) => {
          const display = effectiveInvoiceStatus(invoice, now);
          const needsCover =
            invoice.status === "sent" && !invoice.sent_emailed_at;
          return (
            <li
              key={invoice.id}
              className="rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
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
                    <InvoicePdfLinks
                      externalUrl={invoice.external_url}
                      viewToken={invoice.view_token}
                      storagePath={invoice.storage_path}
                    />
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/clients/${invoice.client_id}/invoices/${invoice.id}/edit`}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Edit
                  </Link>
                  <Badge
                    variant={
                      display === "overdue" ? "destructive" : "secondary"
                    }
                  >
                    {display}
                  </Badge>
                  <InvoiceStatusSelect
                    id={invoice.id}
                    status={invoice.status}
                    clientId={invoice.client_id}
                  />
                </div>
              </div>
              <InvoiceCoverDraftPanel
                invoiceId={invoice.id}
                enabled={coverEnabled}
                needsCover={needsCover}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
