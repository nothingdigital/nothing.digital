# Phase 2 Checklist — Core Development

> **Status:** In Progress  
> **Goal:** All core pages built, forms functional, content populated.  
> **Gate:** All pages render correctly, forms submit to Supabase + Resend, Lighthouse scores ≥ 90.

## Coding Standards (apply to all Phase 2 work)

- [x] **Never-nesting:** early returns, guard clauses, flat control flow.
- [x] **SOLID:** single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- [x] Deliberate simplifications marked with `// ponytail:` comments.

## 6.2 Global Components

| #    | Task                                                | Owner    | Status       |
| ---- | --------------------------------------------------- | -------- | ------------ |
| 2.10 | Build Navigation (desktop + mobile hamburger)       | Frontend | ✅ (Phase 1) |
| 2.11 | Build Footer (links, social, newsletter signup)     | Frontend | ✅           |
| 2.12 | Build Cookie Consent Banner (GDPR/CCPA compliant)   | Frontend | ✅           |
| 2.13 | Build Scroll-to-top button                          | Frontend | ✅           |
| 2.14 | Build loading.tsx skeletons for all routes          | Frontend | ✅           |
| 2.15 | Build error.tsx (500) and not-found.tsx (404) pages | Frontend | ✅           |

## 6.3 Homepage

| #    | Task                                                  | Owner    | Status                                                    |
| ---- | ----------------------------------------------------- | -------- | --------------------------------------------------------- |
| 2.16 | Hero Section (headline, subheadline, CTA, background) | Frontend | ✅                                                        |
| 2.17 | Services Overview (4-card grid with icons)            | Frontend | ✅                                                        |
| 2.18 | Featured Case Studies (2 highlighted with metrics)    | Frontend | ✅ (anonymized MDX + home)                                |
| 2.19 | Trust Indicators (client logos, stats, testimonials)  | Frontend | ✅ anonymous client-logo strip on home; named logos LATER |
| 2.20 | Newsletter Signup section                             | Frontend | ✅                                                        |

## 6.4 Service Pages

| #    | Task                                  | Owner    | Status |
| ---- | ------------------------------------- | -------- | ------ |
| 2.21 | Create reusable Service Page template | Frontend | ✅     |
| 2.22 | Website Development page              | Frontend | ✅     |
| 2.23 | Software Solutions page               | Frontend | ✅     |
| 2.24 | Applications page                     | Frontend | ✅     |
| 2.25 | Email Marketing page                  | Frontend | ✅     |

## 6.5 Portfolio Page

| #    | Task                                                | Owner    | Status                      |
| ---- | --------------------------------------------------- | -------- | --------------------------- |
| 2.26 | Create case study MDX files with frontmatter schema | Content  | ✅ (3 anonymized)           |
| 2.27 | Build filterable grid with client-side filtering    | Frontend | ✅                          |
| 2.28 | Build portfolio detail page (`/portfolio/[slug]`)   | Frontend | ✅                          |
| 2.29 | Add client testimonials section                     | Frontend | ✅ (per study; named LATER) |

## 6.6 About Page

| #    | Task                                | Owner    | Status |
| ---- | ----------------------------------- | -------- | ------ |
| 2.30 | Our Story section                   | Content  | ✅     |
| 2.31 | Team section (photos, names, roles) | Frontend | ✅     |
| 2.32 | Values section                      | Content  | ✅     |
| 2.33 | Why Choose Us / differentiators     | Content  | ✅     |

## 6.7 Blog

| #    | Task                                             | Owner     | Status |
| ---- | ------------------------------------------------ | --------- | ------ |
| 2.34 | Set up MDX processing pipeline (next-mdx-remote) | Architect | ✅     |
| 2.35 | Create blog list page with categories            | Frontend  | ✅     |
| 2.36 | Create blog post page (`/blog/[slug]`)           | Frontend  | ✅     |
| 2.37 | Write 3 seed blog posts                          | Content   | ✅     |
| 2.38 | Add pagination for blog list                     | Frontend  | ✅     |

## 6.8 Contact Page

| #    | Task                                                         | Owner    | Status                                                             |
| ---- | ------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| 2.39 | Contact form (name, email, phone, service dropdown, message) | Frontend | ✅                                                                 |
| 2.40 | Embed Calendly booking widget                                | Frontend | ✅ CTA link + lazy-loaded iframe embed env-gated by `CALENDLY_URL` |
| 2.41 | FAQ accordion section                                        | Frontend | ✅                                                                 |
| 2.42 | Contact info + social links                                  | Frontend | ✅                                                                 |

## 6.9 Legal Pages

| #    | Task                         | Owner   | Status |
| ---- | ---------------------------- | ------- | ------ |
| 2.43 | Privacy Policy page          | Content | ✅     |
| 2.44 | Terms of Service page        | Content | ✅     |
| 2.45 | Accessibility Statement page | Content | ✅     |

## 6.10 SEO Foundation

| #    | Task                                                              | Owner    | Status                               |
| ---- | ----------------------------------------------------------------- | -------- | ------------------------------------ |
| 2.46 | Implement metadata on all pages (title, description, OG, Twitter) | Frontend | ✅                                   |
| 2.47 | Create `sitemap.xml` (dynamic route or next-sitemap)              | Frontend | ✅                                   |
| 2.48 | Create `robots.txt`                                               | Frontend | ✅                                   |
| 2.49 | Add JSON-LD structured data (Organization, Service, BlogPosting)  | Frontend | ✅                                   |
| 2.50 | Auto-generate OG images with `@vercel/og`                         | Frontend | ✅ (`/api/og` SVG route, no new dep) |

## QA / Validation

- [x] Unit tests for new utilities/components
- [x] E2E tests for critical journeys (chromium-desktop; full matrix requires `pnpm exec playwright install`)
- [x] `pnpm type-check` passes
- [x] `pnpm lint` passes
- [x] `pnpm test` passes
- [x] `pnpm build` passes (First Load JS / 186 kB home, 156 kB contact, SSG)
- [ ] Lighthouse scores ≥ 90 — blocked locally by x64 Node on arm64 Mac (Lighthouse refuses Rosetta); CI runner with matching arch required.

## Deliverables

- [ ] All 10+ pages built and styled
- [ ] Contact and newsletter forms fully functional
- [ ] Case studies and blog posts populated
- [ ] SEO metadata complete across all pages
- [ ] Cookie consent banner active
- [ ] Legal pages published
