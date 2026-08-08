# SCRATCHPAD — Architect Engineer (Phase 1)

## Current state

- **Goal:** Implement backend/API/data foundation, routing, protocol resolver, env validation for Phase 1.
- **Status:** Complete.
- **Current step:** All scoped files created; type-check, lint, and tests pass.
- **Next action:** Hand off to QA/DevOps for integration verification.
- **Updated:** 2026-08-04

## Plan

- [x] Create SCRATCHPAD.architect-engineer.md
- [x] Implement src/lib/env.ts (zod schema for env vars)
- [x] Implement src/lib/routes.ts (route map + serviceSlugs type)
- [x] Implement src/lib/protocol/resolve.ts (parseNothingURL, resolveNothingURL)
- [x] Implement src/app/resolve/page.tsx (client-side redirect from ?uri=)
- [x] Implement middleware.ts (server-side /resolve redirect + security headers)
- [x] Create supabase/migrations/001_initial.sql (tables + RLS + policies)
- [x] Create supabase/seed.sql (sample portfolio + subscriber)
- [x] Implement src/app/api/health/route.ts
- [x] Implement src/app/api/contact/route.ts (validation, Supabase, Resend, rate-limit, honeypot)
- [x] Implement src/app/api/newsletter/route.ts (validation, Supabase, Resend welcome email)
- [x] Implement src/lib/supabase/server.ts (service role client)
- [x] Implement src/lib/resend.ts (wrapper returning null if no key)
- [x] Implement src/lib/rate-limit.ts (Upstash or in-memory fallback)
- [x] Implement src/lib/validations/contact.ts and newsletter.ts
- [x] Implement src/lib/email/templates.ts (confirmation + team notification)
- [x] Run pnpm type-check, pnpm lint, pnpm test; fix errors
- [x] Update plans/phase-1-checklist.md with completed items

## Decisions

- Env validation separates public vs private vars and returns nulls/missing flags instead of crashing at import when optional keys are absent; required keys are validated at runtime in consumers.
- Supabase client wrapper returns null when service role key/url missing so API routes can degrade gracefully with console warnings and 201 responses.
- Resend client wrapper returns null when API key missing so routes never crash on missing env.
- Rate-limit module uses Upstash Redis when env is present; otherwise a per-process in-memory sliding-window fallback (marked with ponytail comment).
- Protocol resolver uses canonical https paths and maps service slugs.
- Middleware performs server-side redirect for /resolve?uri= plus adds security headers; matcher skips static assets.
- Honeypot field is `website` (hidden) — bots fill it, humans don’t.

## Dead ends

- `pnpm build` fails during static generation of `/` with pre-existing "Functions cannot be passed directly to Client Components" error. Not caused by backend modules or `/resolve`; root cause is in existing home page / UI components. Per scope, not modifying UI components.

## Progress log

- 2026-08-04: Created scratchpad, began implementation.
- 2026-08-04: Implemented env validation, routes, protocol resolver, resolve page, middleware, Supabase schema/seed, API routes, shared backend modules, email templates.
- 2026-08-04: Added unit tests for protocol resolver and validations.
- 2026-08-04: Ran pnpm type-check, pnpm lint, pnpm test — all pass.
- 2026-08-04: Updated plans/phase-1-checklist.md with completed Phase 1 items.
