# Nothing.Digital — Scratchpad

## Current state

- Goal: Implement surfaced to-dos across all phases.
- Status: Admin follow-ups 1–6 complete (plan 6 = asset `monitor_url`). Ops/content runbooks + soft-launch blog/case study shipped. Credential-only queue in `docs/runbooks/ops-credentials.md`.
- Current step: User applies Listmonk Vercel env, Resend SPF, GSC/Bing, migration `003`.
- Next action: Execute credential-only steps when dashboard access is available.
- Updated: 2026-08-06

## Phase to-do implementation summary

Specialist-agent work is consolidated here; per-agent detail was in `SCRATCHPAD.{architect,devops,engineer,qa}-impl.md` (now removed).

| Domain              | Done                                                                                                                                                                                    | Remaining                                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Architect**       | Client-logo strip on home; `service-card` reduced-motion guard; verified lazy-loaded Calendly, `next/font`, AVIF/WebP, dynamic imports.                                                 | Real logo assets + legal clearance; Lighthouse ≥ 90/95 in CI only (local arm64/x64 Chrome mismatch).                                     |
| **Engineer**        | Reused `ClientLogoStrip`; Calendly auto-resize embed + CSP `frame-src`; form a11y fixes (`SkipLink`, `aria-describedby`, live regions); API integration tests; `outputFileTracingRoot`. | —                                                                                                                                        |
| **QA**              | Manual a11y pass filed in `docs/runbooks/a11y-manual-pass.md`; API tests verified; unit tests 120/120; E2E known flaky on WebKit mobile/tablet locally.                                 | Re-run E2E in CI; Lighthouse CI in GitHub Actions.                                                                                       |
| **DevOps**          | Verified DNS/SSL/sitemap/robots/health; confirmed `002_client_ops.sql` applied; ops-credentials + listmonk-drip runbooks.                                                               | Resend SPF; Listmonk Vercel env (`listmonk: false` live); GSC/Bing submit; apply `003_asset_monitor_url.sql`; Cloudflare proxy decision. |
| **Admin polish**    | Plans 1–5 already present; plan 6 asset edit + `monitor_url` shipped.                                                                                                                   | Apply migration `003` on Supabase.                                                                                                       |
| **Content / sales** | Soft-launch blog + studio portfolio case study; founding-client outreach tracker; Listmonk drip activation runbook.                                                                     | Activate drip in Listmonk UI; fill outreach slots.                                                                                       |

## Plan

1. ✅ Growth tactics triage + `docs/growth-tactics.md`.
2. ✅ CTAs, sitemap/OG, pricing ranges, case studies, cross-sell, mobile polish.
3. ✅ Listmonk pod + env live.
4. ✅ Umami pod + env live; Vercel Analytics removed.
5. ✅ CSP fallback in `next.config.mjs` + Cloudflare doc.
6. ✅ UptimeRobot + search-console runbook steps.
7. ✅ API integration tests + manual a11y runbook.
8. ✅ Fixed `reveal.test.tsx` + global `IntersectionObserver` mock.
9. ✅ DevOps production verification + sitemap/Search Console/Bing runbook steps.
10. ✅ Manual a11y pass + keyboard/screen-reader checks; report in `docs/runbooks/a11y-manual-pass.md`.
11. ✅ Consolidated agent scratchpads into parent `SCRATCHPAD.md`.
12. ✅ Admin follow-ups 1–6; ops-credentials + listmonk-drip runbooks; soft-launch blog + portfolio case study; founding-client outreach tracker.
13. 🔲 n8n pod, Kuma — deferred.

## Decisions

- CSP in app first (`next.config.mjs`); Cloudflare mirrors later. Keeps preview deployments covered.
- Health flags are env-presence only — no external health checks to keep it cheap.
- API tests mock all external HTTP; no real secrets touched.
- UptimeRobot free is enough; Kuma only if sub-minute checks needed.
- n8n deferred until Slack/Listmonk fan-out has a real use case.

## Dead ends

- `cavecrew-investigator` subagent type broken ("Model not found: haiku/.") — used `explore` instead.
- CSP in `middleware.ts` rejected because matcher is admin-only; expanding it would force auth on public pages.

## Progress log

- 2026-08-06: Integration swarm dispatched and reconciled.
- 2026-08-06: Added `src/app/api/contact/route.test.ts` (8 tests), `src/app/api/newsletter/route.test.ts` (6 tests), `docs/runbooks/a11y-manual.md`.
- 2026-08-06: Added CSP fallback to `next.config.mjs`; updated `infra/cloudflare/security-headers.md`.
- 2026-08-06: Added integration flags to `/api/health`; verified `src/lib/n8n.ts` is already correct.
- 2026-08-06: Fixed `reveal.test.tsx` and global `IntersectionObserver` mock; full suite 76/76 green.
- 2026-08-06: Updated `plans/00-master-document.md` phase headings with Complete / In Progress status and to-do callouts.
- 2026-08-06: Spawned architect / DevOps / engineer / QA agents; reconciled overlapping edits.
- 2026-08-06: Fixed `vitest.config.mts` to exclude `e2e/` and `.worktrees/`; unit tests pass (120/120).
- 2026-08-06: DevOps verification pass: DNS/SSL/sitemap confirmed live, `002_client_ops.sql` applied, credential-only runbook steps documented.
- 2026-08-06: Consolidated per-agent scratchpads into `SCRATCHPAD.md`; deleted `SCRATCHPAD.{architect,devops,engineer,qa}-impl.md`.
- 2026-08-06: Growth tactics implementation (docs + code MRs A–E; F ops-gated).
- 2026-08-05: Prior design refresh deployed (`d762e76`), clock seal fix pushed (`00e304a`).
