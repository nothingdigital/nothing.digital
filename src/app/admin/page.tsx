import type { Metadata } from "next";
import Link from "next/link";

import { LoopList, RecentlyClosedLoops } from "@/components/admin/loop-list";
import { listInvoices, listWorkItems } from "@/lib/admin/client-ops-queries";
import { collectLoops } from "@/lib/admin/loops/collect";
import {
  listCheckedChecklistKeys,
  listLoopEvents,
} from "@/lib/admin/loops/queries";
import { countLeadsByStatus } from "@/lib/admin/outbound/queries";
import { countOverdueInvoices } from "@/lib/admin/ops-glance";
import { listContactSubmissions } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Home",
  robots: { index: false, follow: false },
};

const glanceCards = [
  {
    key: "inbox" as const,
    label: "New inbox",
    href: "/admin/inbox?status=new",
    hint: "Contact submissions waiting triage",
  },
  {
    key: "overdue" as const,
    label: "Overdue invoices",
    href: "/admin/billing?overdue=1",
    hint: "Past due or marked overdue",
  },
  {
    key: "work" as const,
    label: "Open work",
    href: "/admin/work",
    hint: "Work items not marked done",
  },
] as const;

export default async function AdminIndexPage() {
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

  const counts: Record<(typeof glanceCards)[number]["key"], number | null> = {
    inbox: inbox.error ? null : inbox.rows.length,
    overdue: invoices.error ? null : countOverdueInvoices(invoices.rows, now),
    work: work.error ? null : work.rows.length,
  };

  const dataError =
    inbox.error ||
    invoices.error ||
    work.error ||
    events.error ||
    listmonkChecked.error ||
    readyLeads.error ||
    approvedLeads.error;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Today</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Open loops first — then the glance counts you already use.
        </p>
      </div>

      {dataError ? (
        <p className="text-sm text-destructive" role="alert">
          {dataError}
        </p>
      ) : null}

      <section className="space-y-3">
        <LoopList
          loops={collection.open}
          emptyMessage="All caught up. Nothing needs you right now."
        />
        <RecentlyClosedLoops loops={collection.recentlyClosed} />
        {collection.later.length > 0 ? (
          <details className="rounded-lg border border-border px-4 py-3 text-sm">
            <summary className="cursor-pointer text-muted-foreground">
              Later this week ({collection.later.length})
            </summary>
            <div className="mt-3">
              <LoopList
                loops={collection.later}
                emptyMessage="Nothing later."
              />
            </div>
          </details>
        ) : null}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Glance</h3>
        <ul className="grid gap-3 sm:grid-cols-3">
          {glanceCards.map((card) => (
            <li key={card.key}>
              <Link
                href={card.href}
                className="block rounded-lg border border-border bg-card px-4 py-5 transition-colors hover:bg-muted/40"
              >
                <p className="text-sm font-medium text-foreground">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-4xl tracking-tight tabular-nums">
                  {counts[card.key] === null ? "—" : counts[card.key]}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {card.hint}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
