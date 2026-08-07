# Post-Launch Monitoring Runbook — Nothing.Digital

> **Owner:** QA + DevOps  
> **Cadence:** Daily for the first week, then weekly through Month 1.  
> **Goal:** Catch regressions, outages, and user pain early after launch.

## Dashboards

| Tool                              | URL / Where to find it                                        | What it tells you                                                        |
| --------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Sentry**                        | `https://nothing-digital.sentry.io` (env: `SENTRY_DSN`)       | JavaScript/server errors, release health, performance transactions.      |
| **Umami**                         | Self-hosted on PikaPods (`https://analytics.nothing.digital`) | Cookieless page views, referrers, device/browser breakdown, event goals. |
| **Vercel Speed Insights**         | Vercel dashboard → Project → Speed Insights                   | Core Web Vitals (LCP, INP, CLS), route-level performance, real-user RUM. |
| **Vercel Analytics / Monitoring** | Vercel dashboard → Analytics / Monitoring                     | Traffic, errors, function invocations, build status.                     |
| **UptimeRobot / Kuma**            | UptimeRobot dashboard (primary) or Kuma (deferred)            | Uptime, response time, SSL expiry alerts.                                |
| **Google Search Console**         | `https://search.google.com/search-console`                    | Indexing status, search queries, Core Web Vitals, mobile usability.      |
| **User feedback**                 | Email inbox + contact form submissions + occasional survey    | Qualitative signal on broken flows, missing content, pricing confusion.  |

## Daily Week-1 checks

### 1. Sentry

- [ ] Open the **Issues** page filtered to `production` environment.
- [ ] Look for any new error with ≥10 occurrences or any error affecting `/api/contact` or `/api/newsletter`.
- [ ] Check **Performance** → Web Vitals for spikes in LCP or INP.
- [ ] Verify the latest release is tagged and errors are associated with the correct release.

### 2. Contact & newsletter forms

- [ ] Submit one test contact entry and confirm:
  - Row appears in Supabase `contact_submissions`.
  - Confirmation email is delivered to the submitter.
  - Team notification email is delivered.
- [ ] Submit one newsletter subscription and confirm:
  - Subscriber appears in Supabase `newsletter_subscribers` (or Listmonk list).
  - Welcome email is delivered.

### 3. Umami

- [ ] Confirm yesterday’s page views are recorded for `/`, `/services`, `/pricing`, `/contact`.
- [ ] Check referrers for unexpected/spam traffic.
- [ ] Confirm no 404 spikes from outbound campaigns.

### 4. Vercel Speed Insights

- [ ] Review LCP, INP, CLS for the previous day.
- [ ] Flag any route with LCP > 2.5 s, CLS > 0.1, or INP > 200 ms.
- [ ] Compare against performance budgets in `plans/00-master-document.md`.

### 5. Uptime / SSL

- [ ] Verify `https://nothing.digital` and `https://www.nothing.digital` respond with 200.
- [ ] Confirm SSL certificate expiry is > 14 days.

## Weekly checks (Month 1)

### Search & SEO

- [ ] Google Search Console: check indexing coverage, sitemap status, mobile usability.
- [ ] Bing Webmaster Tools (when configured): same checks.
- [ ] Review top search queries and click-through rates; flag pages with impressions but no clicks.

### Error & security hygiene

- [ ] Sentry: resolve or assign any issue older than 7 days.
- [ ] `pnpm audit --audit-level moderate`: zero high/critical vulnerabilities.
- [ ] Review Vercel function logs for 5xx or slow cold starts.
- [ ] Verify security headers (CSP, HSTS, X-Frame-Options) with `curl -I https://nothing.digital`.

### User feedback triage

- [ ] Read contact-form submissions and replies; categorize as bug, question, feature, sales lead.
- [ ] Look for repeated complaints or confusion (e.g., pricing, booking, missing service).
- [ ] Update FAQ on `/contact` if the same question appears ≥3 times.

## Alert thresholds

| Signal                          | Threshold                                  | Action                                              |
| ------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| Sentry error rate               | > 0.1% of sessions                         | PagerDuty/Slack alert; investigate within 1 hour.   |
| Contact/newsletter form failure | ≥2 user-reported failures in 24 h          | Test end-to-end flow; check Supabase/Resend status. |
| Site down                       | Any 5-minute outage                        | Check Vercel status + DNS; rollback if needed.      |
| LCP / CLS budget breach         | LCP > 2.5 s or CLS > 0.1 on any key page   | Profile in Lighthouse CI; optimize images/JS.       |
| Umami traffic anomaly           | > 3× normal volume or spike in direct 404s | Check for bot traffic or broken campaign links.     |

## Rollback plan

1. In Vercel dashboard, identify the last healthy production deployment.
2. Click **Promote to Production** to roll back DNS without a new build.
3. Notify the team in the project channel with incident ID and expected fix time.
4. After rollback, verify monitoring alerts clear and forms still work.

## Owner rotation

- **DevOps:** Sentry, uptime, SSL, Vercel, security headers.
- **QA:** Forms end-to-end, Speed Insights, a11y regressions.
- **Content / Growth:** Umami dashboards, Search Console, user feedback triage.
