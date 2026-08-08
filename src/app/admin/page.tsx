import type { Metadata } from "next";
import Link from "next/link";

import { LoopList, RecentlyClosedLoops } from "@/components/admin/loop-list";
import { OpsBriefPanel } from "@/components/admin/ops-brief-panel";
import { loadTodayLoopCollection } from "@/lib/admin/loops/load-today";
import { isAiEnabled } from "@/lib/ai";

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
  const { collection, dataError, glance } = await loadTodayLoopCollection();

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

      {isAiEnabled() ? <OpsBriefPanel /> : null}

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
                  {glance[card.key] === null ? "—" : glance[card.key]}
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
