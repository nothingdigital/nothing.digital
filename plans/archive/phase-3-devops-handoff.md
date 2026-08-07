# Agent Handoff Prompt — Phase 3 DevOps / Production Deployment

> **HISTORICAL — archived.** Superseded by [`../../docs/superpowers/HANDOFF-post-launch-ops.md`](../../docs/superpowers/HANDOFF-post-launch-ops.md). Live board: [`../../SCRATCHPAD.md`](../../SCRATCHPAD.md).

> **Scope:** Complete external account setup and first production deployment of the Nothing.Digital web app.
> **Owner:** DevOps / Deployment Agent
> **Start date:** 2026-08-04
> **Estimated effort:** 2–3 days (depends on DNS propagation and provider approval times)

---

## 1. Current state

- Web app code is complete, validated, and ready for production:
  - Next.js 15.5.22 + React 19 + TypeScript + Tailwind CSS + shadcn/ui.
  - `pnpm` package manager (`packageManager: "pnpm@9.15.0"`).
  - 55 unit tests passing, 96.91% statement coverage.
  - All CI checks green: `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm build`.
  - `middleware.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
  - `next.config.mjs` adds the same headers plus the `www → apex` redirect.
- Phase 4 (Tauri desktop app) has been skipped; the project is web-only.
- The `/resolve` route and `nothing://` protocol code have been removed.
- Production deployment is blocked only by missing third-party credentials.

---

## 2. Goal

Get `https://nothing.digital` live and fully verified:

1. Create/configure Vercel project `nothing-digital`, connect GitHub repo, set env vars.
2. Configure DNS/SSL for `nothing.digital` (and `www → apex`).
3. Create Supabase project, run migrations, enable RLS, verify policies.
4. Set up Resend, verify `nothing.digital` domain, configure DKIM/SPF.
5. Configure rate limiting for `/api/contact` and `/api/newsletter`.
6. Enable Speed Insights + Sentry source maps; disable Vercel Web Analytics (Umami replaces it).
7. Deploy to production and verify end-to-end.

---

## 3. Required credentials

Add these as GitHub Actions secrets **and** Vercel project environment variables:

- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_SITE_URL=https://nothing.digital`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `UMAMI_DASHBOARD_URL`
- `CALENDLY_URL`
- `LISTMONK_URL`, `LISTMONK_LIST_UUID`, `LISTMONK_DASHBOARD_URL`

Cloudflare or DNS provider access is also needed if you configure DNS there.

---

## 4. Step-by-step checklist

### Vercel

- [ ] Create project `nothing-digital` and connect `alexanderschroyer/nothing-digital`.
- [ ] Add all required env vars (see above).
- [ ] Add custom domains: `nothing.digital` and `www.nothing.digital` (redirect to apex).
- [ ] Enable GitHub deployments (preview + production).
- [ ] Verify first preview deployment builds successfully.

### DNS / SSL

- [ ] Point `nothing.digital` apex to Vercel (A/AAAA records or Vercel nameservers).
- [ ] Point `www` to `cname.vercel-dns.com` or use Vercel redirect.
- [ ] Confirm SSL/TLS works (Full/Strict if using Cloudflare proxy; otherwise Vercel-managed).
- [ ] Enable HSTS and DNSSEC if using Cloudflare.

### Supabase

- [ ] Create project.
- [ ] Run `/supabase/migrations/001_initial.sql`.
- [ ] Confirm RLS is enabled on `contact_submissions`, `newsletter_subscribers`, `portfolio_items`.
- [ ] Confirm anon INSERT policies and service_role ALL policies exist.
- [ ] Copy project URL and service role key into Vercel env vars.

### Resend

- [ ] Sign up and add domain `nothing.digital`.
- [ ] Verify domain and configure DKIM/SPF.
- [ ] Copy API key into Vercel env vars.

### Rate limiting

- [ ] Either set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (code falls back to in-memory if missing), **or**
- [ ] Configure WAF rate-limiting rules for `/api/contact` and `/api/newsletter`.

### Monitoring / analytics

- [x] Add `SENTRY_DSN` and `SENTRY_AUTH_TOKEN`; verify source maps upload on build.
- [x] Enable Speed Insights in the project dashboard; disable Vercel Web Analytics.
- [x] Set `NEXT_PUBLIC_UMAMI_*` and `UMAMI_DASHBOARD_URL`; confirm pageviews in Umami.

### Post-deployment verification

- [ ] `https://nothing.digital` loads without console errors.
- [ ] `/api/health` returns 200.
- [ ] Security headers are present.
- [ ] Contact form submits and confirmation/team emails are delivered.
- [ ] Newsletter signup writes a row to Supabase.
- [ ] Rate limiting returns 429 after repeated requests.
- [ ] SSL Labs rating is A+.
- [ ] Lighthouse scores ≥ 95 in CI (Performance, Accessibility, SEO).

---

## 5. Constraints

- **Ponytail mode is active.** Prefer existing code, stdlib, and provider-native features over new dependencies.
- Do not commit secrets, certificates, or `.env.local` files.
- Do not change web app UI or business logic unless required to fix a deployment issue.
- Keep changes minimal; update `plans/phase-3-devops-checklist.md` and `plans/phase-3-checklist.md` as tasks complete.
- Create/update `SCRATCHPAD.<agent-name>.md` at every milestone.

---

## 6. Deliverables

- [ ] Production URL `https://nothing.digital` live.
- [ ] Contact and newsletter forms tested end-to-end.
- [ ] Updated `plans/phase-3-checklist.md` and `plans/phase-3-devops-checklist.md`.
- [ ] List of any remaining blockers.

---

## 7. First steps

1. Obtain the required credentials from the stakeholder or add them via `gh secret set`.
2. Install the Vercel CLI (`pnpm add -g vercel`) and authenticate.
3. Create the Vercel project and connect the repo.
4. Add env vars and trigger a preview deployment.
5. Report back with the preview URL and any provider-specific blockers.
