# Phase 1 Checklist — Foundation & Infrastructure

> **Status:** In Progress  
> **Goal:** Repository, CI/CD, infrastructure, and design system are ready for development.  
> **Gate:** All environment variables configured, first preview deployment successful.

## Coding Standards (apply to all Phase 1 work)

- [ ] **Never-nesting:** early returns, guard clauses, flat control flow.
- [ ] **SOLID:** single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- [ ] All functions/components reviewed against these standards in PRs.

## Repository Setup

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1.1 | Create GitHub repo `nothing-digital` with monorepo structure (Turborepo) | DevOps | 🔲 |
| 1.2 | Add branch protection rules (main: 2 approvals, staging: 1 approval) | DevOps | 🔲 |
| 1.3 | Add CODEOWNERS, PR template, issue templates (bug, feature) | DevOps | 🔲 |
| 1.4 | Configure Dependabot for dependency updates | DevOps | 🔲 |
| 1.5 | Enable GitHub secret scanning and push protection | DevOps | 🔲 |

## CI/CD Pipeline

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1.6 | Create `pr-validation.yml` — lint, type-check, build, test | DevOps | 🔲 |
| 1.7 | Create `deploy-production.yml` — auto-deploy on merge to `main` | DevOps | 🔲 |
| 1.8 | Create `deploy-preview.yml` — preview deployments on PRs | DevOps | 🔲 |
| 1.9 | Configure Lighthouse CI with performance budgets | DevOps | 🔲 |
| 1.10 | Add axe-core accessibility checks in CI | DevOps | 🔲 |
| 1.11 | Add pre-commit hooks (Husky + lint-staged) | DevOps | 🔲 |

## Infrastructure

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1.12 | Create Vercel project, connect GitHub repo | DevOps | 🔲 |
| 1.13 | Configure Cloudflare DNS records (A, CNAME, MX, TXT) | DevOps | 🔲 |
| 1.14 | Enable Cloudflare SSL (Full Strict), HSTS, DNSSEC | DevOps | 🔲 |
| 1.15 | Add `www` → apex redirect in `vercel.json` | DevOps | 🔲 |
| 1.16 | Set up Supabase project, enable connection pooling | DevOps | 🔲 |
| 1.17 | Configure Resend domain verification (DKIM, SPF) | DevOps | 🔲 |
| 1.18 | Add all environment variables to Vercel + GitHub Secrets | DevOps | 🔲 |
| 1.19 | Configure Cloudflare security headers (CSP, HSTS, X-Frame-Options) | DevOps | 🔲 |
| 1.20 | Set up Cloudflare WAF + rate limiting rules | DevOps | 🔲 |

## Project Initialization

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1.21 | Initialize Next.js 14 project with App Router, TypeScript, Tailwind | Architect | 🔲 |
| 1.22 | Install dependencies: shadcn/ui, Framer Motion, React Hook Form, Zod, Zustand, TanStack Query | Architect | 🔲 |
| 1.23 | Set up folder structure (atoms, molecules, organisms, templates) | Architect | 🔲 |
| 1.24 | Configure `next.config.js` (images, headers, redirects) | Architect | 🔲 |
| 1.25 | Set up TypeScript path aliases and strict mode | Architect | 🔲 |
| 1.26 | Configure Tailwind theme (colors, fonts, breakpoints) per brand spec | Architect | 🔲 |
| 1.27 | Set up Vitest + React Testing Library + Playwright | QA | 🔲 |

## Design System Foundation

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1.28 | Create base atom components (Button, Input, Badge, Icon) | Architect | 🔲 |
| 1.29 | Create molecule components (ServiceCard, FormField, TestimonialCard) | Architect | 🔲 |
| 1.30 | Set up `next/font` with Inter + JetBrains Mono | Architect | 🔲 |
| 1.31 | Create layout templates (MarketingLayout, MinimalLayout) | Architect | 🔲 |
| 1.32 | Implement dark mode support (next-themes) | Architect | 🔲 |

## Monitoring Setup

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1.33 | Set up Sentry error tracking (DSN, source maps) | DevOps | 🔲 |
| 1.34 | Enable Vercel Analytics + Speed Insights | DevOps | 🔲 |
| 1.35 | Configure UptimeRobot monitoring | DevOps | 🔲 |

## Phase 1 Deliverables

- [ ] GitHub repo with full CI/CD pipeline
- [ ] Vercel project connected with preview deployments
- [ ] Cloudflare DNS + SSL configured
- [ ] Supabase project ready with connection pooling
- [ ] Resend domain verified
- [ ] Design system atoms and molecules implemented
- [ ] Testing framework configured
- [ ] All monitoring tools active

## Notes

- Assume **Option A** for `nothing://`: build web app first, Tauri desktop app deferred to Phase 4.
- External account setup (GitHub, Vercel, Cloudflare, Supabase, Resend) requires manual steps; create local configs and scripts.
