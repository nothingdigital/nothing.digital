import type { Metadata } from "next";

import { getAdminToolLinks } from "@/lib/admin/config";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Health",
  robots: { index: false, follow: false },
};

export default async function AdminHealthPage() {
  const tools = getAdminToolLinks();
  const healthUrl = `${siteConfig.url}/api/health`;

  let healthLabel = "unreachable";
  try {
    const response = await fetch(healthUrl, { cache: "no-store" });
    healthLabel = response.ok
      ? `ok (${response.status})`
      : `fail (${response.status})`;
  } catch {
    healthLabel = "unreachable";
  }

  const links = [
    { label: "API health", href: healthUrl, note: healthLabel },
    {
      label: "Umami",
      href: tools.umami,
      note: tools.umami ? "configured" : "env missing",
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
          Quick links — no reimplemented charts.
        </p>
      </div>
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
    </div>
  );
}
