import type { Metadata } from "next";

import { getAdminEmails, getAdminToolLinks } from "@/lib/admin/config";
import {
  isInboxDraftsEnabled,
  isInvoiceCoverEnabled,
  isOpsBriefEnabled,
  isOutboundPersonalizationEnabled,
} from "@/lib/ai";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
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
      key: "CALENDLY_URL",
      value: tools.calendly ?? "not set",
    },
    {
      key: "UMAMI_DASHBOARD_URL",
      value: tools.umami ?? "not set",
    },
    {
      key: "LISTMONK_DASHBOARD_URL",
      value: tools.listmonk ?? "not set",
    },
    {
      key: "N8N_DASHBOARD_URL",
      value: tools.n8n ?? "not set",
    },
    {
      key: "KUMA_DASHBOARD_URL",
      value: tools.kuma ?? "not set",
    },
    {
      key: "UPTIMEROBOT_DASHBOARD_URL",
      value: tools.uptimerobot ?? "not set",
    },
    {
      key: "LISTMONK subscribe",
      value:
        env.private.LISTMONK_URL && env.private.LISTMONK_LIST_UUID
          ? "configured"
          : "not set (using Supabase)",
    },
    {
      key: "N8N_WEBHOOK_URL",
      value: env.private.N8N_WEBHOOK_URL ? "configured" : "not set",
    },
    {
      key: "Supabase URL",
      value: env.public.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
    },
    {
      key: "Service role",
      value: env.private.SUPABASE_SERVICE_ROLE_KEY ? "configured" : "missing",
    },
    {
      key: "AI_GATEWAY_API_KEY",
      value: env.private.AI_GATEWAY_API_KEY ? "configured" : "not set",
    },
    {
      key: "AI_INBOX_DRAFTS_ENABLED",
      value: isInboxDraftsEnabled() ? "on" : "off",
    },
    {
      key: "AI_OPS_BRIEF_ENABLED",
      value: isOpsBriefEnabled() ? "on" : "off",
    },
    {
      key: "AI_INVOICE_COVER_ENABLED",
      value: isInvoiceCoverEnabled() ? "on" : "off",
    },
    {
      key: "AI_OUTBOUND_PERSONALIZATION_ENABLED",
      value: isOutboundPersonalizationEnabled() ? "on" : "off",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tool registry from env — edit in Vercel, not here. AI flags show
          effective state (gateway key + flag).
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
