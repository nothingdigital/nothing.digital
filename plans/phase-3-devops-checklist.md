# Phase 3 — DevOps External Setup Checklist

> **Status:** Production live — Sentry, Umami, Calendly, Listmonk wired; UptimeRobot runbook + CSP fallback + search-engine submission steps done
> **Goal:** Complete account provisioning, env vars, preview/production deployments, and monitoring dashboards.  
> **Note:** Sentry, Umami, Calendly, and Listmonk env vars and pods are now live. UptimeRobot setup is documented (manual, no API creds), CSP allowlist is documented and enforced via `next.config.mjs`, and sitemap submission steps are documented.

## Account Setup

- [ ] **Vercel**
  - [x] Fix deploy workflows (`vercel/action-deploy@v1` does not exist; using `pnpm dlx vercel@latest`).
  - [x] Create project and connect GitHub repo `nothingdigital/nothing.digital`.
  - [x] First preview/production deployment live at https://nothing-digital.vercel.app/.
  - [ ] Add `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` to project env vars.
  - [ ] Add custom domain `nothing.digital` and `www.nothing.digital` redirect.

- [ ] **Cloudflare**
  - [ ] Add domain `nothing.digital` to Cloudflare.
  - [ ] Configure DNS: apex A/AAAA to Vercel, `www` CNAME to `cname.vercel-dns.com`.
  - [ ] Enable SSL/TLS "Full (Strict)", HSTS, DNSSEC.
  - [x] CSP allowlist documented in `infra/cloudflare/security-headers.md`; app-level fallback added to `next.config.mjs` (`middleware.ts` not used because its matcher is admin-only).
  - [ ] Configure WAF rate limiting rules for `/api/contact` and `/api/newsletter`.

- [ ] **Supabase**
  - [ ] Create project and run migrations from `/supabase/migrations/`.
  - [ ] Enable RLS on all tables (`contact_submissions`, `newsletter_subscribers`).
  - [ ] Create policies: anon INSERT on contact/newsletter tables; authenticated service role SELECT.
  - [ ] Enable Email Auth (magic link); add redirect URL `https://nothing.digital/auth/callback` (and localhost for dev).
  - [ ] Copy project URL, anon key, and service role key to Vercel env vars.
  - [ ] Set `ADMIN_EMAILS` (comma-separated owner emails) in Vercel + GitHub secrets.

- [ ] **Resend**
  - [ ] Sign up and verify domain `nothing.digital`.
  - [ ] Configure DKIM, SPF, and custom sending domain.
  - [ ] Copy API key to Vercel env vars.

## Monitoring & Analytics

- [x] **Sentry**
  - [x] Confirm DSN is set in Vercel env vars (`SENTRY_DSN`, `SENTRY_AUTH_TOKEN`).
  - [x] Verify source maps upload on production build.

- [x] **Vercel Analytics / Speed Insights**
  - [x] Speed Insights instrumented in app (kept even when Umami is on).
  - [x] Keep Speed Insights enabled in Vercel dashboard.
  - [x] Disable Vercel Web Analytics once Umami env vars are live (same deploy).
  - [x] Remove `@vercel/analytics` from the app after cutover is stable.

- [x] **Umami (PikaPods)** — live
  - [x] `UmamiScript` + `NEXT_PUBLIC_UMAMI_*` env + cookie consent gate.
  - [x] Privacy policy updated for consent + Umami / Speed Insights.
  - [x] Create Umami pod (~0.25/0.25) on PikaPods.
  - [x] Point `analytics.nothing.digital` at the pod.
  - [x] Create website in Umami dashboard; set in Vercel:
    - `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
    - `NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.nothing.digital/script.js`
    - `UMAMI_DASHBOARD_URL=https://analytics.nothing.digital` (server-only admin link)
  - [x] Confirm pageview appears <30s after Accept; no dual tracking.

- [x] **Calendly**
  - [x] Env-gated “Book a call” CTA on `/contact` + admin Health/Settings link.
  - [x] Set `CALENDLY_URL` in Vercel.
  - [ ] Webhook → `bookings` — deferred (see Phase 6).

- [x] **Listmonk (PikaPods)** — live
  - [x] Pod live at `newsletter.nothing.digital`.
  - [x] Set `LISTMONK_URL`, `LISTMONK_LIST_UUID`, `LISTMONK_DASHBOARD_URL` in Vercel.
  - [x] `/api/newsletter` proxies to Listmonk public subscription API.
  - [ ] Build first campaign / welcome drip (content/growth task).

- [x] **UptimeRobot**
  - [x] Manual setup steps documented in `docs/runbooks/monitoring.md` (no API credentials in workspace).
  - [x] Add monitors for `https://nothing.digital`, `https://nothing.digital/api/health` (free plan, 5-min interval).

- [ ] ~~**Plausible**~~ — replaced by Umami (see Phase 6).

## Post-Deployment Verification

- [ ] Preview deployment builds and passes all CI checks.
- [ ] Production deployment loads without console errors.
- [ ] Contact form submits successfully and email is delivered.
- [ ] Newsletter signup writes to Supabase.
- [ ] SSL Labs rating A+.
- [ ] Security headers verified via `securityheaders.com`.
- [x] Sitemap submission steps documented in `docs/runbooks/monitoring.md` (submit `https://nothing.digital/sitemap.xml` after Cloudflare DNS verification).

## Required Tokens / Secrets

Set these as GitHub Actions secrets (and in Vercel project env vars) to unblock deployment:

- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_SITE_URL=https://nothing.digital`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS` (comma-separated)
- `RESEND_API_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL` (after PikaPods Umami pod)
- `UMAMI_DASHBOARD_URL`, `CALENDLY_URL` (server-only admin / contact CTA links)
- `LISTMONK_URL`, `LISTMONK_LIST_UUID`, `LISTMONK_DASHBOARD_URL` (optional — newsletter proxy)
- `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`, `N8N_DASHBOARD_URL` (optional — fan-out)
- `KUMA_DASHBOARD_URL` (optional — admin launcher)

## Notes

- `middleware.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` for `/admin` routes only.
- CSP is enforced site-wide via `next.config.mjs` headers (fallback) and documented for Cloudflare Transform Rules; Umami and Speed Insights hosts are allowlisted — see `infra/cloudflare/security-headers.md`.
- Rate limiting currently uses `@upstash/ratelimit`; requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Local pre-launch validation passed after fixing stale `footer.test.tsx` social-link assertion and correcting `packageManager` to `pnpm@9.15.0`.
- Phase 6 detail: [`plans/05-pikapods-integrations.md`](./05-pikapods-integrations.md).
