# Phase 2 Lead — Scratchpad

## Current state

- Role: Phase 2 Lead Engineer for Nothing.Digital.
- Master document Section 6 is the scope.
- Phase 1 local foundation is complete: Next.js 14, TypeScript, Tailwind, shadcn/ui atoms/molecules, organisms (Navigation, Footer), templates (MarketingLayout, MinimalLayout), ThemeProvider, API routes (/api/contact, /api/newsletter, /api/health), env/routes/middleware, Supabase schema/seed.
- Validation passes before Phase 2: pnpm type-check, pnpm lint, pnpm test, pnpm build.
- Ponytail mode active: minimal code, reuse existing components, avoid new deps.

## Plan

1. Create `plans/phase-2-checklist.md` from Section 6 of the master document.
2. Global components (CookieConsent, error.tsx, not-found.tsx, loading.tsx, scroll-to-top, real Footer links).
3. Homepage sections (Hero, Services preview, Featured portfolio, Testimonials, Trust indicators, Newsletter CTA, final CTA).
4. Service index + 4 detail pages.
5. Portfolio index + detail pages using MDX in `content/portfolio/`.
6. About page.
7. Blog index + detail pages using MDX in `content/blog/`.
8. Contact page with form, Calendly placeholder, FAQ accordion, contact info.
9. Legal pages (Privacy, Terms, Accessibility).
10. SEO foundation (metadata, sitemap.ts, robots.ts, JSON-LD, OG image route).
11. Add tests (unit + E2E).
12. Run validation: type-check, lint, test, build; fix failures.
13. Lighthouse check after build.

## Decisions

- Option A for `nothing://`: web-first, Tauri deferred.
- Use existing shadcn/ui primitives and molecules; extend by composition.
- React Hook Form + Zod for forms; hit existing API routes.
- SSG where possible; `generateStaticParams` for `/portfolio/[slug]` and `/blog/[slug]`.
- Placeholder images OK; use `next/image`.
- Installed `next-mdx-remote` and `gray-matter` for local MDX + frontmatter; no other new deps planned.
- OG images: static `/og/default.svg` plus per-page metadata references; skip `@vercel/og` to avoid extra dependency.
- Created shared helpers: `src/lib/mdx.ts`, `SectionContainer`, `Accordion`, `JsonLd`.

## Dead ends

- None yet.

## Progress log

- 2026-08-04: Read master document, architect plan, QA plan, gap analysis, Phase 1 checklist.
- 2026-08-04: Explored existing codebase structure and key files.
- 2026-08-04: Created scratchpad and phase-2 checklist.
