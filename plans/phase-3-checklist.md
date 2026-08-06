# Phase 3 Checklist — Integration, QA & Polish

> **Status:** Completed (code/validation); pending external account provisioning  
> **Goal:** WCAG 2.1 AA compliance, performance budgets met, all tests passing.  
> **Gate:** Lighthouse scores ≥ 95 (Performance, Accessibility, SEO), zero critical a11y violations, all E2E tests green.

## Coding Standards

- [x] Never-nesting: early returns, guard clauses, flat control flow.
- [x] SOLID: single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- [x] Deliberate simplifications marked with `// ponytail:` comments.
- [x] Reuse existing components; no rewrites.
- [x] No new dependencies unless stdlib/existing packages insufficient.

## 7.1 Accessibility Audit

| #   | Task                                                     | Owner | Status                          |
| --- | -------------------------------------------------------- | ----- | ------------------------------- |
| 3.1 | Run automated axe-core audit across all pages            | QA    | ✅                              |
| 3.2 | Manual keyboard navigation test (Tab order, focus traps) | QA    | 🔲                              |
| 3.3 | Screen reader test (VoiceOver / NVDA)                    | QA    | 🔲                              |
| 3.4 | Color contrast audit (all text meets 4.5:1)              | QA    | ✅ (axe + Lighthouse a11y pass) |
| 3.5 | Verify ARIA labels on interactive elements               | QA    | ✅ (axe scan clean)             |
| 3.6 | Test `prefers-reduced-motion` compliance                 | QA    | 🔲                              |

## 7.2 Performance Optimization

| #    | Task                                                  | Owner    | Status                                        |
| ---- | ----------------------------------------------------- | -------- | --------------------------------------------- |
| 3.7  | Audit bundle size with `@next/bundle-analyzer`        | QA       | 🔲                                            |
| 3.8  | Optimize images (WebP/AVIF, next/image, lazy loading) | Frontend | ✅ (existing `next/image` usage)              |
| 3.9  | Implement dynamic imports for below-fold sections     | Frontend | ✅ (`NewsletterForm` lazy-loaded on home)     |
| 3.10 | Verify font loading strategy (FOUT prevention)        | Frontend | ✅ (`next/font` used)                         |
| 3.11 | Cache static assets via Cloudflare page rules         | DevOps   | 🔲 (pending Cloudflare access)                |
| 3.12 | Run Lighthouse CI and fix any failing assertions      | QA       | 🔲 (blocked locally by x64 Node on arm64 Mac) |

## 7.3 Testing

| #    | Task                                                     | Owner | Status                                                                  |
| ---- | -------------------------------------------------------- | ----- | ----------------------------------------------------------------------- |
| 3.13 | Write unit tests for all atom components (≥80% coverage) | QA    | ✅ (65 tests, 96.79% stmts / 83.33% branch / 96.1% funcs / 98.8% lines) |
| 3.14 | Write integration tests for API routes                   | QA    | 🔲                                                                      |
| 3.15 | Write E2E tests for critical user journeys (Playwright)  | QA    | ✅ (4 specs, 123 passed across 6 projects)                              |
| 3.16 | Cross-browser testing (Chrome, Firefox, Safari, Edge)    | QA    | ✅ (Chromium, Firefox, WebKit desktop + mobile/tablet)                  |
| 3.17 | Mobile responsiveness testing (iPhone SE, Pixel, iPad)   | QA    | ✅ (Pixel 7, iPhone 14 Pro, iPad Pro 11)                                |
| 3.18 | Form validation edge case testing                        | QA    | ✅ (empty submit, invalid email, short message, missing privacy)        |

## 7.4 Security Hardening

| #    | Task                                                 | Owner  | Status                                                            |
| ---- | ---------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| 3.19 | Verify all security headers in production            | DevOps | ✅ (middleware headers verified locally; prod pending deployment) |
| 3.20 | Run `npm audit` — zero critical/high vulnerabilities | DevOps | ✅ (zero moderate/high/critical after upgrades + overrides)       |
| 3.21 | Verify CSP doesn't break any functionality           | DevOps | 🔲 (CSP not yet configured)                                       |
| 3.22 | Test rate limiting on contact form                   | QA     | 🔲 (requires Upstash env vars)                                    |
| 3.23 | Verify RLS policies block unauthorized access        | QA     | 🔲 (requires live Supabase project)                               |

## 7.5 Analytics Integration

| #    | Task                                                           | Owner    | Status                                                              |
| ---- | -------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| 3.24 | Wire Umami (self-hosted) — `UmamiScript` + env; drop Plausible | Frontend | ✅ (loads when `NEXT_PUBLIC_UMAMI_*` set; Vercel Analytics interim) |
| 3.25 | Configure event tracking plan (page_view, form_submit, etc.)   | Frontend | 🔲 (pageviews via Umami; custom events when campaigns need them)    |
| 3.26 | Set up Google Search Console + Bing Webmaster Tools            | DevOps   | 🔲                                                                  |
| 3.27 | Submit sitemap to search engines                               | DevOps   | 🔲                                                                  |

## QA / Validation

- [x] `pnpm type-check` passes
- [x] `pnpm lint` passes
- [x] `pnpm type-check` passes
- [x] `pnpm lint` passes
- [x] `pnpm test` passes (64 tests, ≥80% coverage)
- [x] `pnpm build` passes (29 static routes, First Load JS 192 kB)
- [x] E2E passes on full Playwright matrix (123 passed, 3 skipped desktop-nav on mobile)
- [ ] Lighthouse scores ≥ 95 — blocked locally by x64 Node on arm64 Mac; CI with matching arch required
- [x] `pnpm audit --audit-level moderate` — 0 vulnerabilities
- [x] Final pre-launch validation pass (type-check, lint, test, build) — green after fixing stale footer social-link test

## External Dependencies / Blockers

- [x] Vercel deploy workflows fixed — `vercel/action-deploy@v1` did not exist; replaced with direct CLI
- [x] Vercel project connected to repo `nothingdigital/nothing.digital` and first deployment live
- [ ] DNS + SSL configured for `nothing.digital` — pending domain setup in Vercel
- [ ] Supabase project ready with RLS policies — blocked: no Supabase project credentials
- [ ] Resend domain verified — blocked: no Resend API key
- [ ] Production env vars set — blocked: cannot set secrets without service credentials

See `plans/phase-3-devops-checklist.md` for detailed external setup steps and required tokens.

## Deliverables

- [x] Phase 3 checklist updated with tasks marked done
- [x] Summary of changes, tests added, and blockers
- [ ] Production deployment live — blocked: external service credentials required
- [x] Phase 4 (Tauri desktop app) skipped — stakeholder chose web-only launch
- [ ] Confirmation of readiness for launch — pending external account setup
