import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  createAssetAction,
  createWorkItemAction,
  updateClientAction,
} from "@/app/admin/clients/actions";
import {
  AdminField,
  adminControlClass,
  adminTextareaClass,
} from "@/components/admin/admin-form";
import {
  AssetStatusSelect,
  InvoiceStatusSelect,
  WorkStatusSelect,
} from "@/components/admin/client-ops-selects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ASSET_ENVS,
  ASSET_STATUSES,
  ASSET_TYPES,
  BILLING_MODELS,
  CLIENT_STATUSES,
  WORK_PRIORITIES,
  WORK_STATUSES,
  effectiveInvoiceStatus,
  formatCents,
  openBalanceCents,
  truncateText,
} from "@/lib/admin/client-ops";
import {
  getClient,
  listClientAssets,
  listClientInvoices,
  listClientWorkItems,
} from "@/lib/admin/client-ops-queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Client",
  robots: { index: false, follow: false },
};

const TABS = ["overview", "billing", "assets", "work"] as const;
type Tab = (typeof TABS)[number];

function isTab(value: string | undefined): value is Tab {
  return Boolean(value && (TABS as readonly string[]).includes(value));
}

export default async function AdminClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const tab: Tab = isTab(sp.tab) ? sp.tab : "overview";

  const { row: client, error } = await getClient(id);
  if (!client) {
    if (error) {
      return (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      );
    }
    notFound();
  }

  const [invoicesResult, assetsResult, workResult] = await Promise.all([
    listClientInvoices(id),
    listClientAssets(id),
    listClientWorkItems(id),
  ]);

  const invoices = invoicesResult.rows;
  const assets = assetsResult.rows;
  const workItems = workResult.rows;
  const balance = openBalanceCents(invoices);
  const paid = invoices
    .filter((invoice) => invoice.status === "paid")
    .sort((a, b) => (b.paid_at ?? "").localeCompare(a.paid_at ?? ""));
  const nextDue = invoices
    .filter((invoice) => {
      const status = effectiveInvoiceStatus(invoice);
      return status !== "paid" && status !== "void" && invoice.due_at;
    })
    .sort((a, b) => (a.due_at ?? "").localeCompare(b.due_at ?? ""))[0];

  const updateAction = updateClientAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link
              href="/admin/clients"
              className="underline-offset-4 hover:underline"
            >
              Clients
            </Link>{" "}
            / {client.name}
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">
            {client.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{client.status}</Badge>
            <Badge variant="outline">{client.billing_model}</Badge>
          </div>
        </div>
        <div className="rounded-lg border border-border px-4 py-3 text-sm">
          <p>
            Open balance:{" "}
            <span className="font-medium">{formatCents(balance)}</span>
          </p>
          <p className="text-muted-foreground">
            Last paid:{" "}
            {paid[0]?.paid_at
              ? new Date(paid[0].paid_at).toLocaleDateString()
              : "—"}
          </p>
          <p className="text-muted-foreground">
            Next due:{" "}
            {nextDue?.due_at
              ? `${formatCents(nextDue.amount_cents)} · ${new Date(nextDue.due_at).toLocaleDateString()}`
              : "—"}
          </p>
        </div>
      </div>

      <nav className="flex flex-wrap gap-1 border-b border-border pb-2">
        {TABS.map((item) => (
          <Link
            key={item}
            href={`/admin/clients/${id}?tab=${item}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              tab === item
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item}
          </Link>
        ))}
      </nav>

      {tab === "overview" ? (
        <form action={updateAction} className="max-w-xl space-y-4">
          <AdminField label="Name" htmlFor="name">
            <Input id="name" name="name" defaultValue={client.name} required />
          </AdminField>
          <AdminField label="Primary email" htmlFor="primary_email">
            <Input
              id="primary_email"
              name="primary_email"
              type="email"
              defaultValue={client.primary_email}
              required
            />
          </AdminField>
          <AdminField label="Company" htmlFor="company">
            <Input
              id="company"
              name="company"
              defaultValue={client.company ?? ""}
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Status" htmlFor="status">
              <select
                id="status"
                name="status"
                defaultValue={client.status}
                className={adminControlClass}
              >
                {CLIENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Billing model" htmlFor="billing_model">
              <select
                id="billing_model"
                name="billing_model"
                defaultValue={client.billing_model}
                className={adminControlClass}
              >
                {BILLING_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Default rate (USD)" htmlFor="default_rate">
              <Input
                id="default_rate"
                name="default_rate"
                defaultValue={
                  client.default_rate_cents != null
                    ? (client.default_rate_cents / 100).toFixed(2)
                    : ""
                }
                inputMode="decimal"
              />
            </AdminField>
            <AdminField label="Payment terms" htmlFor="payment_terms">
              <Input
                id="payment_terms"
                name="payment_terms"
                defaultValue={client.payment_terms ?? "net_15"}
              />
            </AdminField>
          </div>
          <AdminField label="Notes" htmlFor="notes">
            <textarea
              id="notes"
              name="notes"
              className={adminTextareaClass}
              defaultValue={client.notes ?? ""}
            />
          </AdminField>
          <Button type="submit">Save client</Button>
        </form>
      ) : null}

      {tab === "billing" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button asChild>
              <Link href={`/admin/clients/${id}/invoices/new`}>
                New invoice
              </Link>
            </Button>
          </div>
          {invoicesResult.error ? (
            <p className="text-sm text-destructive">{invoicesResult.error}</p>
          ) : null}
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          ) : null}
          <ul className="space-y-3">
            {invoices.map((invoice) => {
              const display = effectiveInvoiceStatus(invoice);
              return (
                <li
                  key={invoice.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {invoice.number} · {invoice.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCents(invoice.amount_cents, invoice.currency)}
                      {invoice.due_at
                        ? ` · due ${new Date(invoice.due_at).toLocaleDateString()}`
                        : ""}
                      {invoice.external_url ? (
                        <>
                          {" · "}
                          <a
                            href={invoice.external_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            PDF / link
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/clients/${id}/invoices/${invoice.id}/edit`}
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Edit
                    </Link>
                    <Badge
                      variant={
                        display === "overdue" ? "destructive" : "secondary"
                      }
                    >
                      {display}
                    </Badge>
                    <InvoiceStatusSelect
                      id={invoice.id}
                      status={invoice.status}
                      clientId={id}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {tab === "assets" ? (
        <div className="space-y-6">
          <form
            action={createAssetAction}
            className="max-w-xl space-y-3 rounded-lg border border-border p-4"
          >
            <input type="hidden" name="client_id" value={id} />
            <h3 className="font-medium">Add asset</h3>
            <AdminField label="Name" htmlFor="asset-name">
              <Input id="asset-name" name="name" required />
            </AdminField>
            <div className="grid gap-3 sm:grid-cols-3">
              <AdminField label="Type" htmlFor="type">
                <select
                  id="type"
                  name="type"
                  defaultValue="website"
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
                  defaultValue="prod"
                  className={adminControlClass}
                >
                  {ASSET_ENVS.map((env) => (
                    <option key={env} value={env}>
                      {env}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Status" htmlFor="asset-status">
                <select
                  id="asset-status"
                  name="status"
                  defaultValue="active"
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
              <Input id="url" name="url" type="url" placeholder="https://" />
            </AdminField>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="managed_by_us"
                defaultChecked
                className="size-4 rounded border-input"
              />
              Managed by us
            </label>
            <AdminField label="Notes" htmlFor="asset-notes">
              <textarea
                id="asset-notes"
                name="notes"
                className={adminTextareaClass}
              />
            </AdminField>
            <Button type="submit" size="sm">
              Add asset
            </Button>
          </form>

          {assetsResult.error ? (
            <p className="text-sm text-destructive">{assetsResult.error}</p>
          ) : null}
          {assets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assets yet.</p>
          ) : null}
          <ul className="space-y-3">
            {assets.map((asset) => (
              <li
                key={asset.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.type} · {asset.env}
                    {asset.managed_by_us ? " · managed" : " · not managed"}
                    {asset.url ? (
                      <>
                        {" · "}
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          open
                        </a>
                      </>
                    ) : null}
                  </p>
                </div>
                <AssetStatusSelect
                  id={asset.id}
                  status={asset.status}
                  clientId={id}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === "work" ? (
        <div className="space-y-6">
          <form
            action={createWorkItemAction}
            className="max-w-xl space-y-3 rounded-lg border border-border p-4"
          >
            <input type="hidden" name="client_id" value={id} />
            <h3 className="font-medium">Add work item</h3>
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
            <div className="grid gap-3 sm:grid-cols-3">
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
              <AdminField label="Asset" htmlFor="asset_id">
                <select
                  id="asset_id"
                  name="asset_id"
                  defaultValue=""
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
              <Input id="due_at" name="due_at" type="date" />
            </AdminField>
            <Button type="submit" size="sm">
              Add work
            </Button>
          </form>

          {workResult.error ? (
            <p className="text-sm text-destructive">{workResult.error}</p>
          ) : null}
          {workItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No work items yet.</p>
          ) : null}
          <ul className="space-y-3">
            {workItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.description ? (
                    <p className="text-sm text-muted-foreground">
                      {truncateText(item.description)}
                    </p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">
                    {item.priority}
                    {item.due_at
                      ? ` · due ${new Date(item.due_at).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/clients/${id}/work/${item.id}/edit`}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Edit
                  </Link>
                  <WorkStatusSelect
                    id={item.id}
                    status={item.status}
                    clientId={id}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
