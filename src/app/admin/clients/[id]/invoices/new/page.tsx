import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createInvoiceAction } from "@/app/admin/clients/actions";
import {
  AdminField,
  adminControlClass,
  adminTextareaClass,
} from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INVOICE_STATUSES } from "@/lib/admin/client-ops";
import { getClient, nextInvoiceNumber } from "@/lib/admin/client-ops-queries";

export const metadata: Metadata = {
  title: "New invoice",
  robots: { index: false, follow: false },
};

export default async function AdminNewInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { row: client, error } = await getClient(id);
  if (!client) {
    if (error) {
      return (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      );
    }
    notFound();
  }

  const { number } = await nextInvoiceNumber();
  const issuedDefault = new Date().toISOString().slice(0, 10);
  const due = new Date();
  due.setDate(due.getDate() + 15);
  const dueDefault = due.toISOString().slice(0, 10);

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
          / New invoice
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
          New invoice
        </h2>
      </div>

      <form action={createInvoiceAction} className="max-w-xl space-y-4">
        <input type="hidden" name="client_id" value={id} />
        <AdminField label="Number" htmlFor="number">
          <Input id="number" name="number" defaultValue={number} required />
        </AdminField>
        <AdminField label="Title" htmlFor="title">
          <Input
            id="title"
            name="title"
            required
            placeholder="Retainer — Aug"
          />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Amount (USD)" htmlFor="amount">
            <Input
              id="amount"
              name="amount"
              required
              inputMode="decimal"
              placeholder="1500.00"
            />
          </AdminField>
          <AdminField label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue="draft"
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
              defaultValue={issuedDefault}
            />
          </AdminField>
          <AdminField label="Due" htmlFor="due_at">
            <Input
              id="due_at"
              name="due_at"
              type="date"
              defaultValue={dueDefault}
            />
          </AdminField>
        </div>
        <AdminField
          label="External URL (PDF / payment link)"
          htmlFor="external_url"
        >
          <Input id="external_url" name="external_url" type="url" />
        </AdminField>
        <AdminField label="Notes" htmlFor="notes">
          <textarea id="notes" name="notes" className={adminTextareaClass} />
        </AdminField>
        <Button type="submit">Create invoice</Button>
      </form>
    </div>
  );
}
