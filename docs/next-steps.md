# Next Steps for Nothing.Digital

## 1. Manual a11y Pass

- Run axe-core full scan on all pages (PR validation already does this; verify zero critical).
- Keyboard navigation: Tab through all interactive elements, check focus order, no traps, skip links work.
- Screen reader: Use VoiceOver (Mac) or NVDA (Windows). Test hero, forms, cards, nav, footer. ARIA labels, live regions for status, role="status"/"alert" on messages.
- Contrast: All text 4.5:1, large text 3:1. Use WAVE or axe.
- Reduced motion: Test `prefers-reduced-motion` — animations pause, no vestibular triggers.
- Update `docs/runbooks/a11y-manual-pass.md` with results. Fix any issues (e.g. hero clock aria, form announcements).
- Time: 2-4 hours. Tool: browser devtools + screen reader.

## 2. GSC + Bing Verification + Sitemap Submission

- GSC: Search Console > Add property `nothing.digital` > Verify with TXT (already in DNS). Submit sitemap `https://nothing.digital/sitemap.xml`. Review Coverage, Mobile Usability, Core Web Vitals in 1 week.
- Bing: Webmaster Tools > Add site > Import from GSC or add TXT. Submit same sitemap.
- Monitor in runbook `docs/runbooks/monitoring.md`: add section for weekly review of impressions/clicks.
- Update `plans/05-pikapods-integrations.md` and master with [x].
- Time: 30 min dashboard. No code change.

## 3. Lighthouse CI

- rc.json already updated to 0.95 performance, 1.0 a11y, 0.95 seo.
- Workflow `.github/workflows/pr-validation.yml` uses treosh/lighthouse-ci-action with the rc.
- Local block (arm64) fixed in CI (GitHub runners are x64).
- Run `pnpm build` then `lhci autorun` locally if possible or rely on PR.
- Fix any failing assertions (current scores pass per previous).
- Update phase-3-checklist with [x] for Lighthouse CI.
- Time: 15 min verify in PR.

## 4. CRM on Hire (Secretary Phase B)

- Run `supabase/migrations/004_profiles.sql` (already created: profiles table, app_role enum, RLS, is_staff() function).
- Update RLS on clients, invoices, assets, work_items, contact_submissions to use `is_staff()` for authenticated (owner/staff).
- Admin login: extend magic link to check profiles.app_role, allow 'staff'.
- Settings page: add invite staff (create profile with role 'staff', send magic link).
- Runbook `docs/runbooks/client-ops.md`: add section for secretary onboarding, role assignment, least-privilege policies.
- Test: create staff account, login, verify limited access (no delete/settings).
- Defer Phase C light CRM (clients search/CSV) until hire.
- Update 05-pikapods and master with [x] for Phase B.
- Time: 3-5 days on hire. Use existing auth patterns.

## Overall

- Prioritize by impact: a11y/GSC for launch, CRM on hire.
- Measure: conversion rate, time-to-book, support tickets.
- YAGNI: no full HubSpot, no self-serve portal until volume.
- After: n8n if fan-out needed, Kuma if UptimeRobot insufficient.
- Track in master + runbooks. Review in 30d.

**Pitch Deck Summary (from conversion-boost.md):** Problem (lead friction), Solution (7 features), Impact (2.4x bookings), Tech (100% reuse), CTA (pilot + data review).

Run `pnpm lint && pnpm type-check && pnpm test` after changes. Commit per feature. Deploy to preview for test.

Updated: 2026-08-06. Next: manual a11y execution + GSC dashboard.
#ponytail: steps are minimal actionable. No over-planning. Measure before more.
