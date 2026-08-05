# Phase 3 DevOps — Scratchpad

## Current state

- Goal: Complete external account setup and first production deployment.
- Status: Local validation green; workflows fixed; external deployment blocked by missing credentials.
- Current step: Awaiting service tokens to provision Vercel/Supabase/Resend/Sentry.
- Next action: Receive tokens, then create Vercel project, set env vars, and deploy.
- Updated: 2026-08-04

## Plan

1. ✅ Read Phase 3 checklists, env templates, middleware, API routes, Supabase client.
2. ✅ Verify package manager works (`packageManager` corrected to `pnpm@9.15.0`).
3. ✅ Run final validation: `pnpm type-check`, `pnpm lint`, `pnpm test -- --coverage`, `pnpm build` — all green.
4. ✅ Fix Vercel deploy workflows (`vercel/action-deploy@v1` did not exist; switched to `pnpm dlx vercel@latest`).
5. ⬜ Create/configure Vercel project `nothing-digital` — blocked: no `VERCEL_TOKEN`.
6. ⬜ Configure DNS/SSL at sav.com (or Cloudflare) — blocked: no Vercel project records yet.
7. ⬜ Create Supabase project, run migrations, verify RLS policies — blocked: no Supabase credentials.
8. ⬜ Set up Resend domain verification/DKIM/SPF — blocked: no `RESEND_API_KEY`.
9. ⬜ Set Upstash rate-limit env vars or Vercel/WAF rules — blocked: no Upstash tokens.
10. ⬜ Enable Vercel Analytics/Speed Insights/Sentry source maps — blocked: no project/tokens.
11. ⬜ Deploy production and run end-to-end verification.
12. ⬜ Verify Lighthouse scores in CI.
13. ✅ Update checklists with blocker list and required tokens.
14. ✅ Phase 4 (Tauri desktop app) skipped per stakeholder decision; removed handoff docs.

## Decisions

- Do not fabricate deployments or claim live URL without real credentials.
- Document exact required tokens so user can paste them and resume.
- Keep fix minimal: removed stale footer social-link test; no component rewrite.

## Dead ends

- `vercel`/`supabase`/`wrangler`/`resend` CLIs not installed and would still fail without auth tokens.
- `gh secret list` confirms repository has zero secrets; workflows cannot deploy.

## Progress log

- 2026-08-04: Read plans, env templates, middleware, API routes, Supabase server client, migration.
- 2026-08-04: Confirmed no `.env.local`, no GitHub secrets, no service CLIs installed.
- 2026-08-04: Fixed `packageManager` in `package.json` from `npm` to `pnpm@9.15.0` so `pnpm` commands run.
- 2026-08-04: Removed outdated `footer.test.tsx` social-link assertion (component no longer renders social links).
- 2026-08-04: Final validation green: type-check, lint, 64 tests (96.75% stmts / 83.33% branch / 96.05% funcs / 98.79% lines), build (29 routes, 192 kB First Load JS).
- 2026-08-04: Updated `plans/phase-3-checklist.md`, `plans/phase-3-devops-checklist.md`, and this scratchpad with blocker list and required tokens.
- 2026-08-04: Removed Phase 4 Tauri docs, deleted `/resolve` route, `src/lib/protocol/`, and middleware redirect. Validation green after cache clear.
- 2026-08-04: Replaced non-existent `vercel/action-deploy@v1` with direct `pnpm dlx vercel@latest` in `deploy-production.yml` and `deploy-preview.yml`.
- 2026-08-04: Added missing `test:ci` script so `pr-validation.yml` can run tests.
