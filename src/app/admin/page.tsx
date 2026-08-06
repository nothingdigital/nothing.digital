import type { Metadata } from "next";
import Link from "next/link";

import { listInvoices, listWorkItems } from "@/lib/admin/client-ops-queries";
import { countOverdueInvoices } from "@/lib/admin/ops-glance";
import { listContactSubmissions } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Home",
  robots: { index: false, follow: false },
};

const cards = [
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
  const [inbox, invoices, work] = await Promise.all([
    listContactSubmissions("new"),
    listInvoices(),
    listWorkItems(),
  ]);

  const now = new Date();
  const counts: Record<(typeof cards)[number]["key"], number | null> = {
    inbox: inbox.error ? null : inbox.rows.length,
    overdue: invoices.error ? null : countOverdueInvoices(invoices.rows, now),
    work: work.error ? null : work.rows.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Home</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ops glance — counts into the lists you already use.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
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
              <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
