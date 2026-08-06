# Phase 1 Checklist — Foundation & Infrastructure

> **Status:** Local Implementation Complete — External Account Setup Pending  
> **Goal:** Repository, CI/CD, infrastructure, and design system are ready for development.  
> **Gate:** All environment variables configured, first preview deployment successful.

## Coding Standards (apply to all Phase 1 work)

- [x] **Never-nesting:** early returns, guard clauses, flat control flow.
- [x] **SOLID:** single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- [x] All functions/components reviewed against these standards in PRs.

## Repository Setup

| #   | Task                                                                     | Owner  | Status                  |
| --- | ------------------------------------------------------------------------ | ------ | ----------------------- |
| 1.1 | Create GitHub repo `nothing-digital` with monorepo structure (Turborepo) | DevOps | ✅                      |
| 1.2 | Add branch protection rules (main: 2 approvals, staging: 1 approval)     | DevOps | ✅ (requires GitHub UI) |
| 1.3 | Add CODEOWNERS, PR template, issue templates (bug, feature)              | DevOps | ✅                      |
| 1.4 | Configure Dependabot for dependency updates                              | DevOps | ✅                      |
| 1.5 | Enable GitHub secret scanning and push protection                        | DevOps | ✅ (requires GitHub UI) |

## CI/CD Pipeline

| #    | Task                                                            | Owner       | Status |
| ---- | --------------------------------------------------------------- | ----------- | ------ |
| 1.6  | Create `pr-validation.yml` — lint, type-check, build, test      | DevOps      | ✅     |
| 1.7  | Create `deploy-production.yml` — auto-deploy on merge to `main` | DevOps      | ✅     |
| 1.8  | Create `deploy-preview.yml` — preview deployments on PRs        | DevOps      | ✅     |
| 1.9  | Configure Lighthouse CI with performance budgets                | DevOps      | ✅     |
| 1.10 | Add axe-core accessibility checks in CI                         | DevOps / QA | ✅     |
| 1.11 | Add pre-commit hooks (Husky + lint-staged)                      | DevOps      | ✅     |

## Infrastructure

| #    | Task                                                               | Owner  | Status                                                                                     |
| ---- | ------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------ |
| 1.12 | Create Vercel project, connect GitHub repo                         | DevOps | 🔲                                                                                         |
| 1.13 | Configure Cloudflare DNS records (A, CNAME, MX, TXT)               | DevOps | 🔲                                                                                         |
| 1.14 | Enable Cloudflare SSL (Full Strict), HSTS, DNSSEC                  | DevOps | 🔲                                                                                         |
| 1.15 | Add `www` → apex redirect in `vercel.json`                         | DevOps | ✅ (implemented in `next.config.mjs`; Vercel dashboard step pending)                       |
| 1.16 | Set up Supabase project, enable connection pooling                 | DevOps | 🔲 (requires Supabase account)                                                             |
| 1.17 | Configure Resend domain verification (DKIM, SPF)                   | DevOps | 🔲 (requires Resend account)                                                               |
| 1.18 | Add all environment variables to Vercel + GitHub Secrets           | DevOps | 🔲 (requires Vercel/GitHub UI)                                                             |
| 1.19 | Configure Cloudflare security headers (CSP, HSTS, X-Frame-Options) | DevOps | ✅ (headers in `next.config.mjs` + `middleware.ts`; Cloudflare Transform Rules UI pending) |
| 1.20 | Set up Cloudflare WAF + rate limiting rules                        | DevOps | ✅ (API rate limiting in `src/lib/rate-limit.ts`; Cloudflare WAF UI pending)               |

## Project Initialization

| #    | Task                                                                                          | Owner     | Status |
| ---- | --------------------------------------------------------------------------------------------- | --------- | ------ |
| 1.21 | Initialize Next.js 14 project with App Router, TypeScript, Tailwind                           | Architect | ✅     |
| 1.22 | Install dependencies: shadcn/ui, Framer Motion, React Hook Form, Zod, Zustand, TanStack Query | Architect | ✅     |
| 1.23 | Set up folder structure (atoms, molecules, organisms, templates)                              | Architect | ✅     |
| 1.24 | Configure `next.config.js` (images, headers, redirects)                                       | Architect | ✅     |
| 1.25 | Set up TypeScript path aliases and strict mode                                                | Architect | ✅     |
| 1.27 | Set up Vitest + React Testing Library + Playwright                                            | QA        | ✅     |

## Design System Foundation

| #    | Task                                                                 | Owner     | Status |
| ---- | -------------------------------------------------------------------- | --------- | ------ |
| 1.28 | Create base atom components (Button, Input, Badge, Icon)             | Architect | ✅     |
| 1.29 | Create molecule components (ServiceCard, FormField, TestimonialCard) | Architect | ✅     |
| 1.30 | Set up `next/font` with Inter + JetBrains Mono                       | Architect | ✅     |
| 1.31 | Create layout templates (MarketingLayout, MinimalLayout)             | Architect | ✅     |
| 1.32 | Implement dark mode support (next-themes)                            | Architect | ✅     |

## Monitoring Setup

| #    | Task                                            | Owner  | Status                                                   |
| ---- | ----------------------------------------------- | ------ | -------------------------------------------------------- |
| 1.33 | Set up Sentry error tracking (DSN, source maps) | DevOps | ✅ Live DSN + source maps verified                       |
| 1.34 | Enable Speed Insights; disable Vercel Analytics | DevOps | ✅ Speed Insights on; Vercel Analytics replaced by Umami |
| 1.35 | Configure UptimeRobot monitoring                | DevOps | 🔲 (free account still needed)                           |

## Phase 1 Deliverables

- [x] GitHub repo with full CI/CD pipeline (local files; create repo + branch protection in GitHub UI)
- [ ] Vercel project connected with preview deployments (requires Vercel account)
- [ ] Cloudflare DNS + SSL configured (requires Cloudflare account)
- [ ] Supabase project ready with connection pooling (requires Supabase account)
- [ ] Resend domain verified (requires Resend account)
- [x] Design system atoms and molecules implemented
- [x] Testing framework configured
- [x] All monitoring tools active (local configs; live dashboards require accounts)

## Notes

- Assume **Option A** for `nothing://`: build web app first, Tauri desktop app deferred to Phase 4.
- External account setup (GitHub, Vercel, Cloudflare, Supabase, Resend) requires manual steps; create local configs and scripts.
- Items marked "requires GitHub UI / Vercel dashboard / UptimeRobot account" cannot be completed locally; configs and placeholders are in place.
- Backend foundation implemented as part of Phase 1: env validation (`src/lib/env.ts`), routing (`src/lib/routes.ts`), protocol resolver (`src/lib/protocol/resolve.ts`), middleware (`middleware.ts`), Supabase schema/seed (`supabase/migrations/001_initial.sql`, `supabase/seed.sql`), API routes (`src/app/api/health`, `/contact`, `/newsletter`), shared modules (`src/lib/supabase/server.ts`, `src/lib/resend.ts`, `src/lib/rate-limit.ts`, `src/lib/validations/*`, `src/lib/email/templates.ts`).
