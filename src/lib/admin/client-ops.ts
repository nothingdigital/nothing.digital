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

export const WORK_SORTS = ["due", "priority", "created"] as const;

export type WorkSort = (typeof WORK_SORTS)[number];

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

export function isWorkSort(value: string): value is WorkSort {
  return (WORK_SORTS as readonly string[]).includes(value);
}

const PRIORITY_RANK: Record<WorkPriority, number> = {
  high: 0,
  med: 1,
  low: 2,
};

export function isWorkDueSoon(
  item: { due_at: string | null },
  now: Date = new Date(),
  withinDays = 7,
): boolean {
  if (!item.due_at) return false;
  const due = new Date(item.due_at);
  if (Number.isNaN(due.getTime())) return false;
  const horizon = new Date(now);
  horizon.setUTCDate(horizon.getUTCDate() + withinDays);
  return due <= horizon;
}

export function compareWorkItems(
  a: { due_at: string | null; priority: string; created_at: string },
  b: { due_at: string | null; priority: string; created_at: string },
  sort: WorkSort,
  _now: Date = new Date(),
): number {
  if (sort === "due") {
    if (a.due_at === null && b.due_at === null) return 0;
    if (a.due_at === null) return 1;
    if (b.due_at === null) return -1;
    return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
  }

  if (sort === "priority") {
    const aRank = isWorkPriority(a.priority)
      ? PRIORITY_RANK[a.priority]
      : Number.POSITIVE_INFINITY;
    const bRank = isWorkPriority(b.priority)
      ? PRIORITY_RANK[b.priority]
      : Number.POSITIVE_INFINITY;
    return aRank - bRank;
  }

  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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

export function truncateText(value: string, max = 100): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

// ponytail: simple rule based. YAGNI ML. Score 0-100 for inbox sort + badge. Keywords for urgency, service for value, budget for priority.
export function scoreLead(submission: any): number {
  if (!submission) return 0;
  let score = 50;
  if (submission.budget === "50k+") score += 30;
  if (submission.budget === "15k-50k") score += 20;
  if (
    submission.service === "ai-solutions" ||
    submission.service === "software-solutions" ||
    submission.service === "applications"
  )
    score += 25;
  if (
    submission.message &&
    /urgent|asap|immediate|now|fast|rush|priority| ASAP/i.test(
      submission.message,
    )
  )
    score += 25;
  return Math.min(100, score);
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
