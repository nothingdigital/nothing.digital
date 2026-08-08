# Current state

Goal: implement testimonial carousel on home to increase trust/booking (since no real testimonials yet, use placeholder from portfolio or fake). Min, reuse, ponytail.
Status: pricing + widget done. n8n working.
Current step: component + home integration + data.
Next action: build, review, lint/typecheck, commit push.
Updated: 2026-08-06

## Plan

- [x] conversion-boost.md + pricing + widget
- [ ] testimonial data (placeholder from portfolio mdx or lib)
- [ ] carousel component (useState interval, cards with quote/author/role, "Book similar" CTA)
- [ ] add to home after trust or differentiators
- [ ] update docs/conversion-boost.md to mark done
- [ ] lint/typecheck/test
- [ ] commit + push

## Decisions

- YAGNI: 4 static testimonials, no real data yet. Reuse Card style from portfolio, Button from ui, useState from newsletter-form.
- SOLID: carousel single responsibility for rotation + display.
- Never-nest: guard for empty, flat map for cards. ponytail: static array, CSS transition instead of framer if possible, measurable CTR to booking.
- No new deps. Placeholder quotes to show off until real ones.

## Dead ends

- Full dynamic from MDX or DB (YAGNI until content grows). Video testimonials (bandwidth).

## Progress log

- conversion-boost.md with 7 features + pitch deck.
- pricing calculator + availability widget implemented.
- n8n working with Email fan-out.
- Lighthouse + secretary + docs updates complete.
- ponytail + caveman active. Agents spun for brainstorm. All waves marked done. Next testimonial carousel for trust/booking lift.
