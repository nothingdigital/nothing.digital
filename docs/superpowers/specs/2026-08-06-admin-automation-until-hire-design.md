# Admin Automation Until Hire — Design Spec

**Date:** 2026-08-06  
**Status:** Draft — pending review  
**Owner:** Nothing.Digital (The Business of Nothing LLC)

## Purpose

Run secretarial ops and outbound/nurture from `/admin` so the founder stays solo until **Approve / judgment work regularly exceeds ~30–60 minutes/day**. That threshold is the hire signal (VA / secretary), not a cue to build more product.

## Decisions (locked)

| Decision            | Choice                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Architecture        | **Admin = cockpit**; Instantly / Listmonk / Resend / n8n = specialist workers                                                                               |
| Auto-send risk      | **Safe templates only** (receipts, form/booking confirms, overdue invoice reminders after N days). Freeform client/prospect mail = Approve or campaign tool |
| Scope of first wave | Outbound + secretary loops + safe Resend sends                                                                                                              |
| Sequence            | **1) Instantly API outbound → 2) more loops → 3) safe Resend templates**                                                                                    |
| Instantly depth     | **API-first** (not CSV-only forever)                                                                                                                        |
| Hire trigger        | Daily Approves / judgment > ~30–60 min                                                                                                                      |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  /admin (cockpit)                                       │
│  Today loops · Outbound · Clients · Billing · Settings  │
│  Policy: kill switches, thresholds, Approves            │
└────────────┬────────────┬────────────┬────────┬─────────┘
             │            │            │        │
        Instantly     Listmonk      Resend     n8n
        (cold API)    (warm drip)   (safe TX)  (webhooks)
```

**Rules**

- Admin never becomes Instantly/Listmonk. It **approves, syncs, pauses, surfaces debt**.
- Cold ≠ warm ≠ transactional (existing runbooks stay law).
- Every automation either clears itself or becomes a **Today loop**.
- Freeform AI drafts (optional later) always hit Approve before Resend.

## Current baseline (do not rebuild)

Already present or in-flight:

- Today loops + events (`admin_loop_events`, collect/rules, Home UI)
- `/admin/outbound` page, CSV import/review, Instantly CSV export, DNC, weekly cadence loop
- Listmonk drip checklist defs; Instantly preflight checklist on outbound page
- Resend for invoice/contact transactional
- Optional `notifyN8n()` webhook
- Clients / inbox / billing / work CRM

**Gaps this roadmap closes:** Instantly API, richer secretary loops, checklist wiring on Health, safe auto-send policy + templates, kill switches in Settings.

---

## Phase 1 — Instantly API outbound

**Outcome:** Approve leads in admin → push/sync to Instantly campaign → pause/status visible on Today; CSV remains fallback.

### Admin surfaces

- `/admin/outbound` (exists): keep review queue; add **Send via Instantly** (API) beside CSV download
- Instantly preflight checklist (already on page) must gate API send (all required items checked)
- Settings/Health: `INSTANTLY_API_KEY` presence chip; link to Instantly dashboard
- Today: weekly cadence loop + optional “campaign unhealthy” loop (bounce/spam thresholds when API metrics available)

### API responsibilities (app)

Thin client in `src/lib/admin/outbound/instantly/` (or similar):

| Action              | Behavior                                                           |
| ------------------- | ------------------------------------------------------------------ |
| Push approved leads | Map approved+email rows → Instantly lead/campaign add; respect DNC |
| Sync suppression    | Push `do_not_contact` → Instantly block list                       |
| Pause / resume      | Kill switch from admin Settings or Outbound                        |
| Metrics (read)      | Bounce/reply/sent counts for glance + unhealthy loop               |

Exact Instantly endpoints follow their current API docs at implement time; wrap behind a small interface so CSV handoff stays available if API fails.

### Data

- Reuse `lead_candidates`, `do_not_contact`, `ops_checklist_items`
- Optional columns or side table only if needed for Instantly lead/campaign IDs (YAGNI until push needs idempotency)

### Out of scope (Phase 1)

- Building sequences/copy in-app (stay in Instantly + `content/emails/`)
- Sending cold mail via Resend or Listmonk

---

## Phase 2 — Secretary loops

**Outcome:** Today never lies about dropped balls; you close/snooze/mute, system re-derives.

### Loop rules to add (priority order)

| Rule                           | Source         | Trigger                                                                                                                |
| ------------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Instantly preflight incomplete | setup          | Unchecked Instantly checklist items (wire into `collectLoops`; today only Listmonk drip is collected)                  |
| Stale inbox (time-gated)       | inbox          | `new` older than N days (config; default 2) — replace “all new” noise if needed                                        |
| Overdue invoice follow-up      | billing        | Already have overdue; extend detail when auto-reminder pending/sent                                                    |
| Work blocked / due soon        | work           | Already present                                                                                                        |
| Client silent                  | work/clients   | Open work or proposal with no client reply in X days (use existing work timestamps; no new CRM fields unless required) |
| Booking prep / no-show         | outbound/setup | Only if Calendly/n8n webhook feeds a durable signal; else defer                                                        |

Keep `TODAY_VISIBLE_CAP = 3`. New rules must compete on priority, not flood Home.

### Health / Settings

- Mount Listmonk drip checklist at `/admin/health#listmonk-drip` (component exists, unused)
- Kill switches + thresholds (stale days, reminder days) as admin-only config (env first; DB later only if you change them often)

### Out of scope (Phase 2)

- Multi-user roles / secretary login (hire-time)
- Notion/HubSpot sync

---

## Phase 3 — Safe Resend templates

**Outcome:** Narrow auto-sends; everything else is draft → Approve or silence.

### Allowlisted auto-sends

| Template                   | Trigger                            | Guard                                             |
| -------------------------- | ---------------------------------- | ------------------------------------------------- |
| Form received              | Contact (and similar) submit       | Already/near existing Resend path                 |
| Booking confirm / reminder | Calendly webhook via n8n or direct | Only if webhook verified                          |
| Invoice sent               | Manual send from billing           | Existing                                          |
| Overdue reminder           | Invoice overdue ≥ N days           | Kill switch + max reminders + stop on pay/archive |

### Approve-required

- Any custom client update, proposal language, negotiation, apology
- Prospect replies (Instantly owns thread until handoff to inbox)

### Implementation shape

- `src/lib/admin/mail/templates/` — named templates, no freeform compose in v1
- Settings toggles: `auto_overdue_reminder`, `auto_form_ack` (defaults conservative: form ack on, overdue off until enabled)
- Log sends (Resend id + template key) enough to debug; no full email warehouse
- Failures → Health chip / Today loop, not silent

### n8n role

- Glue only: Calendly → webhook → create loop or trigger template
- Not the policy brain; admin owns on/off

---

## Phase 4 — Hire handoff (product stop line)

When Approves consistently exceed ~30–60 min/day:

1. Stop building automation features; hire VA/secretary
2. Give them admin allowlist email + runbooks (`outbound-pilot`, `client-ops`, this spec)
3. Optional later: role = `secretary` (scoped nav) — **not** in Phases 1–3

---

## Error handling

- Instantly API errors: surface on Outbound + leave CSV export working
- Partial lead push: idempotent by email/place where Instantly allows; remainder stay `approved` with error note
- Resend failures: no false “sent”; create/setup loop or billing flash
- Missing env keys: Health chips red; API actions refuse with clear error

## Testing

- Unit: Instantly client mapping, loop collect with new rules, template guard (kill switch / N days)
- No live Instantly/Resend in CI; fixtures + mocked HTTP
- Manual: pilot path in `docs/runbooks/outbound-pilot.md` updated for API push

## Explicit non-goals

- First-party cold email engine
- Full CRM (HubSpot/Notion)
- Unrestricted AI auto-reply
- Replacing Instantly UI for sequence editing

## Success criteria

1. Weekly outbound can complete without leaving admin except Instantly copy/warmup edge cases
2. Overdue / inbox / work debt surfaces on Today within priority cap
3. Safe templates can run with kill switches; no freeform auto-send
4. Founder can state: “I’d hire when Approves exceed X min/day” and measure it subjectively from Today
