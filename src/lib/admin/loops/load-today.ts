import { listInvoices, listWorkItems } from "@/lib/admin/client-ops-queries";
import { collectLoops } from "@/lib/admin/loops/collect";
import {
  listCheckedChecklistKeys,
  listLoopEvents,
} from "@/lib/admin/loops/queries";
import type { LoopCollection } from "@/lib/admin/loops/types";
import { countLeadsByStatus } from "@/lib/admin/outbound/queries";
import { selectOverdueInvoices } from "@/lib/admin/ops-glance";
import { listContactSubmissions } from "@/lib/admin/queries";

export type TodayLoopsResult = {
  collection: LoopCollection;
  dataError: string | null;
  glance: {
    inbox: number | null;
    overdue: number | null;
    work: number | null;
  };
};

export async function loadTodayLoopCollection(): Promise<TodayLoopsResult> {
  const now = new Date();
  const [
    inbox,
    invoices,
    work,
    events,
    listmonkChecked,
    readyLeads,
    approvedLeads,
  ] = await Promise.all([
    listContactSubmissions("new"),
    listInvoices(),
    listWorkItems(),
    listLoopEvents(),
    listCheckedChecklistKeys("listmonk-drip"),
    countLeadsByStatus("ready"),
    countLeadsByStatus("approved"),
  ]);

  const readyLeadCount =
    (readyLeads.error ? 0 : readyLeads.count) +
    (approvedLeads.error ? 0 : approvedLeads.count);

  const collection = collectLoops({
    invoices: invoices.error ? [] : invoices.rows,
    inbox: inbox.error ? [] : inbox.rows,
    work: work.error ? [] : work.rows,
    readyLeadCount,
    checkedListmonkKeys: listmonkChecked.error ? [] : listmonkChecked.keys,
    events: events.error ? [] : events.rows,
    now,
  });

  const dataError =
    inbox.error ||
    invoices.error ||
    work.error ||
    events.error ||
    listmonkChecked.error ||
    readyLeads.error ||
    approvedLeads.error ||
    null;

  return {
    collection,
    dataError,
    glance: {
      inbox: inbox.error ? null : inbox.rows.length,
      overdue: invoices.error
        ? null
        : selectOverdueInvoices(invoices.rows, now).length,
      work: work.error ? null : work.rows.length,
    },
  };
}
