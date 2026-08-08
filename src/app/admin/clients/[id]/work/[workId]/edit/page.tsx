import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deleteWorkItemAction,
  updateWorkItemAction,
} from "@/app/admin/clients/actions";
import {
  AdminField,
  adminControlClass,
  adminTextareaClass,
} from "@/components/admin/admin-form";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WORK_PRIORITIES, WORK_STATUSES } from "@/lib/admin/client-ops";
import {
  getClient,
  getWorkItem,
  listClientAssets,
} from "@/lib/admin/client-ops-queries";

export const metadata: Metadata = {
  title: "Edit work item",
  robots: { index: false, follow: false },
};

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export default async function AdminEditWorkItemPage({
  params,
}: {
  params: Promise<{ id: string; workId: string }>;
}) {
  const { id, workId } = await params;
  const [
    { row: client, error: clientError },
    { row: item, error },
    { rows: assets },
  ] = await Promise.all([
    getClient(id),
    getWorkItem(workId),
    listClientAssets(id),
  ]);

  if (!client) {
    if (clientError) {
      return (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {clientError}
        </p>
      );
    }
    notFound();
  }

  if (!item || item.client_id !== id) {
    if (error) {
      return (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      );
    }
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/admin/clients"
            className="underline-offset-4 hover:underline"
          >
            Clients
          </Link>{" "}
          /{" "}
          <Link
            href={`/admin/clients/${id}?tab=work`}
            className="underline-offset-4 hover:underline"
          >
            {client.name}
          </Link>{" "}
          / Edit work
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
          Edit work item
        </h2>
      </div>

      <form action={updateWorkItemAction} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="client_id" value={id} />
        <AdminField label="Title" htmlFor="title">
          <Input id="title" name="title" defaultValue={item.title} required />
        </AdminField>
        <AdminField label="Description" htmlFor="description">
          <textarea
            id="description"
            name="description"
            className={adminTextareaClass}
            defaultValue={item.description ?? ""}
          />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-3">
          <AdminField label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={item.status}
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
              defaultValue={item.priority}
              className={adminControlClass}
            >
              {WORK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Asset" htmlFor="asset_id">
            <select
              id="asset_id"
              name="asset_id"
              defaultValue={item.asset_id ?? ""}
              className={adminControlClass}
            >
              <option value="">None</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </AdminField>
        </div>
        <AdminField label="Due" htmlFor="due_at">
          <Input
            id="due_at"
            name="due_at"
            type="date"
            defaultValue={toDateInputValue(item.due_at)}
          />
        </AdminField>
        <Button type="submit">Save work item</Button>
      </form>

      <form
        action={deleteWorkItemAction}
        className="max-w-xl rounded-lg border border-destructive/30 p-4"
      >
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="client_id" value={id} />
        <p className="mb-3 text-sm text-muted-foreground">
          Permanently remove this work item. This cannot be undone.
        </p>
        <ConfirmSubmitButton message="Delete this work item?">
          Delete work item
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
