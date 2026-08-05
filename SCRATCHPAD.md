# Conversion Improvements — Scratchpad

## Current state

- Goal: Implement worthwhile items from 10-point conversion audit; skip asset-dependent/deceptive ones.
- Status: Done locally, uncommitted. Awaiting push approval.
- Current step: QA passed (lint, 55/55 unit, production build).
- Next action: Push when user confirms.
- Updated: 2026-08-05

## Plan

1. ✅ Investigator: mapped pages/forms/content/tests/deploy.
2. ✅ Architect (inline): scope = 2 edits only; rest skip/exists.
3. ✅ Engineer: Why Us section home + pricing FAQ contact page.
4. ✅ QA: lint + unit + build clean.
5. Devops: none — Vercel auto-deploy on push.

## Decisions

- Ponytail triage of 10 items:
  - DONE: #3 Why Us section (page.tsx), #6 pricing ballparks FAQ (contact/page.tsx).
  - PRE-EXISTING: #1 service icons, #5 blog (3 MDX), #6 process sections, #8 portfolio+case studies, #9 budget/service qualifiers in contact form.
  - SKIP: #2/#4 testimonials (no real quotes; testimonial-card.tsx ready), #7 lead magnet (asset doesn't exist), #9 multi-step form + calendar link (user to create free Cal.com, then wire), #10 scarcity/discounts (dark pattern).
- Pricing ranges (user-approved): sites $5–15K, software $15–60K, apps $20–80K, email $1.5–5K/mo.
- Note: builder subagent overwrote this file mid-task; restored. Keep builders away from parent scratchpad.

## Dead ends

- cavecrew-investigator subagent type broken ("Model not found: haiku/.") — use `explore` instead.

## Progress log

- 2026-08-05: Prior design refresh deployed (`d762e76`), clock seal fix pushed (`00e304a`).
- 2026-08-05: Conversion audit received; triage done; investigation done.
- 2026-08-05: Builder shipped both edits; lint+unit+build pass; diff reviewed.
