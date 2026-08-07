import type { Metadata } from "next";
import Link from "next/link";

import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { getAdminToolLinks } from "@/lib/admin/config";
import { listNewsletterSubscribers } from "@/lib/admin/queries";

import { unsubscribeNewsletterAction } from "./actions";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  const { rows, error } = await listNewsletterSubscribers();
  const active = rows.filter((row) => !row.unsubscribed_at);
  const tools = getAdminToolLinks();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Newsletter</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {active.length} active / {rows.length} total
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Supabase is the admin list mirror; Listmonk remains campaign source
            of truth. Unsubscribing here does not sync to Listmonk.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/newsletter/export"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Export CSV
          </Link>
          {tools.listmonk ? (
            <a
              href={tools.listmonk}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Open Listmonk
            </a>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <p className="text-sm text-muted-foreground">No subscribers yet.</p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Subscribed</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">{row.email}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {new Date(row.subscribed_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  {row.unsubscribed_at ? "Unsubscribed" : "Active"}
                </td>
                <td className="px-3 py-2">
                  {!row.unsubscribed_at ? (
                    <form action={unsubscribeNewsletterAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <ConfirmSubmitButton message="Mark unsubscribed in Supabase only? This does not remove them from Listmonk.">
                        Unsubscribe
                      </ConfirmSubmitButton>
                    </form>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
