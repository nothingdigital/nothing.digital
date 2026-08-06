# Monitoring Runbook

## Overview

Monitoring stack for Nothing.Digital:

| Layer     | Tool                              | Purpose                             | Status                                |
| --------- | --------------------------------- | ----------------------------------- | ------------------------------------- |
| Uptime    | UptimeRobot                       | External HTTP checks + alerting     | ⬜ Ops                                |
| Analytics | Umami (PikaPods) + Speed Insights | Owned traffic + Core Web Vitals     | 🟡 Code ready; Umami pod/DNS/env open |
| Errors    | Sentry                            | Error tracking + performance traces | 🟡 Code present; confirm env          |

## UptimeRobot

- URL: `https://nothing.digital`
- Interval: 1 minute
- Alert channels: Email + Slack (#alerts)
- Expected response: `200 OK` from Vercel edge

## Umami

- Host: PikaPods → `https://analytics.nothing.digital`
- Env: `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `UMAMI_DASHBOARD_URL`
- App: `UmamiScript` + cookie consent; Speed Insights always loads after Accept
- Until Umami env is set, layout falls back to Vercel Analytics
- Cutover checklist:
  1. Create pod + DNS
  2. Set Vercel env + redeploy
  3. Accept cookies → confirm pageview in Umami <30s
  4. Disable Vercel Web Analytics (dashboard) + remove `@vercel/analytics` when stable

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
