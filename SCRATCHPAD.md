# Current state

**Goal**: Post-launch ops close-out (merge → migration → credentials → Listmonk drip → founding outreach).
**Status**: Code shipped to `main`; dashboard steps remain.
**Current step**: Apply Supabase `003` (+ `004` if needed), then Bing/GSC/drip/outreach.
**Updated**: 2026-08-07

## Plan

- [x] Merge site polish PRs #7–#9
- [x] Merge `feat/admin-followups-wave` → `main` (#10)
- [ ] Apply `003_asset_monitor_url.sql` (+ `004_profiles.sql` if not applied)
- [x] Listmonk Vercel env (`listmonk: true`)
- [ ] Remove duplicate SPF TXT (keep Resend-inclusive record)
- [ ] GSC sitemap confirm + Bing TXT + sitemap
- [ ] Listmonk welcome drip checklist
- [ ] Live newsletter subscribe E2E
- [ ] GitHub branch protection / secret scanning review
- [ ] Founding outreach: name 2 prospects + first sends
- [x] Commit runbook / master / scratchpad updates

## Decisions

- Payments manual; dashboards = deep-links only
- n8n / Kuma / Calendly webhook deferred
- Admin follow-ups 1–6 not to be re-implemented
- Pricing-calculator local WIP stashed (`wip: pricing calculator`) — out of this wave

## Blocked on human

| Step                             | Where                        |
| -------------------------------- | ---------------------------- |
| SQL `003` / `004`                | Supabase SQL editor          |
| SPF dedupe                       | Cloudflare / Sav DNS         |
| Bing TXT + sitemap               | Bing Webmaster + DNS         |
| GSC sitemap                      | Search Console               |
| Listmonk drip templates/sequence | `newsletter.nothing.digital` |
| Branch protection                | GitHub repo settings         |
| Outreach sends                   | User owns email              |

## Progress log

- 2026-08-07: Merged #7, #8, #9, #10. Health `listmonk: true`. Wave conflicts resolved (privacy checkbox from #9; master pending text). Next: migration + dashboard checklist.
