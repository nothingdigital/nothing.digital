import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateInvoiceAction } from "@/app/admin/clients/actions";
import {
  AdminField,
  adminControlClass,
  adminTextareaClass,
} from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INVOICE_STATUSES } from "@/lib/admin/client-ops";
import { getClient, getInvoice } from "@/lib/admin/client-ops-queries";

export const metadata: Metadata = {
  title: "Edit invoice",
  robots: { index: false, follow: false },
};

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export default async function AdminEditInvoicePage({
  params,
}: {
  params: Promise<{ id: string; invoiceId: string }>;
}) {
  const { id, invoiceId } = await params;
  const [{ row: client, error: clientError }, { row: invoice, error }] =
    await Promise.all([getClient(id), getInvoice(invoiceId)]);

  if (!client) {
    if (clientError) {
      return (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {clientError}
        </p>
      );
    }
    notFound();
  }

  if (!invoice || invoice.client_id !== id) {
    if (error) {
      return (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      );
    }
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/admin/clients"
            className="underline-offset-4 hover:underline"
          >
            Clients
          </Link>{" "}
          /{" "}
          <Link
            href={`/admin/clients/${id}?tab=billing`}
            className="underline-offset-4 hover:underline"
          >
            {client.name}
          </Link>{" "}
          / Edit invoice
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
          Edit invoice
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          To cancel, set status to void (invoices are not deleted).
        </p>
      </div>

      <form action={updateInvoiceAction} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={invoice.id} />
        <input type="hidden" name="client_id" value={id} />
        <AdminField label="Number" htmlFor="number">
          <Input
            id="number"
            name="number"
            defaultValue={invoice.number}
            required
          />
        </AdminField>
        <AdminField label="Title" htmlFor="title">
          <Input
            id="title"
            name="title"
            required
            defaultValue={invoice.title}
          />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Amount (USD)" htmlFor="amount">
            <Input
              id="amount"
              name="amount"
              required
              inputMode="decimal"
              defaultValue={(invoice.amount_cents / 100).toFixed(2)}
            />
          </AdminField>
          <AdminField label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={invoice.status}
              className={adminControlClass}
            >
              {INVOICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </AdminField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Issued" htmlFor="issued_at">
            <Input
              id="issued_at"
              name="issued_at"
              type="date"
              defaultValue={toDateInputValue(invoice.issued_at)}
            />
          </AdminField>
          <AdminField label="Due" htmlFor="due_at">
            <Input
              id="due_at"
              name="due_at"
              type="date"
              defaultValue={toDateInputValue(invoice.due_at)}
            />
          </AdminField>
        </div>
        <AdminField
          label="External URL (PDF / payment link)"
          htmlFor="external_url"
        >
          <Input
            id="external_url"
            name="external_url"
            type="url"
            defaultValue={invoice.external_url ?? ""}
          />
        </AdminField>
        <AdminField label="Notes" htmlFor="notes">
          <textarea
            id="notes"
            name="notes"
            className={adminTextareaClass}
            defaultValue={invoice.notes ?? ""}
          />
        </AdminField>
        <Button type="submit">Save invoice</Button>
      </form>
    </div>
  );
}
