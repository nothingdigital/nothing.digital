# Phase 3 — DevOps External Setup Checklist

> **Status:** Pending external account access  
> **Goal:** Complete account provisioning, env vars, preview/production deployments, and monitoring dashboards.  
> **Blocker:** No credentials for Vercel, Supabase, Resend, Upstash, or Sentry in this environment. Local code/validation is green; deployment cannot proceed without tokens. Domain is registered at sav.com.

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
  - [ ] Add security headers via Transform Rules or verify middleware headers in production.
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

- [ ] **Sentry**
  - [ ] Confirm DSN is set in Vercel env vars (`SENTRY_DSN`, `SENTRY_AUTH_TOKEN`).
  - [ ] Verify source maps upload on production build.

- [ ] **Vercel Analytics / Speed Insights**
  - [ ] Keep Speed Insights enabled in Vercel dashboard (already instrumented).
  - [ ] Disable Vercel Web Analytics once Umami env vars are live (same deploy).

- [ ] **Umami (PikaPods)**
  - [ ] Create Umami pod (~0.25/0.25) on PikaPods.
  - [ ] Point `analytics.nothing.digital` at the pod.
  - [ ] Create website in Umami dashboard; set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` + `NEXT_PUBLIC_UMAMI_SCRIPT_URL` in Vercel.
  - [ ] Confirm pageview appears <30s after visit; remove dual tracking.

- [ ] **UptimeRobot**
  - [ ] Add monitors for `https://nothing.digital`, `https://nothing.digital/api/health`.

- [ ] ~~**Plausible**~~ — replaced by Umami (see Phase 6).

## Post-Deployment Verification

- [ ] Preview deployment builds and passes all CI checks.
- [ ] Production deployment loads without console errors.
- [ ] Contact form submits successfully and email is delivered.
- [ ] Newsletter signup writes to Supabase.
- [ ] SSL Labs rating A+.
- [ ] Security headers verified via `securityheaders.com`.
- [ ] Sitemap submitted to Google Search Console and Bing Webmaster Tools.

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
- `NEXT_PUBLIC_CALENDLY_URL`, `NEXT_PUBLIC_UMAMI_DASHBOARD_URL` (optional admin links)

## Notes

- `middleware.ts` already sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- CSP is not set in middleware; add after Cloudflare setup if required.
- Rate limiting currently uses `@upstash/ratelimit`; requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Local pre-launch validation passed after fixing stale `footer.test.tsx` social-link assertion and correcting `packageManager` to `pnpm@9.15.0`.
