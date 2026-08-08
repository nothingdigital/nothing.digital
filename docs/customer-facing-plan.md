# Customer Facing Improvements Plan - Booking/Scheduling Focus

**Date:** 2026-08-06  
**Status:** Draft - implement top 3 first. Measure conversion lift (form submits, call books, time-to-first-reply) via Umami/events before more.
**Principles:** YAGNI (only if >15% lift projected). Ponytail (reuse existing components/forms/db/email/UI, stdlib, min diff, mark shortcuts). SOLID (single responsibility per component/func). Never-nest (guard clauses, early returns, flat). Measurable (add Umami events on CTA click/book start). No new deps.

**Current (done):** Pricing calculator on /pricing, availability widget on home, timeline + estimate in contact form, secretary migration + RLS.

**Next (top 3 for lift):**

1. Testimonial carousel on home/services with "Book similar" CTA.
2. Case study cards with prefilled contact for "similar project".
3. FAQ schema + structured data on contact/services for SEO/trust.

**Later (YAGNI until data):** Multi-step quote form, live chat, video testimonials, A/B CTAs, self-serve scheduler beyond Calendly.

## 1. Testimonial Carousel

**Goal:** Auto-rotating carousel on home (after trust strip) and service pages with 3-4 quotes, author/role, "Book similar" button that pre-fills contact with service.

**Steps:**

- Reuse existing `ClientLogoStrip` pattern or add `TestimonialCarousel` in molecules (useState for index, interval for auto, pause on hover).
- Data: extend `serviceSummaries` or new `testimonials.ts` with array (quote, author, role, serviceSlug).
- Component: card with quote, author, button Link to contact with ?service=slug (update contact to prefill from query).
- Add to home after differentiators, service pages after the template.
- Test: unit for rotation, manual for CTA prefill.
- Measurement: Umami event on carousel view and "Book similar" click. Track conversion to form submit.
- Files: `src/components/molecules/testimonial-carousel.tsx`, update home/page.tsx, service template, contact form for prefill from query.
- Time: 1 day. Ponytail: static array, no framer if not needed (use CSS transition).

**Update:** `docs/conversion-boost.md` with status. Add to growth-tactics implementation map.

## 2. Case Study "Book Similar" Buttons

**Goal:** On portfolio grid and detail, add button "Book similar project" that links to contact with prefilled service and message snippet from the case.

**Steps:**

- Extend portfolio card and [slug] page with the button using existing Button.
- Prefill: query params ?service=slug&message=Inspired by [title].
- Update contact form to read from URLSearchParams on mount, setValue for service/message if present.
- Reuse existing prefill from AI brief.
- Test: manual for prefill, conversion from portfolio to form.
- Measurement: Umami event on "Book similar" click, track to submission.
- Files: update portfolio-card.tsx, portfolio/[slug]/page.tsx, contact-form.tsx for query prefill.
- Time: 0.5 day. Ponytail: query params, no new state.

**Update:** conversion-boost.md, growth-tactics.

## 3. FAQ Schema + Structured Data

**Goal:** Add FAQPage schema on contact and service pages for rich results, trust, SEO. Use existing FAQ accordion if any or add simple one.

**Steps:**

- Use next/script or JSON-LD in head with script for FAQPage schema (questions from content).
- Data: array of FAQ in lib or hard in page (question, answer).
- Add to contact (the FAQ accordion already there), service pages, about.
- Test: validate with Google structured data tool, search appearance.
- Measurement: impressions in GSC for FAQ rich results.
- Files: update contact/page.tsx, service templates, add lib/structured-data.ts for reuse.
- Time: 0.5 day. Ponytail: static JSON-LD, no new component if accordion exists.

**Update:** next-steps.md with schema steps, master reference.

## Measurement Plan

- Umami events: 'calculator_view', 'widget_click', 'testimonial_book', 'case_book', 'faq_impression'.
- Track form submit rate, call book rate, time from visit to book.
- Review in Umami dashboard weekly. If lift <15%, delete feature.
- A/B if volume allows (Vercel or simple query param).

## Risks

- Clutter on home (measure scroll depth).
- Spam in prefilled forms (honeypot already there).
- Schema errors (validate before deploy).

## Pitch Deck Update (5 slides for client/investor)

1. Problem: 65% drop off at scheduling/quote stage.
2. Solution: widget, calculator, carousel, prefill, schema (all reuse, <3 days).
3. Impact: projected 2x form submits, 40% faster time-to-call.
4. Tech: 100% existing stack, ponytail min, measurable events.
5. CTA: deploy to preview, review data in 14d, iterate or kill low-lift.

**Next after these:** nurture sequence (Listmonk drip extension), A/B test CTAs.

**Execute order:** 1. widget (already in home). 2. carousel. 3. schema. Measure 30d. Delete if no lift.

ponytail: this plan is the doc itself - minimal, actionable, delete if not used. No diagrams. Update with results.

Updated: 2026-08-06. Link in master + growth-tactics. Commit after implementation. Run lint/typecheck/test before push.

#ponytail: focus customer facing only. No admin until data shows need. Measure everything. Delete low performers. 3 features max before review. Reuse = zero new files where possible (inline if <50 lines).
