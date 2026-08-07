# Monitoring Runbook

## Overview

Monitoring stack for Nothing.Digital:

| Layer        | Tool                              | Purpose                             | Status                      |
| ------------ | --------------------------------- | ----------------------------------- | --------------------------- |
| Uptime       | UptimeRobot                       | External HTTP checks + alerting     | ✅ Live                     |
| Analytics    | Umami (PikaPods) + Speed Insights | Owned traffic + Core Web Vitals     | ✅ Live                     |
| Errors       | Sentry                            | Error tracking + performance traces | ✅ Live (DSN + source maps) |
| Search index | Google Search Console + Bing      | Sitemap submission + indexing       | ✅ Runbook (manual setup)   |

## UptimeRobot

Plan: **UptimeRobot free** — 5-minute interval, 50 monitors, email alerts.

Monitors live:

| Monitor                    | Type    | URL                                  | Keyword | Interval | Status  |
| -------------------------- | ------- | ------------------------------------ | ------- | -------- | ------- |
| Nothing.Digital homepage   | HTTP(s) | `https://nothing.digital`            | —       | 5 min    | ✅ Live |
| Nothing.Digital API health | Keyword | `https://nothing.digital/api/health` | `ok`    | 5 min    | ✅ Live |

Alert contact: `alexander@nothing.digital`.

### Admin launcher

Optional env `UPTIMEROBOT_DASHBOARD_URL` deep-links the UptimeRobot dashboard from `/admin/health` and Settings. No API key — Open link only.

### Client asset monitor links

Paste a public UptimeRobot or Kuma status-page URL into a client asset’s **Monitor URL** field (`/admin/clients/{id}?tab=assets`). That opens from the Assets list as **monitor**. See [client-ops.md](./client-ops.md). No API key or webhook — plain URL only.

To add more monitors later:

1. Sign up / log in at <https://uptimerobot.com>.
2. Click **Add New Monitor**.
3. Set type, URL, interval, and alert contact.
4. Save and wait one interval.

## Umami

- Host: PikaPods → `https://analytics.nothing.digital`
- Env: `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `UMAMI_DASHBOARD_URL`
- App: `UmamiScript` + cookie consent; Speed Insights loads after Accept
- Vercel Web Analytics disabled; `@vercel/analytics` removed from app
- Verify: Accept cookies → pageview in Umami <30s; no Vercel Web Analytics requests

## Vercel Speed Insights

- Enable Speed Insights for Core Web Vitals (keep even after Umami)
- Targets:
  - LCP ≤ 2.5s
  - INP ≤ 200ms
  - CLS ≤ 0.1
  - TTFB ≤ 600ms

## Sentry

- DSN configured via `SENTRY_DSN` env var
- Source maps uploaded with `SENTRY_AUTH_TOKEN` (build secret)
- Alert rules:
  - New issue in `production` → Slack #alerts
  - Error rate > 1% in 5 min → PagerDuty on-call
  - First appearance of error → Email team lead

## Search engine submission

Sitemap: `https://nothing.digital/sitemap.xml` (200). **Setup + remaining Bing submit:** [ops-credentials.md](./ops-credentials.md) §3–4. **Weekly cadence:** [post-launch-monitoring.md](./post-launch-monitoring.md).

| Provider              | Status                               |
| --------------------- | ------------------------------------ |
| Google Search Console | Done (verified + sitemap 2026-08-07) |
| Bing Webmaster Tools  | Sitemap submit remaining             |

DNS TXT for GSC is on `@`. Bing TXT only if not importing from GSC — paste token into ops-credentials when used.

## Runbooks

### Site down

1. Check UptimeRobot + Vercel status page
2. Inspect Sentry for recent errors
3. If deployment caused it, roll back in Vercel dashboard
4. Post incident update in #incidents

### Error spike

1. Open Sentry → Issues → filter by `production`
2. Identify release/tag that introduced error
3. Revert offending PR or hotfix
4. Verify fix via Sentry resolved issues

## On-call

- Primary: DevOps Engineer
- Escalation: Engineering lead

## Related

- Live board: [`../../SCRATCHPAD.md`](../../SCRATCHPAD.md)
- Phase 6 plan: [`../../plans/05-pikapods-integrations.md`](../../plans/05-pikapods-integrations.md)
- Historical devops checklist: [`../../plans/archive/phase-3-devops-checklist.md`](../../plans/archive/phase-3-devops-checklist.md)
- CSP allowlist: [`../../infra/cloudflare/security-headers.md`](../../infra/cloudflare/security-headers.md)
