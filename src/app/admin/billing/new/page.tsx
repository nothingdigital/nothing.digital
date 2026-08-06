import type { Metadata } from "next";
import Link from "next/link";

import { startNewInvoiceAction } from "@/app/admin/clients/actions";
import { AdminField, adminControlClass } from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";
import { listClients } from "@/lib/admin/client-ops-queries";

export const metadata: Metadata = {
  title: "New invoice",
  robots: { index: false, follow: false },
};

export default async function AdminBillingNewInvoicePage() {
  const { rows: clients, error } = await listClients();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/admin/billing"
            className="underline-offset-4 hover:underline"
          >
            Billing
          </Link>{" "}
          / New invoice
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
          New invoice
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a client, then fill in the invoice details.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!error && clients.length === 0 ? (
        <div className="space-y-2 rounded-lg border border-border bg-card px-4 py-5 text-sm">
          <p className="font-medium text-foreground">No clients yet.</p>
          <p className="text-muted-foreground">
            Create a client before adding an invoice.
          </p>
          <Link
            href="/admin/clients/new"
            className="inline-block text-primary underline-offset-4 hover:underline"
          >
            New client
          </Link>
        </div>
      ) : null}

      {!error && clients.length > 0 ? (
        <form action={startNewInvoiceAction} className="max-w-xl space-y-4">
          <AdminField label="Client" htmlFor="client_id">
            <select
              id="client_id"
              name="client_id"
              required
              defaultValue=""
              className={adminControlClass}
            >
              <option value="" disabled>
                Select a client
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </AdminField>
          <Button type="submit">Continue</Button>
        </form>
      ) : null}
    </div>
  );
}
