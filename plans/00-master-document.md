# Nothing.Digital — Master Project Document

> **Version:** 1.0  
> **Date:** 2026-08-04  
> **Status:** Phase 1–3 complete (close-outs pending) · Phase 4 skipped · Phase 5 launched (post-launch in progress) · Phase 6 in progress · Pack H client ops shipped · Growth tactics triage shipped — see `docs/growth-tactics.md`  
> **General Contractor:** Kimi (Orchestration Agent)  
> **Specialist Agents:** Principal Architect · DevOps Engineer · QA Engineer · Gap Analyst  
> **Domain:** `nothing.digital`

> **Last Updated:** 2026-08-07 — Admin wave + site polish on `main`; docs consolidated  
> **Next (live board only):** [`SCRATCHPAD.md`](../SCRATCHPAD.md) — do not duplicate remaining work here

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Critical Decision: The `nothing://` Protocol](#2-critical-decision-the-nothing-protocol)
3. [Project Overview](#3-project-overview)
4. [Team & Ownership](#4-team--ownership)
5. [Phase 1: Foundation & Infrastructure — Complete](#phase-1)
6. [Phase 2: Core Development — Complete](#phase-2)
7. [Phase 3: Integration, QA & Polish — Complete](#phase-3)
8. [Phase 4: The `nothing://` Experience — Skipped](#phase-4)
9. [Phase 5: Launch & Post-Launch — In Progress](#phase-5)
10. [Cross-Cutting Concerns](#10-cross-cutting-concerns)
11. [Risk Register](#11-risk-register)
12. [Phase 6: PikaPods & Ops Backend — In Progress](#phase-6)
13. [Reference Documents](#13-reference-documents)

---

## 1. Executive Summary

This master document consolidates the outputs of four specialist planning agents into a single, actionable implementation roadmap for **Nothing.Digital** — a digital services agency website.

### Specialist Agent Deliverables

| Agent                   | Document                      | Lines | Key Contribution                                                                                    |
| ----------------------- | ----------------------------- | ----- | --------------------------------------------------------------------------------------------------- |
| **Principal Architect** | `01-principal-architect.md`   | 2,763 | System architecture, component design, `nothing://` feasibility analysis, data architecture         |
| **DevOps Engineer**     | `02-devops-engineer.md`       | 949   | CI/CD pipelines, DNS/SSL, security headers, monitoring, cost estimation (~$95/mo)                   |
| **QA Engineer**         | `03-qa-engineer.md`           | 1,563 | Testing pyramid, WCAG 2.1 AA compliance, performance budgets, E2E strategy                          |
| **Gap Analyst**         | `04-gap-analysis.md`          | 555   | 67 gaps identified, 10 critical risks, stakeholder questions                                        |
| **PikaPods & Ops**      | `05-pikapods-integrations.md` | —     | Umami, Listmonk, n8n, Kuma, secondary pods, `/admin` dashboard, secretary CRM — costs + build specs |

### Estimated Timeline

| Phase                            | Duration      | Cumulative |
| -------------------------------- | ------------- | ---------- |
| Phase 1: Foundation              | 1 week        | Week 1     |
| Phase 2: Core Development        | 2–3 weeks     | Weeks 2–4  |
| Phase 3: QA & Polish             | 1 week        | Weeks 4–5  |
| Phase 4: `nothing://` Experience | Skipped       | —          |
| Phase 5: Launch & Post-Launch    | 1 week        | Weeks 5–6  |
| **Total**                        | **5–6 weeks** | —          |

### Budget Estimate

| Category                                                    | First-Year Cost  |
| ----------------------------------------------------------- | ---------------- |
| Infrastructure (Vercel Pro + Cloudflare Pro + Supabase Pro) | ~$780            |
| Tools & Services (Sentry, UptimeRobot, etc.)                | ~$156            |
| Domain (nothing.digital)                                    | ~$12–$20         |
| Email (Resend — free tier initially)                        | $0               |
| **Total**                                                   | **~$950–$1,000** |

---

## 2. Critical Decision: The `nothing://` Protocol

> **⚠️ STAKEHOLDER DECISION REQUIRED BEFORE PROCEEDING**

### The Finding

All four specialist agents independently confirm: **Displaying `nothing://` in a standard browser address bar for web content is technically impossible.** This is not a limitation of skill or tooling — it is a fundamental security invariant of modern web browsers.

### Why It's Impossible

| Reason                       | Explanation                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Browser Security Model**   | Browsers enforce "secure contexts" requiring `https://` or `localhost`. Custom protocols like `nothing://` are not recognized as secure origins. |
| **No Certificate Authority** | TLS certificates are bound to DNS names, not URI schemes. No CA issues certificates for `nothing://`.                                            |
| **No Search Indexing**       | Googlebot, Bingbot, and all search crawlers only follow `http://` and `https://`. `nothing://` content is invisible to search.                   |
| **No Omnibox API**           | Browser extensions have zero API access to modify the protocol portion of the address bar.                                                       |
| **DNS Cannot Help**          | DNS resolves domain names to IP addresses. It has no concept of URL schemes.                                                                     |

### The Only Viable Path: Tauri Desktop App

The **only** way to display `nothing://` in an address bar is to build a **desktop application** using Tauri (recommended) or Electron, where we control the entire window chrome.

| Approach                  | Bundle Size | Address Bar Control      | Cross-Platform        | Effort |
| ------------------------- | ----------- | ------------------------ | --------------------- | ------ |
| **Tauri (Recommended)**   | ~5 MB       | ✅ Full control          | macOS, Windows, Linux | Medium |
| **Electron**              | ~150 MB     | ✅ Full control          | macOS, Windows, Linux | Medium |
| **PWA Protocol Handlers** | N/A         | ❌ Only `web+nothing://` | Chrome/Edge only      | Low    |
| **Browser Extension**     | N/A         | ❌ Cannot modify omnibox | Chrome, Firefox, Edge | Low    |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WEB-ONLY ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🌐  WEB APP (Next.js + Vercel)                            │
│     URL: https://nothing.digital                            │
│     Audience: All users — primary entry point               │
│     SEO: Fully crawlable and indexable                      │
│                                                             │
│  🔗  SHARED LINKS                                           │
│     All social/email shares use https://nothing.digital     │
│     Universal resolver at /resolve?uri=... (optional)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Decision

**Option B — Selected:** Eliminate the `nothing://` display requirement. The web app (`https://nothing.digital`) is the sole product. `nothing://` may be used as a brand metaphor in marketing, but no desktop app, PWA protocol handlers, or browser extension will be built.

---

## 3. Project Overview

### Vision

Nothing.Digital is a digital services company specializing in website development, custom software, applications, and email marketing. The website serves as portfolio, lead generation tool, resource hub, and brand statement.

### Target Audience

| Segment          | Need                         | Pain Point                             | Our Solution                       |
| ---------------- | ---------------------------- | -------------------------------------- | ---------------------------------- |
| Small Businesses | Professional online presence | Limited budget, no technical expertise | Affordable turnkey solutions       |
| Startups         | Scalable digital products    | Rapid growth, limited resources        | Custom software tailored to growth |
| Marketers        | Email marketing automation   | Low engagement, time-consuming         | Data-driven automation strategies  |
| Agencies         | White-label digital services | Client demands exceed capacity         | White-label dev partnership        |

### Sitemap

```
📌 Home
├── Hero Section
├── Services Overview (4 cards)
├── Featured Case Studies
├── Trust Indicators
└── Newsletter Signup

📌 Services
├── Website Development
│   ├── Custom Websites
│   ├── E-Commerce
│   ├── Landing Pages
│   └── Maintenance
├── Software Solutions
│   ├── Bespoke Software
│   ├── Automation Tools
│   └── Integrations
├── Applications
│   ├── Mobile Apps
│   ├── Web Apps
│   └── SaaS Products
└── Email Marketing
    ├── Campaign Strategy
    ├── Automation
    └── Analytics

📌 Portfolio
├── Filterable Case Studies
├── Client Testimonials
└── Industries Served

📌 About
├── Our Story
├── Team
├── Values
└── Why Choose Us

📌 Blog
├── Industry Insights
├── Guides & Tutorials
└── Company News

📌 Contact
├── Contact Form
├── Consultation Booking (Calendly)
└── FAQ

📌 Legal
├── Privacy Policy
├── Terms of Service
└── Accessibility Statement
```

### Tech Stack

| Layer     | Technology                             | Purpose                              |
| --------- | -------------------------------------- | ------------------------------------ |
| Framework | Next.js 14 (App Router)                | SSR/SSG/ISR, SEO-friendly            |
| Language  | TypeScript 5.x                         | Type safety                          |
| Styling   | Tailwind CSS 3.x + shadcn/ui           | Utility-first, accessible components |
| State     | Zustand (UI) + TanStack Query (Server) | Separated concerns                   |
| Forms     | React Hook Form + Zod                  | Type-safe validation                 |
| Animation | Framer Motion                          | Declarative, performant              |
| Content   | MDX (next-mdx-remote)                  | Blog posts & case studies            |
| Backend   | Vercel Edge Functions                  | Serverless APIs                      |
| Database  | Supabase (PostgreSQL)                  | Contact submissions, newsletter      |
| Email     | Resend                                 | Transactional & notification emails  |
| Hosting   | Vercel + Cloudflare                    | Edge deployment, DNS, CDN            |
| Testing   | Vitest + Playwright                    | Unit + E2E                           |
| Desktop   | Tauri (Phase 4)                        | `nothing://` experience              |

---

## 4. Team & Ownership

### Roles & Responsibilities

| Role                    | Owner                | Responsibilities                                                                    |
| ----------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| **General Contractor**  | Kimi (Orchestration) | Cross-team coordination, master document, milestone tracking, risk management       |
| **Principal Architect** | Agent-0              | System architecture, component design, data flow, API design, `nothing://` strategy |
| **DevOps Engineer**     | Agent-1              | CI/CD, infrastructure, DNS/SSL, security, monitoring, cost management               |
| **QA Engineer**         | Agent-2              | Testing strategy, accessibility, performance budgets, cross-browser validation      |
| **Gap Analyst**         | Agent-3              | Risk identification, scope validation, stakeholder questions, compliance            |
| **Frontend Developer**  | TBD                  | Component implementation, page development, animation integration                   |
| **Backend Developer**   | TBD                  | API routes, database schema, integrations (Resend, Calendly, Supabase)              |
| **Content Writer**      | TBD                  | Copywriting, blog posts, case studies, SEO metadata                                 |
| **Designer**            | TBD                  | Visual design, brand assets, wireframes, micro-interactions                         |

### Communication Protocol

- **Daily Standups:** Async updates in project channel (Slack/Discord)
- **Weekly Review:** Every Friday, review completed tasks and blockers
- **Milestone Gates:** Go/No-Go decision at end of each phase
- **Document Source of Truth:** This master document + linked specialist plans

---

<a id="phase-1"></a>

## 5. Phase 1: Foundation & Infrastructure — Complete

> **To-Do:** Verify remaining external-account gaps and document credential-only steps.
>
> **Verified live:** Vercel project + custom domain + `www` redirect; Cloudflare authoritative DNS + Vercel edge SSL; Supabase project with migrations `001`/`002` applied; Resend DKIM present and domain verified in prior run; core production env vars set (site + contact form work).
>
> **Pending (requires dashboard/credentials):** GitHub branch-protection/secret-scanning review, Cloudflare DNSSEC/WAF only if proxy is enabled. List mock environments done; listmonk: true.

**ponytail:** Resend SPF now includes `_spf.resend.com` directly — no separate SPF migration needed.

> **Duration:** 1 week  
> **Goal:** Repository, CI/CD, infrastructure, and design system are ready for development.  
> **Gate:** All environment variables configured, first preview deployment successful.

### 5.1 Repository Setup

| Step | Task                                                                     | Owner  | Effort | Status |
| ---- | ------------------------------------------------------------------------ | ------ | ------ | ------ |
| 1.1  | Create GitHub repo `nothing-digital` with monorepo structure (Turborepo) | DevOps | S      | 🔲     |
| 1.2  | Add branch protection rules (main: 2 approvals, staging: 1 approval)     | DevOps | S      | 🔲     |
| 1.3  | Add CODEOWNERS, PR template, issue templates (bug, feature)              | DevOps | S      | 🔲     |
| 1.4  | Configure Dependabot for dependency updates                              | DevOps | S      | 🔲     |
| 1.5  | Enable GitHub secret scanning and push protection                        | DevOps | S      | 🔲     |

### 5.2 CI/CD Pipeline

| Step | Task                                                            | Owner  | Effort | Status |
| ---- | --------------------------------------------------------------- | ------ | ------ | ------ |
| 1.6  | Create `pr-validation.yml` — lint, type-check, build, test      | DevOps | M      | 🔲     |
| 1.7  | Create `deploy-production.yml` — auto-deploy on merge to `main` | DevOps | S      | 🔲     |
| 1.8  | Create `deploy-preview.yml` — preview deployments on PRs        | DevOps | S      | 🔲     |
| 1.9  | Configure Lighthouse CI with performance budgets                | DevOps | M      | 🔲     |
| 1.10 | Add axe-core accessibility checks in CI                         | DevOps | S      | 🔲     |
| 1.11 | Add pre-commit hooks (Husky + lint-staged)                      | DevOps | S      | 🔲     |

### 5.3 Infrastructure

| Step | Task                                                               | Owner  | Effort | Status |
| ---- | ------------------------------------------------------------------ | ------ | ------ | ------ |
| 1.12 | Create Vercel project, connect GitHub repo                         | DevOps | S      | 🔲     |
| 1.13 | Configure Cloudflare DNS records (A, CNAME, MX, TXT)               | DevOps | S      | 🔲     |
| 1.14 | Enable Cloudflare SSL (Full Strict), HSTS, DNSSEC                  | DevOps | S      | 🔲     |
| 1.15 | Add `www` → apex redirect in `vercel.json`                         | DevOps | S      | 🔲     |
| 1.16 | Set up Supabase project, enable connection pooling                 | DevOps | S      | 🔲     |
| 1.17 | Configure Resend domain verification (DKIM, SPF)                   | DevOps | S      | 🔲     |
| 1.18 | Add all environment variables to Vercel + GitHub Secrets           | DevOps | S      | 🔲     |
| 1.19 | Configure Cloudflare security headers (CSP, HSTS, X-Frame-Options) | DevOps | M      | 🔲     |
| 1.20 | Set up Cloudflare WAF + rate limiting rules                        | DevOps | S      | 🔲     |

### 5.4 Project Initialization

| Step | Task                                                                                          | Owner     | Effort | Status |
| ---- | --------------------------------------------------------------------------------------------- | --------- | ------ | ------ |
| 1.21 | Initialize Next.js 14 project with App Router, TypeScript, Tailwind                           | Architect | S      | 🔲     |
| 1.22 | Install dependencies: shadcn/ui, Framer Motion, React Hook Form, Zod, Zustand, TanStack Query | Architect | S      | 🔲     |
| 1.23 | Set up folder structure (atoms, molecules, organisms, templates)                              | Architect | S      | 🔲     |
| 1.24 | Configure `next.config.js` (images, headers, redirects)                                       | Architect | S      | 🔲     |
| 1.25 | Set up TypeScript path aliases and strict mode                                                | Architect | S      | 🔲     |
| 1.26 | Configure Tailwind theme (colors, fonts, breakpoints) per brand spec                          | Architect | S      | 🔲     |
| 1.27 | Set up Vitest + React Testing Library + Playwright                                            | QA        | M      | 🔲     |

### 5.5 Design System Foundation

| Step | Task                                                                 | Owner     | Effort | Status |
| ---- | -------------------------------------------------------------------- | --------- | ------ | ------ |
| 1.28 | Create base atom components (Button, Input, Badge, Icon)             | Architect | M      | 🔲     |
| 1.29 | Create molecule components (ServiceCard, FormField, TestimonialCard) | Architect | M      | 🔲     |
| 1.30 | Set up `next/font` with Inter + JetBrains Mono                       | Architect | S      | 🔲     |
| 1.31 | Create layout templates (MarketingLayout, MinimalLayout)             | Architect | S      | 🔲     |
| 1.32 | Implement dark mode support (next-themes)                            | Architect | S      | 🔲     |

### 5.6 Monitoring Setup

| Step | Task                                            | Owner  | Effort | Status |
| ---- | ----------------------------------------------- | ------ | ------ | ------ |
| 1.33 | Set up Sentry error tracking (DSN, source maps) | DevOps | S      | ✅     |
| 1.34 | Enable Speed Insights; disable Vercel Analytics | DevOps | S      | ✅     |
| 1.35 | Configure UptimeRobot monitoring                | DevOps | S      | 🔲     |

### Phase 1 Deliverables

- [ ] GitHub repo with full CI/CD pipeline
- [ ] Vercel project connected with preview deployments
- [ ] Cloudflare DNS + SSL configured
- [ ] Supabase project ready with connection pooling
- [ ] Resend domain verified
- [ ] Design system atoms and molecules implemented
- [ ] Testing framework configured
- [ ] All monitoring tools active

---

<a id="phase-2"></a>

## 6. Phase 2: Core Development — Complete

> **To-Do:** ~~Add client-logo trust indicators, full Calendly embed (when volume justifies)~~ Done locally: anonymized client-logo strip on home page and env-gated lazy-loaded Calendly iframe on `/contact`. Reach Lighthouse ≥ 90 remains blocked on matching-arch CI runner.

> **Duration:** 2–3 weeks  
> **Goal:** All core pages built, forms functional, content populated.  
> **Gate:** All pages render correctly, forms submit to Supabase + Resend, Lighthouse scores ≥ 90.

### 6.1 Database Schema & API

| Step | Task                                                                                  | Owner     | Effort | Status |
| ---- | ------------------------------------------------------------------------------------- | --------- | ------ | ------ |
| 2.1  | Design Supabase schema (contact_submissions, newsletter_subscribers, portfolio_items) | Architect | M      | 🔲     |
| 2.2  | Write initial migration files (`/supabase/migrations/`)                               | Architect | S      | 🔲     |
| 2.3  | Enable RLS on all tables with strict policies                                         | Architect | M      | 🔲     |
| 2.4  | Create seed data for dev/staging environments                                         | Architect | S      | 🔲     |
| 2.5  | Implement `/api/contact` route (validation, Supabase insert, Resend email)            | Backend   | M      | 🔲     |
| 2.6  | Implement `/api/newsletter` route (subscribe, duplicate check, welcome email)         | Backend   | S      | 🔲     |
| 2.7  | Implement `/api/health` route for uptime monitoring                                   | Backend   | S      | 🔲     |
| 2.8  | Add server-side rate limiting (Upstash Redis / Vercel KV)                             | Backend   | M      | 🔲     |
| 2.9  | Add honeypot field + Cloudflare Turnstile to forms                                    | Backend   | S      | 🔲     |

### 6.2 Global Components

| Step | Task                                                | Owner    | Effort | Status |
| ---- | --------------------------------------------------- | -------- | ------ | ------ |
| 2.10 | Build Navigation (desktop + mobile hamburger)       | Frontend | M      | 🔲     |
| 2.11 | Build Footer (links, social, newsletter signup)     | Frontend | M      | 🔲     |
| 2.12 | Build Cookie Consent Banner (GDPR/CCPA compliant)   | Frontend | M      | 🔲     |
| 2.13 | Build Scroll-to-top button                          | Frontend | S      | 🔲     |
| 2.14 | Build loading.tsx skeletons for all routes          | Frontend | M      | 🔲     |
| 2.15 | Build error.tsx (500) and not-found.tsx (404) pages | Frontend | S      | 🔲     |

### 6.3 Homepage

| Step | Task                                                  | Owner    | Effort | Status                                               |
| ---- | ----------------------------------------------------- | -------- | ------ | ---------------------------------------------------- |
| 2.16 | Hero Section (headline, subheadline, CTA, background) | Frontend | M      | 🔲                                                   |
| 2.17 | Services Overview (4-card grid with icons)            | Frontend | M      | 🔲                                                   |
| 2.18 | Featured Case Studies (2 highlighted with metrics)    | Frontend | M      | ✅ (2026-08-06; anonymized MDX + home Selected work) |
| 2.19 | Trust Indicators (client logos, stats, testimonials)  | Frontend | M      | 🔲 logos later; quotes in case studies               |
| 2.20 | Newsletter Signup section                             | Frontend | S      | 🔲                                                   |

### 6.4 Service Pages

| Step | Task                                  | Owner    | Effort | Status |
| ---- | ------------------------------------- | -------- | ------ | ------ |
| 2.21 | Create reusable Service Page template | Frontend | M      | 🔲     |
| 2.22 | Website Development page              | Frontend | M      | 🔲     |
| 2.23 | Software Solutions page               | Frontend | M      | 🔲     |
| 2.24 | Applications page                     | Frontend | M      | 🔲     |
| 2.25 | Email Marketing page                  | Frontend | M      | 🔲     |

### 6.5 Portfolio Page

| Step | Task                                                | Owner    | Effort | Status                                   |
| ---- | --------------------------------------------------- | -------- | ------ | ---------------------------------------- |
| 2.26 | Create case study MDX files with frontmatter schema | Content  | M      | ✅ (3 anonymized studies, 2026-08-06)    |
| 2.27 | Build filterable grid with client-side filtering    | Frontend | M      | 🔲                                       |
| 2.28 | Build portfolio detail page (`/portfolio/[slug]`)   | Frontend | M      | 🔲                                       |
| 2.29 | Add client testimonials section                     | Frontend | S      | ✅ (per case study; named clients LATER) |

### 6.6 About Page

| Step | Task                                | Owner    | Effort | Status |
| ---- | ----------------------------------- | -------- | ------ | ------ |
| 2.30 | Our Story section                   | Content  | S      | 🔲     |
| 2.31 | Team section (photos, names, roles) | Frontend | S      | 🔲     |
| 2.32 | Values section                      | Content  | S      | 🔲     |
| 2.33 | Why Choose Us / differentiators     | Content  | S      | 🔲     |

### 6.7 Blog

| Step | Task                                             | Owner     | Effort | Status |
| ---- | ------------------------------------------------ | --------- | ------ | ------ |
| 2.34 | Set up MDX processing pipeline (next-mdx-remote) | Architect | M      | 🔲     |
| 2.35 | Create blog list page with categories            | Frontend  | M      | 🔲     |
| 2.36 | Create blog post page (`/blog/[slug]`)           | Frontend  | M      | 🔲     |
| 2.37 | Write 3 seed blog posts                          | Content   | M      | 🔲     |
| 2.38 | Add pagination for blog list                     | Frontend  | S      | 🔲     |

### 6.8 Contact Page

| Step | Task                                                         | Owner    | Effort | Status                                       |
| ---- | ------------------------------------------------------------ | -------- | ------ | -------------------------------------------- |
| 2.39 | Contact form (name, email, phone, service dropdown, message) | Frontend | M      | 🔲                                           |
| 2.40 | Embed Calendly booking widget                                | Frontend | S      | ✅ CTA link (env-gated); full embed deferred |
| 2.41 | FAQ accordion section                                        | Frontend | S      | 🔲                                           |
| 2.42 | Contact info + social links                                  | Frontend | S      | 🔲                                           |

### 6.9 Legal Pages

| Step | Task                         | Owner   | Effort | Status |
| ---- | ---------------------------- | ------- | ------ | ------ |
| 2.43 | Privacy Policy page          | Content | M      | 🔲     |
| 2.44 | Terms of Service page        | Content | M      | 🔲     |
| 2.45 | Accessibility Statement page | Content | S      | 🔲     |

### 6.10 SEO Foundation

| Step | Task                                                              | Owner    | Effort | Status |
| ---- | ----------------------------------------------------------------- | -------- | ------ | ------ |
| 2.46 | Implement metadata on all pages (title, description, OG, Twitter) | Frontend | M      | 🔲     |
| 2.47 | Create `sitemap.xml` (dynamic route or next-sitemap)              | Frontend | S      | 🔲     |
| 2.48 | Create `robots.txt`                                               | Frontend | S      | 🔲     |
| 2.49 | Add JSON-LD structured data (Organization, Service, BlogPosting)  | Frontend | M      | 🔲     |
| 2.50 | Auto-generate OG images with `@vercel/og`                         | Frontend | M      | 🔲     |

### Phase 2 Deliverables

- [ ] All 10+ pages built and styled
- [ ] Contact and newsletter forms fully functional
- [ ] Case studies and blog posts populated
- [ ] SEO metadata complete across all pages
- [ ] Cookie consent banner active
- [ ] Legal pages published

---

<a id="phase-3"></a>

## 7. Phase 3: Integration, QA & Polish — Complete

> **To-Do:** Complete search-engine verification + sitemap submission; document Lighthouse CI arch fix.
>
> **Verified live:** `/sitemap.xml` and `/robots.txt` serve `200`; Google Search Console `TXT` verification record is in DNS.
>
> **Pending:** Verify Google Search Console property and submit sitemap; add Bing `TXT` verification record and submit sitemap; run Lighthouse CI in GitHub Actions only (skip local arm64/x64 Chrome mismatch).

> **Duration:** 1 week  
> **Goal:** WCAG 2.1 AA compliance, performance budgets met, all tests passing.  
> **Gate:** Lighthouse scores ≥ 95 (Performance, Accessibility, SEO), zero critical a11y violations, all E2E tests green.

### 7.1 Accessibility Audit

| Step | Task                                                     | Owner | Effort | Status |
| ---- | -------------------------------------------------------- | ----- | ------ | ------ |
| 3.1  | Run automated axe-core audit across all pages            | QA    | S      | 🔲     |
| 3.2  | Manual keyboard navigation test (Tab order, focus traps) | QA    | M      | 🔲     |
| 3.3  | Screen reader test (VoiceOver / NVDA)                    | QA    | M      | 🔲     |
| 3.4  | Color contrast audit (all text meets 4.5:1)              | QA    | S      | 🔲     |
| 3.5  | Verify ARIA labels on interactive elements               | QA    | S      | 🔲     |
| 3.6  | Test `prefers-reduced-motion` compliance                 | QA    | S      | 🔲     |

### 7.2 Performance Optimization

| Step | Task                                                  | Owner    | Effort | Status |
| ---- | ----------------------------------------------------- | -------- | ------ | ------ |
| 3.7  | Audit bundle size with `@next/bundle-analyzer`        | QA       | S      | 🔲     |
| 3.8  | Optimize images (WebP/AVIF, next/image, lazy loading) | Frontend | M      | 🔲     |
| 3.9  | Implement dynamic imports for below-fold sections     | Frontend | M      | 🔲     |
| 3.10 | Verify font loading strategy (FOUT prevention)        | Frontend | S      | 🔲     |
| 3.11 | Cache static assets via Cloudflare page rules         | DevOps   | S      | 🔲     |
| 3.12 | Run Lighthouse CI and fix any failing assertions      | QA       | M      | 🔲     |

### 7.3 Testing

| Step | Task                                                     | Owner | Effort | Status |
| ---- | -------------------------------------------------------- | ----- | ------ | ------ |
| 3.13 | Write unit tests for all atom components (≥80% coverage) | QA    | M      | 🔲     |
| 3.14 | Write integration tests for API routes                   | QA    | M      | 🔲     |
| 3.15 | Write E2E tests for critical user journeys (Playwright)  | QA    | M      | 🔲     |
| 3.16 | Cross-browser testing (Chrome, Firefox, Safari, Edge)    | QA    | M      | 🔲     |
| 3.17 | Mobile responsiveness testing (iPhone SE, Pixel, iPad)   | QA    | M      | 🔲     |
| 3.18 | Form validation edge case testing                        | QA    | S      | 🔲     |

### 7.4 Security Hardening

| Step | Task                                                 | Owner  | Effort | Status |
| ---- | ---------------------------------------------------- | ------ | ------ | ------ |
| 3.19 | Verify all security headers in production            | DevOps | S      | 🔲     |
| 3.20 | Run `npm audit` — zero critical/high vulnerabilities | DevOps | S      | 🔲     |
| 3.21 | Verify CSP doesn't break any functionality           | DevOps | S      | 🔲     |
| 3.22 | Test rate limiting on contact form                   | QA     | S      | 🔲     |
| 3.23 | Verify RLS policies block unauthorized access        | QA     | S      | 🔲     |

### 7.5 Analytics Integration

| Step | Task                                                                     | Owner    | Effort | Status  |
| ---- | ------------------------------------------------------------------------ | -------- | ------ | ------- |
| 3.24 | Install Umami (PikaPods) — cookieless, drop Plausible / Vercel Analytics | Frontend | S      | ✅ Live |
| 3.25 | Configure event tracking plan (page_view, form_submit, etc.)             | Frontend | S      | 🔲      |
| 3.26 | Set up Google Search Console + Bing Webmaster Tools                      | DevOps   | S      | 🔲      |
| 3.27 | Submit sitemap to search engines                                         | DevOps   | S      | 🔲      |

### Phase 3 Deliverables

- [ ] WCAG 2.1 AA compliance verified
- [ ] Lighthouse scores ≥ 95 across all pages
- [ ] All unit, integration, and E2E tests passing
- [ ] Cross-browser and mobile testing complete
- [ ] Security audit passed
- [ ] Analytics tracking active

---

<a id="phase-4"></a>

## 8. Phase 4: The `nothing://` Experience — Skipped

> **Status:** Skipped  
> **Reason:** Stakeholder decided to eliminate the `nothing://` display requirement and focus entirely on the web experience (Option B from Section 2). No Tauri desktop app, PWA protocol handlers, or browser extension will be built.

---

<a id="phase-5"></a>

## 9. Phase 5: Launch & Post-Launch — In Progress

> **To-Do:** Post-launch Week 1 monitoring, HubSpot CRM integration, content calendar, and team training.

> **Duration:** 1 week  
> **Goal:** Live production site, monitoring active, team trained.  
> **Gate:** DNS propagated, forms tested end-to-end, monitoring alerts confirmed.

### 9.1 Pre-Launch Checklist

| Step | Task                                                      | Owner  | Effort | Status                                                                    |
| ---- | --------------------------------------------------------- | ------ | ------ | ------------------------------------------------------------------------- |
| 5.1  | Final DNS propagation check (dnschecker.org)              | DevOps | S      | ✅ Script + runbook in `docs/runbooks/dns.md`                             |
| 5.2  | SSL Labs rating A+ verification                           | DevOps | S      | ✅ Smoke check script + runbook; HSTS includeSubDomains/preload added     |
| 5.3  | End-to-end form submission test (contact + newsletter)    | QA     | S      | ✅ (contact verified live 2026-08-05; newsletter pending)                 |
| 5.4  | Email delivery test (confirmation + team notification)    | QA     | S      | ✅ (both delivered, 2026-08-05)                                           |
| 5.5  | Calendly embed functionality test                         | QA     | S      | ✅ Playwright smoke test in `e2e/calendly.spec.ts`                        |
| 5.6  | Social share link preview test (OG images, meta tags)     | QA     | S      | ✅ Playwright OG/Twitter meta test + image reachability                   |
| 5.7  | 404 and 500 error page test                               | QA     | S      | ✅ Custom error layout + component tests + 404 E2E; global-error UI ready |
| 5.8  | Cookie consent banner test (accept/reject/essential-only) | QA     | S      | ✅ (shipped 2026-08-06; gates analytics on accept)                        |

### 9.2 Launch Day

| Step | Task                                           | Owner   | Effort | Status                                         |
| ---- | ---------------------------------------------- | ------- | ------ | ---------------------------------------------- |
| 5.9  | Merge `staging` → `main` (Vercel auto-deploys) | DevOps  | S      | ✅ (trunk-based on `main`; auto-deploys live)  |
| 5.10 | Verify production URL loads correctly          | DevOps  | S      | ✅ (https://nothing.digital live)              |
| 5.11 | Announce launch on social media                | Content | S      | ✅ Copy in `content/launch/social-posts.md`    |
| 5.12 | Send launch email to newsletter subscribers    | Content | S      | ✅ Copy in `content/emails/launch-campaign.md` |

### 9.3 Post-Launch Week 1

| Step | Task                                            | Owner   | Effort | Status |
| ---- | ----------------------------------------------- | ------- | ------ | ------ |
| 5.13 | Monitor Sentry for errors (daily review)        | DevOps  | S      | 🔲     |
| 5.14 | Review Umami Analytics dashboard                | Content | S      | 🔲     |
| 5.15 | Check Google Search Console for indexing        | DevOps  | S      | 🔲     |
| 5.16 | Review Core Web Vitals in Vercel Speed Insights | QA      | S      | 🔲     |
| 5.17 | Collect and triage user feedback                | Content | S      | 🔲     |

### 9.4 Post-Launch Month 1–3

| Step | Task                                                 | Owner   | Effort | Status                                                |
| ---- | ---------------------------------------------------- | ------- | ------ | ----------------------------------------------------- |
| 5.18 | Integrate HubSpot CRM for lead tracking              | Backend | M      | 🔲                                                    |
| 5.19 | Set up email marketing platform (ConvertKit/Beehiiv) | Content | M      | 🔲                                                    |
| 5.20 | Publish first post-launch blog post                  | Content | M      | ✅ (`content/blog/soft-launch-notes.mdx`, 2026-08-06) |
| 5.21 | Add new portfolio case study                         | Content | M      | ✅ (studio launch case study; no invented clients)    |
| 5.22 | Run first disaster recovery drill                    | DevOps  | S      | 🔲                                                    |
| 5.23 | Quarterly dependency update (Dependabot PRs)         | DevOps  | S      | 🔲                                                    |

### Phase 5 Deliverables

- [x] Production site live at `https://nothing.digital`
- [ ] All monitoring dashboards active (Sentry wired; needs `SENTRY_DSN` env)
- [ ] CRM integrated and lead pipeline operational
- [ ] Content calendar established
- [ ] Team trained on deployment and rollback procedures

---

## 10. Cross-Cutting Concerns

### 10.1 Coding Standards

All code must follow **never-nesting** and **SOLID** principles:

- **Never-nesting:** Avoid deeply nested `if`/`for`/`try` blocks. Prefer early returns, guard clauses, and small single-purpose functions.
- **Single Responsibility:** Each function, component, and module does exactly one thing.
- **Open/Closed:** Extend behavior through composition, not by modifying existing code.
- **Liskov Substitution:** Subtypes must be fully interchangeable with their base types.
- **Interface Segregation:** Keep interfaces small and client-specific.
- **Dependency Inversion:** Depend on abstractions, not concrete implementations.

These standards are enforced through code review, lint rules, and pre-commit hooks.

### 10.2 Security Checklist

Applies to **all phases**:

- [ ] RLS enabled on all Supabase tables
- [ ] Service role key never exposed client-side
- [ ] Rate limiting on all public API routes
- [ ] Honeypot + CAPTCHA on contact form
- [ ] CSP headers configured and tested
- [ ] HSTS with preload
- [ ] X-Frame-Options: DENY
- [ ] Dependabot alerts monitored weekly
- [ ] Secret scanning enabled
- [ ] Signed commits on `main`

### 10.3 Accessibility Checklist

Applies to **all phases**:

- [ ] Semantic HTML (no div soup)
- [ ] All images have alt text
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation works for all features
- [ ] ARIA labels on icon-only buttons
- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] Form errors announced to screen readers
- [ ] Skip-to-content link on all pages
- [ ] axe-core passes in CI

### 10.4 Performance Budgets

| Metric                         | Budget   | Owner     |
| ------------------------------ | -------- | --------- |
| First Contentful Paint (FCP)   | ≤ 1.8s   | QA        |
| Largest Contentful Paint (LCP) | ≤ 2.5s   | QA        |
| Cumulative Layout Shift (CLS)  | ≤ 0.1    | QA        |
| Total Blocking Time (TBT)      | ≤ 200ms  | QA        |
| Time to First Byte (TTFB)      | ≤ 600ms  | DevOps    |
| Initial JS Bundle (gzipped)    | ≤ 200 KB | Architect |
| Image weight per page          | ≤ 500 KB | Frontend  |

### 10.5 Content Workflow

| Stage    | Responsible    | Tool                       | Output         |
| -------- | -------------- | -------------------------- | -------------- |
| Ideation | Content Writer | Notion / Trello            | Content brief  |
| Draft    | Content Writer | Google Docs / Notion       | Draft copy     |
| Review   | Stakeholder    | Google Docs comments       | Approved copy  |
| Publish  | Developer      | Git commit + Vercel deploy | Live page/post |

---

## 11. Risk Register

| #   | Risk                               | Likelihood | Impact   | Mitigation                                                                                | Owner              |
| --- | ---------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------- | ------------------ |
| 1   | **`nothing://` delays launch**     | High       | Critical | Re-scope to hybrid (web first, desktop later). Get stakeholder sign-off ASAP.             | General Contractor |
| 2   | **GDPR fine (no cookie consent)**  | Medium     | Critical | Implement cookie consent before any tracking scripts. Draft privacy policy before launch. | Gap Analyst        |
| 3   | **Data breach (no RLS)**           | High       | Critical | Enable RLS on all tables before accepting real user data.                                 | Architect          |
| 4   | **Contact form spam/DDoS**         | High       | Medium   | Implement rate limiting + CAPTCHA before going live.                                      | Backend            |
| 5   | **Poor Core Web Vitals**           | Medium     | High     | Define image optimization, font loading, and caching strategy in MVP.                     | QA                 |
| 6   | **No lead tracking (no CRM)**      | High       | High     | Integrate HubSpot or lightweight CRM within 2 weeks of launch.                            | Gap Analyst        |
| 7   | **Accessibility lawsuit**          | Low        | High     | WCAG 2.1 AA audit before launch. Add accessibility statement.                             | QA                 |
| 8   | **SEO invisible at launch**        | Medium     | High     | Implement metadata, sitemap, and structured data before launch.                           | Frontend           |
| 9   | **Certificate misconfiguration**   | Low        | Critical | Cloudflare + Vercel setup checklist. Test SSL Labs rating before launch.                  | DevOps             |
| 10  | **Scope creep from undefined CMS** | Medium     | Medium   | Lock content workflow to MDX + Git for MVP. Evaluate headless CMS post-launch.            | Architect          |

---

<a id="phase-6"></a>

## 12. Phase 6: PikaPods & Ops Backend — In Progress

> **To-Do:** Confirm `002_client_ops.sql` is applied; decide on n8n pod.
>
> **Verified:** `clients`, `invoices`, `client_assets`, `client_work_items` tables exist — migration `002_client_ops.sql` is applied.
>
> **Decision:** n8n pod deferred (no active Slack/Listmonk fan-out use case); `notifyN8n()` remains env-gated no-op.

> **Status:** In progress — 6.1–6.4 live; 6.5 n8n deferred; **Pack H client ops shipped**
> **Detail doc:** [`05-pikapods-integrations.md`](./05-pikapods-integrations.md)  
> **Goal:** Sidecar open-source tools on PikaPods + owner/secretary management software alongside the client-facing site.

### Done vs next vs later

|           | Work                                                                                                                                                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Done**  | `/admin`; Umami + Calendly + Listmonk live; n8n/Kuma code ready; **Pack H** clients/billing/assets/work (admin-only); admin follow-ups 1–6 (ops glance, inbox→client, newsletter CSV, work sort, health chips, asset `monitor_url`)                  |
| **Next**  | Apply `003_asset_monitor_url.sql` (+ `004_profiles.sql` if needed); Bing TXT + GSC/Bing sitemaps; SPF duplicate cleanup; activate Listmonk drip; founding outreach (2 slots) — `docs/runbooks/ops-credentials.md` + `docs/runbooks/listmonk-drip.md` |
| **Later** | Calendly webhook/`bookings`; Kuma; secretary roles; n8n Slack fan-out; IT monitoring                                                                                                                                                                 |

### Scope (ponytail order)

| Step | Work                                              | Est. $/mo | Gate                                           |
| ---- | ------------------------------------------------- | --------- | ---------------------------------------------- |
| 6.1  | Owner `/admin` inbox (Supabase Auth magic link)   | $0        | ✅ code; gate: Auth + `ADMIN_EMAILS`           |
| 6.2  | Umami on PikaPods → drop Vercel Analytics         | ~$1.80    | ✅ Live                                        |
| 6.3  | Calendly on `/contact` (+ webhook when volume)    | $0–10     | ✅ Live; webhook deferred                      |
| 6.4  | Listmonk when campaigns start                     | ~$2–3     | ✅ Live; campaign content pending              |
| 6.5  | n8n when Slack/Listmonk fan-out needed            | ~$4–5     | 🟡 code ready; 🔲 pod + webhook env            |
| 6.6  | Uptime Kuma only if free UptimeRobot insufficient | ~$1.80    | 🟡 admin link ready; prefer UptimeRobot        |
| 6.7  | Secretary role (Phase B) on hire                  | $0        | Least-privilege staff login                    |
| 6.8  | Secondary pods (FreeScout, etc.)                  | defer     | See §6 of detail doc — default **no**          |
| 7.1  | Pack H client accounts + manual billing           | $0        | ✅ code; apply `002_client_ops.sql`            |
| 7.2  | Pack H assets + work queue                        | $0        | ✅ code                                        |
| 7.3  | Client URL uptime links on assets                 | $0–2      | ✅ `monitor_url` + edit page (migration `003`) |
| 7.4  | IT asset monitoring                               | defer     | ⬜ When IT retainers exist                     |

**Year-1 recommended pack:** Admin + Umami + Listmonk ≈ **$5–15/mo** incremental.

**Standards:** SOLID module boundaries, never-nesting critical paths, YAGNI on secondary pods and first-party booking until volume hurts.

**Client ops runbook:** [`docs/runbooks/client-ops.md`](../docs/runbooks/client-ops.md)

---

## 13. Reference Documents

| Document                     | Path                                 | Description                                                                                                            |
| ---------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Project Brief**            | Original attachment                  | Source requirements from stakeholder                                                                                   |
| **Principal Architect Plan** | `/plans/01-principal-architect.md`   | Full architecture, component design, `nothing://` deep-dive                                                            |
| **DevOps Plan**              | `/plans/02-devops-engineer.md`       | CI/CD, infrastructure, security, monitoring, cost details                                                              |
| **QA Strategy**              | `/plans/03-qa-engineer.md`           | Testing pyramid, a11y compliance, performance budgets, E2E specs                                                       |
| **Gap Analysis**             | `/plans/04-gap-analysis.md`          | 67 gaps, risk register, stakeholder questions, compliance requirements                                                 |
| **PikaPods & Ops Backend**   | `/plans/05-pikapods-integrations.md` | Sidecar OSS pods (Umami/Listmonk/n8n/Kuma), cost rollup, `/admin` + secretary phases                                   |
| **Growth Tactics**           | `/docs/growth-tactics.md`            | Full yes/no/later triage, cadence, drips, ballpark ranges                                                              |
| **Conversion Boost**         | `/docs/conversion-boost.md`          | YAGNI features for booking/scheduling lift; admin/client ideas + pitch deck outline                                    |
| **Customer Facing Plan**     | `/docs/customer-facing-plan.md`      | YAGNI improvements for booking/scheduling on public site; steps for carousel, prefill, schema, measurement, pitch deck |
| **Live board**               | `/SCRATCHPAD.md`                     | Remaining owner/agent work — only live checklist                                                                       |
| **Docs index**               | `/docs/README.md`                    | Map of SoTs vs archive                                                                                                 |
| **Ops credentials**          | `/docs/runbooks/ops-credentials.md`  | Dashboard / env / migrations / AI enablement                                                                           |
| **Next Steps**               | `/docs/next-steps.md`                | Stub → SCRATCHPAD; hire-deferred CRM outline only                                                                      |
| **Master Document**          | `/plans/00-master-document.md`       | This document — roadmap narrative (not the live board)                                                                 |

---

## Appendix: Quick Reference — Nothing.Digital URLs

| Environment   | URL                                            | Purpose                   |
| ------------- | ---------------------------------------------- | ------------------------- |
| Production    | `https://nothing.digital`                      | Live site                 |
| Staging       | `https://staging.nothing.digital`              | Pre-production validation |
| Preview       | `https://<branch>--nothing-digital.vercel.app` | Per-PR preview            |
| Local         | `http://localhost:3000`                        | Development               |
| Desktop App   | `nothing://`                                   | Tauri app (Phase 4)       |
| PWA Deep Link | `web+nothing://`                               | Mobile deep links         |

---

_Document maintained by the General Contractor. Updated after each phase completion._  
_Last Updated: 2026-08-07 — Docs consolidated; live board = `SCRATCHPAD.md`_
