# Lead Gen Hybrid Activation — Design Spec

> **Status:** Approved (Approach C hybrid) · **Date:** 2026-08-07  
> **Goal:** ≥1 qualified conversation in ~4 weeks by activating cold + warm + inbound in parallel.  
> **Not now:** Instantly API, ML scoring, Calendly→CRM webhook, self-serve scheduler, dual-DNC auto-sync, AI personalization on first send.

## Problem

Lead tooling is mostly shipped (contact → inbox, lead-finder → `/admin/outbound` → Instantly CSV, Listmonk env). Leads aren't flowing because **activation is incomplete** and inbound has a few conversion leaks (no Calendly on confirm/success, false nurture promises, team notify skipped when n8n on).

## Decisions

| Decision                    | Choice                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| Approach                    | Hybrid C — Instantly warmup Day 1 + Listmonk drip + inbound fixes in parallel            |
| Cold path                   | Unchanged: lead-finder → admin review → Instantly export only (ignore CLI Instantly CSV) |
| Warm path                   | Listmonk newsletter drip only; **no** auto-subscribe contact leads                       |
| Contact nurture             | Resend Day-0 only if `scoreLead > 60`; honest copy (no Day 3/7 promise)                  |
| Calendly                    | Always on confirmation email + contact success UI                                        |
| Team notify                 | Always Resend; n8n remains fire-and-forget fan-out                                       |
| AI outbound personalization | OFF for first send                                                                       |
| AvailabilityWidget          | Delete mock + dead import (no fake slots)                                                |

## Architecture

```text
Track Cold (owner)          Track Warm (owner)         Track Inbound (agent)
Instantly DNS/warmup        Listmonk 0/3/7 drip        Calendly on confirm+success
Places → lead-finder        E2E subscribe              Honest Day-0 copy
/admin/outbound review      Founding-client slot 1     Always team Resend
Admin Instantly export      (newsletter unchanged)     Umami events; footer cleanup
```

## Agent work packages

1. Calendly on confirmation + success UI
2. Honest nurture Day-0 copy + transactional footer cleanup
3. Always team Resend (+ n8n if set)
4. Umami: `contact_submit`, `newsletter_subscribe`, `calendly_click`
5. Delete AvailabilityWidget mock + homepage import
6. Docs + SCRATCHPAD reconcile

## Success metrics

| Channel | 2-week                                        | 4-week                                       |
| ------- | --------------------------------------------- | -------------------------------------------- |
| Inbound | ≥2 contacts; ≥1 Calendly click                | ≥1 booked call                               |
| Warm    | Listmonk drip checklist done                  | open ≥40%                                    |
| Cold    | ≥50 reviewed; ≥20 email-ready; warmup started | ≥100 sends; bounce &lt;5%; ≥1 positive reply |

**North star:** ≥1 qualified conversation in 4 weeks. Bounce ≥5% or spam → pause Instantly.
