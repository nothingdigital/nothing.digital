import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminEmails, getAdminToolLinks } from "@/lib/admin/config";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  await requireAdmin();
  const tools = getAdminToolLinks();
  const adminEmails = getAdminEmails();

  const rows = [
    {
      key: "ADMIN_EMAILS",
      value: adminEmails.length ? adminEmails.join(", ") : "not set",
    },
    {
      key: "NEXT_PUBLIC_SITE_URL",
      value: tools.site,
    },
    {
      key: "NEXT_PUBLIC_CALENDLY_URL",
      value: tools.calendly ?? "not set",
    },
    {
      key: "NEXT_PUBLIC_UMAMI_DASHBOARD_URL",
      value: tools.umami ?? "not set",
    },
    {
      key: "Supabase URL",
      value: env.public.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
    },
    {
      key: "Service role",
      value: env.private.SUPABASE_SERVICE_ROLE_KEY ? "configured" : "missing",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tool registry from env — edit in Vercel, not here.
        </p>
      </div>
      <dl className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="rounded-lg border border-border px-4 py-3"
          >
            <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {row.key}
            </dt>
            <dd className="mt-1 break-all text-sm">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
