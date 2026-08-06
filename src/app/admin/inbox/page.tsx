import type { Metadata } from "next";
import Link from "next/link";

import { StatusSelect } from "@/components/admin/status-select";
import { Badge } from "@/components/ui/badge";
import { INBOX_STATUSES, isInboxStatus } from "@/lib/admin/config";
import { listContactSubmissions } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && isInboxStatus(params.status) ? params.status : undefined;

  const { rows, error } = await listContactSubmissions(statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Inbox</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Triage contact submissions ({rows.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip href="/admin/inbox" label="All" active={!statusFilter} />
          {INBOX_STATUSES.map((status) => (
            <FilterChip
              key={status}
              href={`/admin/inbox?status=${status}`}
              label={status}
              active={statusFilter === status}
            />
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <p className="text-sm text-muted-foreground">No submissions yet.</p>
      ) : null}

      <ul className="space-y-4">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.name}</p>
                <a
                  href={`mailto:${row.email}`}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  {row.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{row.status}</Badge>
                <StatusSelect id={row.id} status={row.status} />
              </div>
            </div>
            <dl className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <dt className="inline font-medium text-foreground">
                  Service:{" "}
                </dt>
                <dd className="inline">{row.service ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">
                  Company:{" "}
                </dt>
                <dd className="inline">{row.company ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">When: </dt>
                <dd className="inline">
                  {new Date(row.created_at).toLocaleString()}
                </dd>
              </div>
            </dl>
            <p className="mt-3 whitespace-pre-wrap text-sm">{row.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
          : "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      }
    >
      {label}
    </Link>
  );
}
