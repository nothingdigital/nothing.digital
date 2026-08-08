export type KbStatus = "draft" | "in_review" | "approved";

const OK = new Set([
  "draft>in_review",
  "in_review>approved",
  "in_review>draft",
  "approved>draft",
]);

export function canTransition(from: KbStatus, to: KbStatus): boolean {
  return OK.has(`${from}>${to}`);
}

export function assertTransition(from: KbStatus, to: KbStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal KB status transition: ${from} → ${to}`);
  }
}
