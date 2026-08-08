import { applyEventsToLoops, groupEventsByKey } from "./state";
import { attentionWorkLoops, type AttentionWorkInput } from "./rules/open-work";
import { outboundCadenceLoop } from "./rules/outbound-cadence";
import {
  overdueInvoiceLoops,
  type OverdueInvoiceInput,
} from "./rules/overdue-invoices";
import {
  LISTMONK_DRIP_ITEMS,
  runbookSetupLoops,
  uncheckedChecklistKeys,
} from "./rules/runbook-setup";
import { staleInboxLoops, type StaleInboxInput } from "./rules/stale-inbox";
import {
  RECENTLY_CLOSED_MS,
  TODAY_VISIBLE_CAP,
  type LoopCollection,
  type LoopEvent,
} from "./types";

export type CollectLoopsInput = {
  invoices: OverdueInvoiceInput[];
  inbox: StaleInboxInput[];
  work: AttentionWorkInput[];
  readyLeadCount: number;
  checkedListmonkKeys: string[];
  events: LoopEvent[];
  now?: Date;
  visibleCap?: number;
};

export function collectLoops(input: CollectLoopsInput): LoopCollection {
  const now = input.now ?? new Date();
  const cap = input.visibleCap ?? TODAY_VISIBLE_CAP;
  const unchecked = uncheckedChecklistKeys(
    LISTMONK_DRIP_ITEMS,
    input.checkedListmonkKeys,
  );
  const candidates = [
    ...overdueInvoiceLoops(input.invoices, now),
    ...staleInboxLoops(input.inbox, now),
    ...attentionWorkLoops(input.work, now),
    outboundCadenceLoop(now, input.readyLeadCount),
    ...runbookSetupLoops(unchecked),
  ].sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title));

  const { open, closed } = applyEventsToLoops(
    candidates,
    groupEventsByKey(input.events),
    now,
  );

  const recentlyClosed = closed.filter(
    (loop) =>
      now.getTime() - new Date(loop.closedAt).getTime() <= RECENTLY_CLOSED_MS,
  );

  return {
    open: open.slice(0, cap),
    later: open.slice(cap),
    recentlyClosed,
  };
}
