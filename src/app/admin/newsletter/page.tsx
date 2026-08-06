import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { listNewsletterSubscribers } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  await requireAdmin();
  const { rows, error } = await listNewsletterSubscribers();
  const active = rows.filter((row) => !row.unsubscribed_at);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Newsletter</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {active.length} active / {rows.length} total
        </p>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
