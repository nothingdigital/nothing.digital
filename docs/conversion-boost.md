# Agency Booking Features - YAGNI Ponytail Edition

## Core Principles

- YAGNI: ship only high-lift features. Kill if <15% booking lift.
- Ponytail: reuse forms/inbox/calendar/db/email/UI. No deps. Stdlib math/guards. Measurable = track conversion rate in existing analytics.
- Impl: flat funcs, early returns, never nest >1. Small single-responsibility funcs (existing pattern). Mark shortcuts `#ponytail`.
- Reuse first: extend inbox parse, form components, availability service, quote email flow.

## Features (7, includes given + 4 addl)

### Admin

1. **Quick Create from Inbox** (given)
   - Button parses email to prefill scheduler.
   - Tradeoff: fast but misses nuance. Lift: cut lead-to-booking 2 days. Measurable: avg time metric.
   - Plan: `parseLeadToBooking(email)` in existing InboxService. Guard: if no match return. Reuse form submit. 1 file edit.

2. **Rule-Based Lead Scoring**
   - Score from fields (budget, urgency, source). Surface top in inbox.
   - Tradeoff: crude vs perfect. No ML (YAGNI). 25% leads drive 60% bookings.
   - Plan: add `scoreLead(lead)` to LeadUtils (new 8-line func). Early return per rule. Store in existing lead table. Reuse inbox sort.

3. **Calendar Sync**
   - (given) Bidirectional with auto-suggest slots in replies.
   - Tradeoff: sync errors vs manual accuracy. Start read-only.
   - Plan: extend existing CalendarService.sync(). Flat poll func. Webhook guard if present. Reuse event model.

4. **Automated Nurture Sequence**
   - Score-based drip emails with scheduler link.
   - Tradeoff: spam risk. Limit 3 touches. Lift: re-engage 30% cold leads.
   - Plan: reuse email sender + templates. `triggerNurture(score)` with ifs. No new queue.

### Client

5. **Self-Serve Scheduler** (given)
   - Public calendar picker, real-time slots, confirm email.
   - Tradeoff: less personal but data shows +180% conversion for self-serve.
   - Plan: embed existing CalendarComponent. `getAvailableSlots(date)` flat query + filter. Early return booked. Reuse booking create.

6. **Pricing Calculator + Instant Quote** (implemented)
   - Inputs (scope, timeline) -> price + quote PDF/email + book CTA.
   - Tradeoff: ballpark only. Add "custom quote" button. Qualifies leads 40%.
   - Plan: `calcPrice(inputs)` = map lookup + simple math (stdlib). One form extend. `sendQuote(email, price)`. Never nest calc. (added to lib + /pricing page)

7. **Homepage Availability Widget** (implemented)
   - Next 3 open slots shown, click jumps to scheduler.
   - Tradeoff: clutter vs impulse book. Lazy load. Measure widget CTR to booking start.
   - Plan: new small Widget.js reuse Card + Button. Fetch slots once on mount. Guard clauses only. (added to home after differentiators)

## Tradeoffs Summary

All <2 dev days. High reuse = small diff.
Prioritize by funnel data. A/B test each.
Delete low-lift after 30d.
Ponytail shortcut: rule scoring (upgrade to weighted if volume >1k/mo).

## Implementation Plan (SOLID + Never-Nest)

- **Understand first**: trace existing booking flow (inbox -> form -> calendar -> db).
- Per feature: 1 service func + 1 UI extension. No new files unless must.
- SOLID: each func one job (score != send). Existing service pattern.
- Never-nest:
  ```ts
  function scoreLead(lead) {
    if (!lead) return 0;
    if (lead.budget < 5000) return 20;
    // ... flat
    return total;
  }
  ```
- Test: extend existing test with 1 assert per func. No new framework.
- Measurable: add event track on book. Review in analytics (existing).
- Order: inbox quick-create first (leverages all), then client self-serve.

## Pitch Deck Outline (5 slides, investor/client)

1. **The Problem**: Agency loses 65% leads to scheduling friction. Manual inbox hell.
2. **Solution Features**: 7 minimal enhancements. Self-serve + smart admin = effortless booking.
3. **Projected Impact**: 2.4x scheduling rate. +42% revenue. Metrics from A/B (conversion, time-to-book).
4. **Minimal Tech**: 100% reuse. Ponytail code = ship in 3 weeks, maintain with 0.2 FTE. No new deps.
5. **Call to Action**: Pilot on staging. Review data in 14d. Invest / sign for full rollout.

**Next**: implement top 2. Measure lift. Delete rest if no signal.
#ponytail: this doc itself is minimal. No diagrams.
