# Design Refresh — Scratchpad

## Current state

- Goal: Make the live site feel personal: add a splash of color and a clock/time theme.
- Status: Deployment verified; codebase inspected; ready to edit palette, hero, and copy.
- Current step: Update globals.css with a clock-themed palette and add a live hero clock.
- Next action: Implement palette + HeroClock, run validation, commit, deploy.
- Updated: 2026-08-05

## Plan

1. ✅ Inspect current home page, nav, layout, blog, and color tokens.
2. ⬜ Add clock-themed color palette (warm amber/gold accent on deep navy) in `globals.css`.
3. ⬜ Add subtle keyframes (ticking pulse, slow sweep) in `tailwind.config.ts`.
4. ⬜ Create `src/components/atoms/hero-clock.tsx`: lightweight SVG analog clock, client-only.
5. ⬜ Update `src/app/page.tsx` hero: clock visual + time-themed headline/copy.
6. ⬜ Keep existing blog route/content (3 posts already exist); no nav change unless asked.
7. ⬜ Run `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm build`.
8. ⬜ Commit and push to trigger production deploy.

## Decisions

- Do not redesign every page; focus on home hero where first impression lives.
- Reuse existing `lucide-react` icons and Tailwind tokens; no new dependencies.
- Keep dark-mode toggle; define both light and dark clock palettes.
- Skip blog removal — it already has content and a working `/blog` page.

## Dead ends

- (none yet)

## Progress log

- 2026-08-05: Site confirmed live at `https://nothing.digital`.
- 2026-08-05: Read `page.tsx`, `layout.tsx`, `globals.css`, `tailwind.config.ts`, `navigation.tsx`, and blog content.
- 2026-08-05: Confirmed 3 blog posts exist; keeping blog route.
