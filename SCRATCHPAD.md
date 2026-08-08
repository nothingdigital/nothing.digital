# Current state

Goal: audit lead gen, clean debt, plan to get leads flowing.
Status: owner picked hybrid C. Presenting design for approval → then write spec.
Current step: design sections → owner OK → `docs/superpowers/specs/2026-08-07-lead-gen-design.md`.
Next action: get design approval section-by-section; write spec; then writing-plans.
Updated: 2026-08-07

## Plan

- [x] agent: cavecrew-investigator — map lead-gen code
- [x] agent: explore — outbound pipeline audit
- [x] agent: explore — inbound + nurture audit
- [x] agent: general — growth opportunities → recommend hybrid C
- [x] clarify primary goal with owner → **C hybrid**
- [ ] propose approaches + design (in progress)
- [ ] write spec + implementation plan
- [ ] cleanup PRs (agent-doable)
- [ ] owner boxes called out separately

## Decisions

- Cold ≠ warm ≠ transactional — Instantly / Listmonk / Resend stay separated.
- YAGNI: no new queue; reuse lead-finder → admin outbound → Instantly CSV; Listmonk warm drip; Resend transactional.
- Agents recommend **Approach C hybrid**: Instantly warmup Day 1 + Listmonk drip + founding-client + Umami + inbound Calendly CTAs in parallel.
- Keep AI outbound personalization OFF for first cold send.
- Do not invent product roadmap beyond lead gen.

## Dead ends

- Full ML scoring (rule-based enough).
- New queue for nurture (reuse Listmonk + Resend).
- Instantly API push (CSV hybrid stays).
- conversion-boost orphans not worth building now: parseLeadToBooking, Calendar Sync, self-serve scheduler (Calendly is SoT).

## Progress log

- [Audit inbound+nurture](a26c1951-ecab-4834-a51b-1dbd6cc21c42): capture+inbox solid. Nurture weak: Day-0 only for score>60; Listmonk drip owner-open; confirmation/success lack Calendly; AvailabilityWidget imported but never rendered (mock slots); phone stripped before API; false Day 3/7 promise in nurture template; team notify skipped when n8n on.
- [Audit outbound](ddee5cf7-aaf9-412c-a9f9-40f5348a76f8): hybrid CSV shipped; blocked Instantly DNS/warmup + Places key + mig 005. Debt: dual DNC, CLI Instantly CSV bypasses review, re-import dupes, personalization/sequence mismatch.
- [Map lead-gen code](bac3881f-8d80-49a9-9448-747a85f99265): no `triggerNurture`; day-0 inline in contact route. Modules inbox+outbound on.
- [Lead growth opportunities](2bdfeec2-864b-40f8-b966-6f808ddbe212): activation gap not tooling gap. Hybrid 2-week wave recommended.

## Agent-ready cleanup (after design approval)

1. Calendly on contact confirmation + success state
2. Honest nurture copy (drop false Day 3/7 promise) or bridge to Listmonk
3. Fix transactional email footers (n8n marketing copy)
4. Render or delete AvailabilityWidget dead import
5. Umami events: contact_submit, newsletter_subscribe, calendly_click
6. Docs: conversion-boost + SCRATCHPAD reconcile; outbound on live board
7. Dual-notify safety: always Resend team + n8n

## Owner boxes (not agent)

- Instantly account/DNS/warmup ≥14d
- Listmonk drip UI (templates + 0/3/7 + E2E)
- GOOGLE_PLACES_API_KEY (+ optional Hunter)
- Confirm mig 005 (+007 if AI later)
- Founding-client slot 1
- Live lead-finder run + admin review + Instantly import
