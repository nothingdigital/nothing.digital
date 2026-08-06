import { effectiveInvoiceStatus } from "./client-ops";

export function countOverdueInvoices(
  invoices: Array<{ status: string; due_at: string | null }>,
  now: Date = new Date(),
): number {
  return invoices.filter(
    (invoice) => effectiveInvoiceStatus(invoice, now) === "overdue",
  ).length;
}
