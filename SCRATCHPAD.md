# Current state

Goal: hybrid lead-gen activation (Approach C).
Status: agent inbound cleanup shipped. Owner boxes open (Instantly / Listmonk / Places).
Current step: owner starts Instantly warmup + Listmonk drip; agent done for this wave.
Next action: owner preflight; optional commit of agent changes.
Updated: 2026-08-07

## Plan

- [x] audit agents (map, outbound, inbound, growth)
- [x] design approved (hybrid C) → spec + plan written
- [x] Calendly on confirm email + success UI
- [x] Honest nurture Day-0 + email footer cleanup
- [x] Always team Resend (+ n8n fan-out)
- [x] Umami events (contact_submit, newsletter_subscribe, calendly_click)
- [x] Delete AvailabilityWidget mock + dead import
- [x] Docs: conversion-boost + this board
- [ ] Owner: Instantly DNS/warmup ≥14d
- [ ] Owner: Listmonk 0/3/7 drip + E2E
- [ ] Owner: GOOGLE_PLACES_API_KEY on Vercel + live lead-finder / map
- [ ] Owner: confirm mig 005 + **009** (map lat/lng); review CSV → Instantly (admin export only)
- [ ] Owner: founding-client slot 1
- [ ] Keep AI outbound personalization OFF for first send

## Decisions

- Approach C hybrid.
- Cold ≠ warm ≠ transactional.
- Contact nurture = Resend Day-0 only if score > 60; no Listmonk auto-subscribe.
- Admin Instantly export only — ignore CLI `instantly-import-*.csv` until after review.
- Spec: `docs/superpowers/specs/2026-08-07-lead-gen-design.md`
- Plan: `docs/superpowers/plans/2026-08-07-lead-gen.md`

## Dead ends

- Full ML scoring; Instantly API; Calendly→CRM; self-serve scheduler; fake availability slots.

## Progress log

- Ponytail cleanup applied (6 agents): components, site/brand, admin app, lib/admin+kb, lib core, scripts/e2e. Skipped: `database.ts` gen types, editing applied migrations, `body_text` drop, cookie-consent→`<dialog>`.
- Ponytail full-code review (278/278): findings-only report `docs/runbooks/archive/ponytail-full-review-2026-08-08.md` (~−1090 lines upper bound). Re-run: `docs/runbooks/ponytail-full-review.md`.
- Admin outbound map: `/admin/outbound/map` (MapLibre + Places → lead pins; Berry AL). Spec `2026-08-08-admin-outbound-map-design.md`. Needs Places key on Vercel + mig 009.
- Implemented inbound cleanup: templates, contact route dual-notify, success Calendly CTA, Umami helper, deleted AvailabilityWidget.
- Audits: activation gap not tooling gap; dual DNC remains manual for pilot.
