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

Prerequisites: DNS records below must be added at your DNS provider (Cloudflare / Sav.com). This repo already generates `/sitemap.xml` and `/robots.txt`.

### DNS verification records

| Provider              | Type  | Name | Value                                                                  | Status        |
| --------------------- | ----- | ---- | ---------------------------------------------------------------------- | ------------- |
| Google Search Console | `TXT` | `@`  | `google-site-verification=HCvoYYwD9dDCDD8G1170_RhhsRb5SuGhFY6BTapwq5o` | present       |
| Bing Webmaster Tools  | `TXT` | `@`  | `REPLACE_ME`                                                           | pending token |

Paste the tokens from each dashboard and update the table above, then add the records.

### Google Search Console

1. Open <https://search.google.com/search-console>.
2. Choose **Domain** property and enter `nothing.digital`.
3. Copy the provided `TXT` verification record.
4. Add the `TXT` record on `@` in your DNS provider.
5. Click **Verify** in Search Console.
6. Go to **Sitemaps** → enter `https://nothing.digital/sitemap.xml` and submit.

### Bing Webmaster Tools

1. Open <https://www.bing.com/webmasters>.
2. Add site — use **Import from Google Search Console** if available, otherwise verify by DNS `TXT` record.
3. Submit sitemap `https://nothing.digital/sitemap.xml`.

### Verification checklist

- [ ] Google Search Console domain property verified (DNS token already in place)
- [ ] Bing Webmaster Tools site verified (add Bing-provided TXT record first)
- [ ] `https://nothing.digital/sitemap.xml` submitted to both

**Ready now:** sitemap serves `200` at `https://nothing.digital/sitemap.xml`. Google verification TXT is in DNS; Bing verification TXT is not yet added.

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

- Phase 6 plan: [`plans/05-pikapods-integrations.md`](../../plans/05-pikapods-integrations.md)
- DevOps checklist: [`plans/phase-3-devops-checklist.md`](../../plans/phase-3-devops-checklist.md)
- CSP allowlist: [`infra/cloudflare/security-headers.md`](../../infra/cloudflare/security-headers.md)
