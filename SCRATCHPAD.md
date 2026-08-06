# Nothing.Digital — Scratchpad

## Current state

- Goal: Phase 5 launch + Phase 6 PikaPods ops rollout + growth tactics.
- Status: Site live; growth triage implemented (CTAs, SEO sitemap/blog, pricing ballparks, 3 anonymized case studies, cross-sell, mobile polish). Listmonk/Umami pods still pending.
- Current step: User sets `CALENDLY_URL`, buys Umami pod, optional `SENTRY_DSN`; Listmonk when first campaign ready.
- Next action: Ops cutover per `docs/growth-tactics.md` + `plans/05-pikapods-integrations.md`.
- Updated: 2026-08-06

## Plan

1. ✅ Growth tactics triage (all three lenses) + `docs/growth-tactics.md`.
2. ✅ CTAs, sitemap/OG, pricing ranges, case studies, cross-sell, mobile polish.
3. 🔲 Listmonk pod + welcome drip (ops).
4. 🔲 Umami pod + env.

## Decisions

- Pricing ranges live on `/pricing` (single source: `src/lib/pricing.ts`): sites $5K–$15K, software $15K–$60K, apps $20K–$80K, email $1.5K–$5K/mo.
- Case studies: anonymized composites until named clients approve.
- SKIP still: lead magnet (no asset), exit-intent, SaaS theater (see growth-tactics.md).

## Dead ends

- cavecrew-investigator subagent type broken ("Model not found: haiku/.") — use `explore` instead.

## Progress log

- 2026-08-06: Growth tactics implementation (docs + code MRs A–E; F ops-gated).
- 2026-08-05: Prior design refresh deployed (`d762e76`), clock seal fix pushed (`00e304a`).
