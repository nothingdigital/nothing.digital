import type { Metadata } from "next";
import Link from "next/link";

import { createWorkItemAction } from "@/app/admin/clients/actions";
import {
  AdminField,
  AdminFilterChip,
  adminControlClass,
  adminTextareaClass,
} from "@/components/admin/admin-form";
import { WorkStatusSelect } from "@/components/admin/client-ops-selects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  WORK_PRIORITIES,
  WORK_STATUSES,
  isWorkStatus,
  truncateText,
} from "@/lib/admin/client-ops";
import { listClients, listWorkItems } from "@/lib/admin/client-ops-queries";

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

  const [{ rows, error }, { rows: clients, error: clientsError }] =
    await Promise.all([listWorkItems({ status: statusFilter }), listClients()]);

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

      <form
        id="add-work"
        action={createWorkItemAction}
        className="max-w-xl space-y-3 rounded-lg border border-border bg-card p-4"
      >
        <h3 className="font-medium">Add work</h3>
        {clientsError ? (
          <p className="text-sm text-destructive">{clientsError}</p>
        ) : null}
        {clients.length === 0 && !clientsError ? (
          <p className="text-sm text-muted-foreground">
            No clients yet.{" "}
            <Link
              href="/admin/clients/new"
              className="text-primary underline-offset-4 hover:underline"
            >
              Create a client
            </Link>{" "}
            first.
          </p>
        ) : (
          <>
            <AdminField label="Client" htmlFor="client_id">
              <select
                id="client_id"
                name="client_id"
                required
                defaultValue=""
                className={adminControlClass}
              >
                <option value="" disabled>
                  Select a client
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Title" htmlFor="work-title">
              <Input id="work-title" name="title" required />
            </AdminField>
            <AdminField label="Description" htmlFor="description">
              <textarea
                id="description"
                name="description"
                className={adminTextareaClass}
              />
            </AdminField>
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminField label="Status" htmlFor="work-status">
                <select
                  id="work-status"
                  name="status"
                  defaultValue="backlog"
                  className={adminControlClass}
                >
                  {WORK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Priority" htmlFor="priority">
                <select
                  id="priority"
                  name="priority"
                  defaultValue="med"
                  className={adminControlClass}
                >
                  {WORK_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>
            <AdminField label="Due" htmlFor="due_at">
              <Input id="due_at" name="due_at" type="date" />
            </AdminField>
            <Button type="submit" size="sm">
              Add work
            </Button>
          </>
        )}
      </form>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <div className="space-y-2 rounded-lg border border-border bg-card px-4 py-5 text-sm">
          <p className="font-medium text-foreground">No work items.</p>
          <p className="text-muted-foreground">
            The Open filter excludes done items. Add work above, or create a
            client first if you don&apos;t have one yet.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/admin/clients"
              className="text-primary underline-offset-4 hover:underline"
            >
              View clients
            </Link>
            <Link
              href="/admin/clients/new"
              className="text-primary underline-offset-4 hover:underline"
            >
              New client
            </Link>
            <a
              href="#add-work"
              className="text-primary underline-offset-4 hover:underline"
            >
              Add work
            </a>
          </div>
        </div>
      ) : null}

      <ul className="space-y-3">
        {rows.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              {item.description ? (
                <p className="text-sm text-muted-foreground">
                  {truncateText(item.description)}
                </p>
              ) : null}
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
              <Link
                href={`/admin/clients/${item.client_id}/work/${item.id}/edit`}
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Edit
              </Link>
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
