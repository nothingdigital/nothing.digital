# Nothing.Digital — Scratchpad

## Current state

- Goal: Post-launch ops close-out (merge pending PRs, Listmonk env, migration `003`, drip activation, founding outreach).
- Status: Admin follow-ups 1–6 implemented on `feat/admin-followups-wave`. Site polish PRs open (#7 Calendly, #8 seal, #9 privacy checkbox). Production still missing Listmonk Vercel env (`listmonk: false`).
- Current step: Hand off to next agent via `docs/superpowers/HANDOFF-post-launch-ops.md`.
- Next action: Merge PRs + wave branch → apply `003` → Listmonk env → drip → Bing/GSC → founding slots.
- Updated: 2026-08-06

## Plan

1. ✅ Admin follow-ups 1–6 on `feat/admin-followups-wave`.
2. 🔲 Merge #7 / #8 / #9 + admin wave to `main`.
3. 🔲 Apply `003_asset_monitor_url.sql` on Supabase.
4. 🔲 Listmonk Vercel env → `listmonk: true` + live subscribe E2E.
5. 🔲 Activate welcome drip (`docs/runbooks/listmonk-drip.md`).
6. 🔲 Bing Webmaster + GSC sitemap confirmation.
7. 🔲 Founding client outreach (2 slots).
8. 🔲 n8n / Kuma / Calendly webhook — deferred.

## Decisions

- Next implementation wave = ops/credentials + Listmonk activation, not new admin features.
- External dashboards stay deep-links; no Umami/Listmonk iframes.
- SPF `_spf.resend.com` and GSC TXT treated done in runbook — re-verify only.

## Dead ends

- Re-implementing admin plans 1–6 while they already exist on the feature branch.

## Progress log

- 2026-08-06: Admin wave + soft-launch content + ops runbooks on feature branch.
- 2026-08-06: Opened #7 Calendly resize, #8 footer seal, #9 privacy checkbox.
- 2026-08-06: Wrote `HANDOFF-post-launch-ops.md`; marked admin plans shipped in plans README.
