export const CLIENT_STATUSES = ["lead", "active", "paused", "churned"] as const;

export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const BILLING_MODELS = [
  "project",
  "retainer",
  "hourly",
  "none",
] as const;

export type BillingModel = (typeof BILLING_MODELS)[number];

export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "void",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const ASSET_TYPES = [
  "website",
  "app",
  "email",
  "domain",
  "hosting",
  "other",
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

export const ASSET_ENVS = ["prod", "staging", "dev"] as const;

export type AssetEnv = (typeof ASSET_ENVS)[number];

export const ASSET_STATUSES = ["active", "handoff", "retired"] as const;

export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const WORK_STATUSES = [
  "backlog",
  "planned",
  "in_progress",
  "blocked",
  "done",
] as const;

export type WorkStatus = (typeof WORK_STATUSES)[number];

export const WORK_PRIORITIES = ["low", "med", "high"] as const;

export type WorkPriority = (typeof WORK_PRIORITIES)[number];

export function isClientStatus(value: string): value is ClientStatus {
  return (CLIENT_STATUSES as readonly string[]).includes(value);
}

export function isBillingModel(value: string): value is BillingModel {
  return (BILLING_MODELS as readonly string[]).includes(value);
}

export function isInvoiceStatus(value: string): value is InvoiceStatus {
  return (INVOICE_STATUSES as readonly string[]).includes(value);
}

export function isAssetType(value: string): value is AssetType {
  return (ASSET_TYPES as readonly string[]).includes(value);
}

export function isAssetEnv(value: string): value is AssetEnv {
  return (ASSET_ENVS as readonly string[]).includes(value);
}

export function isAssetStatus(value: string): value is AssetStatus {
  return (ASSET_STATUSES as readonly string[]).includes(value);
}

export function isWorkStatus(value: string): value is WorkStatus {
  return (WORK_STATUSES as readonly string[]).includes(value);
}

export function isWorkPriority(value: string): value is WorkPriority {
  return (WORK_PRIORITIES as readonly string[]).includes(value);
}

export function effectiveInvoiceStatus(
  invoice: { status: string; due_at: string | null },
  now: Date = new Date(),
): InvoiceStatus {
  const status = isInvoiceStatus(invoice.status) ? invoice.status : "draft";
  if (status === "paid" || status === "void") return status;
  if (status === "overdue") return "overdue";
  if (invoice.due_at && new Date(invoice.due_at) < now) return "overdue";
  return status;
}

export function formatCents(
  amountCents: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

export function openBalanceCents(
  invoices: Array<{
    amount_cents: number;
    status: string;
    due_at: string | null;
  }>,
  now: Date = new Date(),
): number {
  return invoices.reduce((sum, invoice) => {
    const status = effectiveInvoiceStatus(invoice, now);
    if (status === "paid" || status === "void") return sum;
    return sum + invoice.amount_cents;
  }, 0);
}
