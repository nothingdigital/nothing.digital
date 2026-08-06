import type { Metadata } from "next";
import Link from "next/link";

import { AdminFilterChip } from "@/components/admin/admin-form";
import { WorkStatusSelect } from "@/components/admin/client-ops-selects";
import { Badge } from "@/components/ui/badge";
import { WORK_STATUSES, isWorkStatus } from "@/lib/admin/client-ops";
import { listWorkItems } from "@/lib/admin/client-ops-queries";

export const metadata: Metadata = {
  title: "Work",
  robots: { index: false, follow: false },
};

export default async function AdminWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && isWorkStatus(params.status) ? params.status : undefined;

  const { rows, error } = await listWorkItems({ status: statusFilter });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Work</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Open items across clients ({rows.length})
          {!statusFilter ? " — excluding done" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <AdminFilterChip
          href="/admin/work"
          label="Open"
          active={!statusFilter}
        />
        {WORK_STATUSES.map((status) => (
          <AdminFilterChip
            key={status}
            href={`/admin/work?status=${status}`}
            label={status}
            active={statusFilter === status}
          />
        ))}
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <p className="text-sm text-muted-foreground">No work items.</p>
      ) : null}

      <ul className="space-y-3">
        {rows.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                <Link
                  href={`/admin/clients/${item.client_id}?tab=work`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {item.clients?.name ?? "Client"}
                </Link>
                {" · "}
                {item.priority}
                {item.due_at
                  ? ` · due ${new Date(item.due_at).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{item.status}</Badge>
              <WorkStatusSelect
                id={item.id}
                status={item.status}
                clientId={item.client_id}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
