import { effectiveInvoiceStatus } from "./client-ops";

export function selectOverdueInvoices<
  T extends { status: string; due_at: string | null },
>(invoices: T[], now: Date = new Date()): T[] {
  return invoices.filter(
    (invoice) => effectiveInvoiceStatus(invoice, now) === "overdue",
  );
}

export function countOverdueInvoices(
  invoices: Array<{ status: string; due_at: string | null }>,
  now: Date = new Date(),
): number {
  return selectOverdueInvoices(invoices, now).length;
}
