import type { Loop, LoopEvent } from "./types";

export type LoopState = "open" | "closed" | "snoozed" | "muted";

function latestEvent(events: LoopEvent[]): LoopEvent | null {
  if (events.length === 0) return null;
  return events.reduce((latest, event) =>
    event.created_at > latest.created_at ? event : latest,
  );
}

export function resolveLoopState(
  events: LoopEvent[],
  now: Date = new Date(),
): { state: LoopState; latest: LoopEvent | null } {
  const latest = latestEvent(events);
  if (!latest) return { state: "open", latest: null };

  if (latest.action === "muted") return { state: "muted", latest };
  if (latest.action === "reopened") return { state: "open", latest };
  if (latest.action === "closed") return { state: "closed", latest };
  if (latest.action === "snoozed") {
    if (
      latest.snoozed_until &&
      new Date(latest.snoozed_until).getTime() > now.getTime()
    ) {
      return { state: "snoozed", latest };
    }
    return { state: "open", latest };
  }

  return { state: "open", latest };
}

export function applyEventsToLoops(
  loops: Loop[],
  eventsByKey: Map<string, LoopEvent[]>,
  now: Date = new Date(),
): {
  open: Loop[];
  closed: Array<Loop & { closedAt: string; note: string | null }>;
} {
  const open: Loop[] = [];
  const closed: Array<Loop & { closedAt: string; note: string | null }> = [];

  for (const loop of loops) {
    const { state, latest } = resolveLoopState(
      eventsByKey.get(loop.key) ?? [],
      now,
    );
    if (state === "muted" || state === "snoozed") continue;
    if (state === "closed" && latest) {
      closed.push({
        ...loop,
        closedAt: latest.created_at,
        note: latest.note,
      });
      continue;
    }
    open.push(loop);
  }

  return { open, closed };
}

export function groupEventsByKey(
  events: LoopEvent[],
): Map<string, LoopEvent[]> {
  const map = new Map<string, LoopEvent[]>();
  for (const event of events) {
    const list = map.get(event.loop_key) ?? [];
    list.push(event);
    map.set(event.loop_key, list);
  }
  return map;
}
