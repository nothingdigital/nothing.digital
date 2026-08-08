import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateAssetAction } from "@/app/admin/clients/actions";
import {
  AdminField,
  adminControlClass,
  adminTextareaClass,
} from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ASSET_ENVS,
  ASSET_STATUSES,
  ASSET_TYPES,
} from "@/lib/admin/client-ops";
import { getClient, getClientAsset } from "@/lib/admin/client-ops-queries";

export const metadata: Metadata = {
  title: "Edit asset",
  robots: { index: false, follow: false },
};

export default async function AdminEditAssetPage({
  params,
}: {
  params: Promise<{ id: string; assetId: string }>;
}) {
  const { id, assetId } = await params;
  const [{ row: client, error: clientError }, { row: asset, error }] =
    await Promise.all([getClient(id), getClientAsset(assetId)]);

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

  if (!asset || asset.client_id !== id) {
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
            href={`/admin/clients/${id}?tab=assets`}
            className="underline-offset-4 hover:underline"
          >
            {client.name}
          </Link>{" "}
          / Edit asset
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
          Edit asset
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          To retire, set status to retired (assets are not deleted).
        </p>
      </div>

      <form action={updateAssetAction} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={asset.id} />
        <input type="hidden" name="client_id" value={id} />
        <AdminField label="Name" htmlFor="name">
          <Input id="name" name="name" required defaultValue={asset.name} />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-3">
          <AdminField label="Type" htmlFor="type">
            <select
              id="type"
              name="type"
              defaultValue={asset.type}
              className={adminControlClass}
            >
              {ASSET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Env" htmlFor="env">
            <select
              id="env"
              name="env"
              defaultValue={asset.env}
              className={adminControlClass}
            >
              {ASSET_ENVS.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={asset.status}
              className={adminControlClass}
            >
              {ASSET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </AdminField>
        </div>
        <AdminField label="URL" htmlFor="url">
          <Input
            id="url"
            name="url"
            type="url"
            defaultValue={asset.url ?? ""}
            placeholder="https://"
          />
        </AdminField>
        <AdminField
          label="Monitor URL (UptimeRobot / Kuma status page)"
          htmlFor="monitor_url"
        >
          <Input
            id="monitor_url"
            name="monitor_url"
            type="url"
            defaultValue={asset.monitor_url ?? ""}
            placeholder="https://"
          />
        </AdminField>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="managed_by_us"
            defaultChecked={asset.managed_by_us}
            className="size-4 rounded border-input"
          />
          Managed by us
        </label>
        <AdminField label="Notes" htmlFor="notes">
          <textarea
            id="notes"
            name="notes"
            className={adminTextareaClass}
            defaultValue={asset.notes ?? ""}
          />
        </AdminField>
        <Button type="submit">Save asset</Button>
      </form>
    </div>
  );
}
