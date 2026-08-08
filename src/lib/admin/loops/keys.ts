/** Deterministic loop keys — never invent free-form keys at call sites. */

export function invoiceLoop(id: string): string {
  return `invoice:overdue:${id}`;
}

export function inboxLoop(id: string): string {
  return `inbox:stale:${id}`;
}

export function workLoop(id: string): string {
  return `work:attention:${id}`;
}

export function cadenceLoop(name: string, period: string): string {
  return `cadence:${name}:${period}`;
}

export function runbookLoop(slug: string, itemKey: string): string {
  return `runbook:${slug}:${itemKey}`;
}

/** ISO week string e.g. 2026-W32 */
export function isoWeekPeriod(date: Date = new Date()): string {
  const target = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
