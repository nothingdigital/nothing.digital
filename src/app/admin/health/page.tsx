import type { Metadata } from "next";

import { AdminChecklist } from "@/components/admin/admin-checklist";
import { Badge } from "@/components/ui/badge";
import { getAdminToolLinks } from "@/lib/admin/config";
import {
  HEALTH_INTEGRATION_KEYS,
  INTEGRATION_LABELS,
  parseHealthPayload,
} from "@/lib/admin/health";
import { listCheckedChecklistKeys } from "@/lib/admin/loops/queries";
import { LISTMONK_DRIP_ITEMS } from "@/lib/admin/loops/rules/runbook-setup";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Health",
  robots: { index: false, follow: false },
};

export default async function AdminHealthPage() {
  const tools = getAdminToolLinks();
  const healthUrl = `${siteConfig.url}/api/health`;

  let healthLabel = "unreachable";
  let health = parseHealthPayload(null);

  try {
    const response = await fetch(healthUrl, { cache: "no-store" });
    healthLabel = response.ok
      ? `ok (${response.status})`
      : `fail (${response.status})`;
    if (response.ok) {
      health = parseHealthPayload(await response.json());
    }
  } catch {
    healthLabel = "unreachable";
  }

  const checklist = await listCheckedChecklistKeys("listmonk-drip");
  const listmonkConfigured = health.integrations.listmonk;

  const links = [
    { label: "API health", href: healthUrl, note: healthLabel },
    {
      label: "Umami",
      href: tools.umami,
      note: tools.umami ? "configured" : "env missing",
    },
    {
      label: "Listmonk",
      href: tools.listmonk,
      note: tools.listmonk ? "configured" : "env missing",
    },
    {
      label: "Instantly",
      href: tools.instantly,
      note: "cold outbound",
    },
    {
      label: "n8n",
      href: tools.n8n,
      note: tools.n8n ? "configured" : "env missing",
    },
    {
      label: "UptimeRobot",
      href: tools.uptimerobot,
      note: tools.uptimerobot ? "configured" : "env missing",
    },
    {
      label: "Uptime Kuma",
      href: tools.kuma,
      note: tools.kuma ? "configured" : "env missing",
    },
    {
      label: "Calendly",
      href: tools.calendly,
      note: tools.calendly ? "configured" : "env missing",
    },
    { label: "Vercel", href: tools.vercel, note: "dashboard" },
    { label: "Sentry", href: tools.sentry, note: "dashboard" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Health</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Env-presence chips from /api/health — not live uptime. Dashboards stay
          Open links (no charts or iframes).
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Integrations
        </h3>
        {!health.ok ? (
          <p className="text-sm text-muted-foreground">
            Could not read integration flags ({healthLabel}).
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {HEALTH_INTEGRATION_KEYS.map((key) => {
            const configured = health.integrations[key];
            return (
              <Badge key={key} variant={configured ? "default" : "outline"}>
                {INTEGRATION_LABELS[key]}:{" "}
                {configured ? "configured" : "missing"}
              </Badge>
            );
          })}
        </div>
      </section>

      {listmonkConfigured ? (
        <section
          id="listmonk-drip"
          className="space-y-3 rounded-lg border border-border bg-card px-4 py-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">Listmonk drip setup</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Persistent checklist — Listmonk stays the source of truth.
              </p>
            </div>
            {tools.listmonk ? (
              <a
                href={tools.listmonk}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Open Listmonk ↗
              </a>
            ) : null}
          </div>
          {checklist.error ? (
            <p className="text-sm text-destructive" role="alert">
              {checklist.error}
            </p>
          ) : (
            <AdminChecklist
              checklistKey="listmonk-drip"
              items={LISTMONK_DRIP_ITEMS}
              checkedKeys={checklist.keys}
            />
          )}
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Tools
        </h3>
        <ul className="space-y-3">
          {links.map((link) => (
            <li
              key={link.label}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-4 py-3"
            >
              <div>
                <p className="font-medium">{link.label}</p>
                <p className="text-sm text-muted-foreground">{link.note}</p>
              </div>
              {link.href ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  Open
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
