# Manual Accessibility Pass Report — Nothing.Digital

> **ARCHIVED evidence** (2026-08-06). Procedure: [`../a11y-manual.md`](../a11y-manual.md). Live board: [`../../../SCRATCHPAD.md`](../../../SCRATCHPAD.md).

> **Date:** 2026-08-06  
> **Tester:** QA Engineer agent  
> **Scope:** Public marketing pages (`/`, `/services`, `/services/*`, `/pricing`, `/about`, `/blog`, `/blog/*`, `/contact`, `/privacy`, `/terms`, `/accessibility`)  
> **Runbook:** `docs/runbooks/a11y-manual.md`

## Summary

| Area                      | Result          | Notes                                                                                                                                                                              |
| ------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automated axe-core scan   | ✅ Pass         | 11 pages scanned on Chromium/Firefox desktop + Chromium mobile; zero violations (wcag2a, wcag2aa, wcag21aa).                                                                       |
| Keyboard navigation       | ✅ Pass         | Logical Tab order, visible `:focus-visible` rings, skip link, Escape closes mobile menu.                                                                                           |
| Screen reader semantics   | ✅ Pass         | One `<h1>` per page, landmarks (`header`, `nav`, `main`, `footer`), labelled form inputs, error messages linked via `aria-describedby`.                                            |
| Color contrast            | ✅ Pass         | Axe contrast rules pass; clock-themed palette meets 4.5:1 for normal text.                                                                                                         |
| `prefers-reduced-motion`  | ✅ Pass / 1 fix | Global CSS resets motion; `Reveal`, `CursorGlow`, `HeroClock` tilt respect the preference; `ServiceCard` hover animation fixed to respect it.                                      |
| Form status announcements | ✅ Pass         | Newsletter form uses `role="status"`/`role="alert"` with `aria-live="polite"`; contact form success/error messages use the same pattern.                                           |
| Cookie consent banner     | ✅ Pass         | Banner uses `role="dialog"` / `aria-modal`, focuses Decline on appear, traps Tab, restores focus to `#main` on dismiss.                                                            |
| Mobile menu focus trap    | ✅ Pass         | Escape closes and returns focus to the toggle; Tab / Shift+Tab cycle within the open mobile header + menu panel.                                                                   |
| WebKit tablet scans       | ⚠️ Flaky        | Local Playwright WebKit projects intermittently hit dev-server 500 errors (`<html>` missing `lang`), so automated results for those projects are not reliable in this environment. |

## Keyboard navigation checklist

- [x] Skip-to-content link is first focusable element and targets `#main`.
- [x] Tab order matches visual order on all unique layouts.
- [x] Focus indicators are visible on links, buttons, form fields, and the mobile menu toggle.
- [x] `Enter` activates links and buttons; `Space` activates native buttons.
- [x] Contact form and newsletter form can be completed without a mouse.
- [x] Mobile menu opens/closes with the toggle; `Escape` closes it and returns focus to the toggle.
- [x] No accidental focus traps on static page content; cookie dialog and open mobile menu intentionally trap Tab.

## Screen reader checklist

- [x] Each page has exactly one `<h1>`.
- [x] Heading hierarchy is logical (`h1` → `h2` → `h3`).
- [x] Landmarks are present: `header`, `nav` (aria-label="Primary"), `main`, `footer`.
- [x] All form inputs have associated `<label>` elements.
- [x] Form errors are linked to inputs via `aria-describedby` (handled by `FormField`).
- [x] Icon-only buttons (theme toggle, mobile menu) have `aria-label`.
- [x] Hero clock exposes current time via `aria-label` and `role="img"`.
- [x] Dynamic newsletter success/error messages use live regions.

## `prefers-reduced-motion` checklist

- [x] Global CSS media query forces `animation-duration`/`transition-duration` to `0.01ms`.
- [x] `Reveal` component short-circuits to a static `div` when reduced motion is preferred.
- [x] `CursorGlow` disables mouse tracking when reduced motion is preferred.
- [x] `HeroClock` disables 3-D tilt when reduced motion is preferred.
- [x] `ServiceCard` hover lift now respects reduced motion (fixed 2026-08-06).

## Color contrast checklist

- [x] Automated axe-core contrast checks pass across all scanned pages.
- [x] Primary text on muted/background surfaces meets 4.5:1.
- [x] Large headings and interactive elements meet 3:1 where required.

## Open findings

1. **WebKit tablet E2E instability**
   - Local Playwright WebKit projects return 500 errors and stripped `<html lang="en">`, producing false `html-has-lang` axe violations.
   - This is an environment/dev-server issue, not a production a11y defect. Re-run in CI with matching architecture.

## Fixed after this pass (engineering)

- `src/components/molecules/cookie-consent.tsx` — dialog semantics, initial focus, Tab trap, restore focus to `#main`.
- `src/components/organisms/navigation.tsx` — Tab / Shift+Tab focus trap while mobile menu is open.
- `src/lib/a11y.ts` — shared focusable query + Tab trap helpers.

## Fixed during this pass

- `src/components/molecules/service-card.tsx` — `whileHover` animation now gated by `useReducedMotion()`.
- `src/app/(site)/contact/page.tsx` — removed invalid `ssr: false` from `next/dynamic` in a Server Component so the build passes.
- `src/components/organisms/client-logos.tsx` — restored missing component used by the home page.
- `e2e/navigation.spec.ts`, `e2e/audit-fixes.spec.ts`, `e2e/contact.spec.ts` — updated outdated tests for the shipped cookie banner, actual nav links, and narrow/mobile viewport handling.

## Sign-off

- [x] Manual pass completed.
- [x] Automated axe-core scan green on reliable projects.
- [x] Cookie consent focus enhancement complete.
- [x] Mobile menu focus trap enhancement complete.
