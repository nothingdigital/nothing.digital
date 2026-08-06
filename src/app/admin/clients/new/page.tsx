import type { Metadata } from "next";
import Link from "next/link";

import {
  AdminField,
  adminControlClass,
  adminTextareaClass,
} from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientAction } from "@/app/admin/clients/actions";
import { BILLING_MODELS, CLIENT_STATUSES } from "@/lib/admin/client-ops";

export const metadata: Metadata = {
  title: "New client",
  robots: { index: false, follow: false },
};

export default function AdminNewClientPage() {
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
          / New
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
          New client
        </h2>
      </div>

      <form action={createClientAction} className="max-w-xl space-y-4">
        <AdminField label="Name" htmlFor="name">
          <Input id="name" name="name" required />
        </AdminField>
        <AdminField label="Primary email" htmlFor="primary_email">
          <Input
            id="primary_email"
            name="primary_email"
            type="email"
            required
          />
        </AdminField>
        <AdminField label="Company" htmlFor="company">
          <Input id="company" name="company" />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue="lead"
              className={adminControlClass}
            >
              {CLIENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Billing model" htmlFor="billing_model">
            <select
              id="billing_model"
              name="billing_model"
              defaultValue="none"
              className={adminControlClass}
            >
              {BILLING_MODELS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </AdminField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Default rate (USD)" htmlFor="default_rate">
            <Input
              id="default_rate"
              name="default_rate"
              placeholder="150.00"
              inputMode="decimal"
            />
          </AdminField>
          <AdminField label="Payment terms" htmlFor="payment_terms">
            <Input
              id="payment_terms"
              name="payment_terms"
              defaultValue="net_15"
            />
          </AdminField>
        </div>
        <AdminField label="Notes" htmlFor="notes">
          <textarea id="notes" name="notes" className={adminTextareaClass} />
        </AdminField>
        <Button type="submit">Create client</Button>
      </form>
    </div>
  );
}
