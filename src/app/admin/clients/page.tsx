import type { Metadata } from "next";
import Link from "next/link";

import { AdminFilterChip } from "@/components/admin/admin-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CLIENT_STATUSES, isClientStatus } from "@/lib/admin/client-ops";
import { listClients } from "@/lib/admin/client-ops-queries";

export const metadata: Metadata = {
  title: "Clients",
  robots: { index: false, follow: false },
};

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && isClientStatus(params.status) ? params.status : undefined;
  const q = params.q?.trim() || undefined;

  const { rows, error } = await listClients({ status: statusFilter, q });

  const querySuffix = q ? `&q=${encodeURIComponent(q)}` : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Clients</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Accounts you manage ({rows.length})
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">New client</Link>
        </Button>
      </div>

      <form className="flex flex-wrap gap-2" method="get">
        {statusFilter ? (
          <input type="hidden" name="status" value={statusFilter} />
        ) : null}
        <Input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, email, company"
          className="max-w-sm"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <AdminFilterChip
          href={
            q ? `/admin/clients?q=${encodeURIComponent(q)}` : "/admin/clients"
          }
          label="All"
          active={!statusFilter}
        />
        {CLIENT_STATUSES.map((status) => (
          <AdminFilterChip
            key={status}
            href={`/admin/clients?status=${status}${querySuffix}`}
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
        <p className="text-sm text-muted-foreground">No clients yet.</p>
      ) : null}

      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              href={`/admin/clients/${row.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-muted-foreground">
                  {row.company ? `${row.company} · ` : ""}
                  {row.primary_email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{row.status}</Badge>
                <Badge variant="outline">{row.billing_model}</Badge>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
