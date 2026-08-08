export type LoopSource = "inbox" | "billing" | "work" | "outbound" | "setup";

export type LoopActionKind = "closed" | "snoozed" | "muted" | "reopened";

export type LoopEvent = {
  loop_key: string;
  action: LoopActionKind;
  note: string | null;
  snoozed_until: string | null;
  created_at: string;
};

export type Loop = {
  key: string;
  source: LoopSource;
  title: string;
  detail: string;
  href: string;
  priority: number;
};

export type LoopCollection = {
  open: Loop[];
  later: Loop[];
  recentlyClosed: Array<Loop & { closedAt: string; note: string | null }>;
};

export const TODAY_VISIBLE_CAP = 3;
export const RECENTLY_CLOSED_MS = 10 * 60 * 1000;
