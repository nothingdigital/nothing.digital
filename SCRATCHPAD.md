# Nothing.Digital — Scratchpad

## Current state

- Goal: Implement surfaced to-dos across all phases.
- Status: Master document phase headings updated; specialist agents have delivered; DevOps verification complete.
- Current step: Review final DevOps summary and remaining credential-only actions.
- Next action: Close out DevOps implementation scratchpad and return summary.
- Updated: 2026-08-06

## Integration swarm dispatch

| Agent               | Scope                                                             | Status |
| ------------------- | ----------------------------------------------------------------- | ------ |
| Principal Architect | Scope, sequence, interfaces for open integrations                 | ✅     |
| DevOps              | UptimeRobot monitors, CSP allowlist, search-console/sitemap steps | ✅     |
| QA                  | Manual a11y runbook, API integration tests                        | ✅     |
| Engineers           | CSP fallback, health flags, n8n helper verified                   | ✅     |

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
10. 🔲 Manual a11y pass + keyboard/screen-reader checks.
11. 🔲 n8n pod, Kuma — deferred.

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
- 2026-08-06: DevOps verification pass: DNS/SSL/sitemap confirmed live, `002_client_ops.sql` applied, credential-only runbook steps documented, `SCRATCHPAD.devops-impl.md` created.
- 2026-08-06: Growth tactics implementation (docs + code MRs A–E; F ops-gated).
- 2026-08-05: Prior design refresh deployed (`d762e76`), clock seal fix pushed (`00e304a`).
