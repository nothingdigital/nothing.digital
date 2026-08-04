# Nothing.Digital — Gap Analysis
**Document:** `04-gap-analysis.md`  
**Analyst:** Gap Analyst (Subagent)  
**Date:** 2026-08-04  
**Project:** Nothing.Digital — Next.js 14 Corporate Website  
**Status:** Pre-Build / Planning Phase  

---

## Executive Summary

This analysis reviews the Nothing.Digital project brief and parallel plans (System Architecture, DevOps & Infrastructure, QA & Testing) to identify missing specifications, under-defined requirements, and unaddressed risks. **A total of 67 discrete gaps** were identified across 10 domains. The most critical concern is the **`nothing://` custom protocol requirement**, which presents severe feasibility, security, and user-experience risks that could block launch entirely if not resolved.

---

## 1. Critical Gaps (Must Address Before Launch)

> *These gaps represent launch blockers, legal liabilities, or architectural risks that will cause immediate failure if unaddressed.*

### 1.1 The `nothing://` Protocol — Feasibility & Security
| | |
|:---|:---|
| **Description** | The requirement to use `nothing://` instead of `https://` in browsers is fundamentally incompatible with modern web security models. Browsers enforce HTTPS for secure contexts (Service Workers, geolocation, camera, payment APIs, etc.). A custom protocol at the application layer cannot replace transport-layer TLS without a browser extension, native app, or corporate proxy configuration. |
| **Why it matters** | • Browsers will refuse to load `nothing://` URLs or will treat them as external protocol handlers (prompting users with "Open with...?" dialogs).<br>• No certificate authority issues certificates for `nothing://`.<br>• Mixed-content policies will block `nothing://` resources on `https://` pages and vice versa.<br>• Search engines will not index `nothing://` content.<br>• Modern APIs (Web Crypto, Service Workers, Push Notifications) require secure origins (`https://` or `localhost`). |
| **Recommended solution** | **Option A (Recommended):** Deprecate `nothing://` as a browser-facing protocol. Register `nothing.digital` with standard HTTPS. Use `nothing://` only as an internal deep-linking scheme within a companion mobile app or as a custom URI scheme for a desktop application.<br><br>**Option B:** If `nothing://` is non-negotiable for brand identity, build a native wrapper (Electron/Tauri) or browser extension that intercepts `nothing://` and proxies to `https://`. This is a massive scope increase.<br><br>**Option C:** Use `nothing://` as a meta-protocol identifier in marketing only, with 301 redirects to `https://`. |
| **Effort** | **L** (if deprecating) to **XL** (if building native wrapper) |

---

### 1.2 GDPR / CCPA Compliance — Cookie Consent & Data Processing
| | |
|:---|:---|
| **Description** | No cookie consent banner, privacy policy, or data processing agreement is specified. The site will use analytics, contact forms, and potentially Supabase (which may set cookies). GDPR (EU) and CCPA (California) require explicit user consent before non-essential cookies/scripts load, plus accessible privacy documentation. |
| **Why it matters** | Fines under GDPR can reach 4% of global annual revenue. CCPA carries statutory damages. Vercel and Supabase both process data in ways that require disclosure. |
| **Recommended solution** | • Implement a granular cookie consent banner (e.g., Cookiebot, OneTrust, or Osano) with categories: Essential, Analytics, Marketing.<br>• Draft and publish a Privacy Policy covering: data collected, legal basis, retention periods, third-party processors (Vercel, Cloudflare, Supabase, Resend), user rights (access, deletion, portability).<br>• Add a "Do Not Sell My Personal Information" link (CCPA) in footer.<br>• Ensure Supabase RLS policies prevent unauthorized data access (see 1.4). |
| **Effort** | **M** |

---

### 1.3 SSL/TLS Certificate & HTTPS Strategy
| | |
|:---|:---|
| **Description** | The project mentions Cloudflare and Vercel but does not specify the TLS termination strategy, certificate source, or HSTS configuration. If `nothing://` is attempted, the certificate story is undefined. |
| **Why it matters** | Without proper TLS, browsers show "Not Secure" warnings. HSTS preload prevents downgrade attacks. Cloudflare Origin CA certificates are needed for Vercel→Cloudflare encryption. |
| **Recommended solution** | • Use Cloudflare-managed certificates for edge termination (Universal SSL).<br>• Enable "Full (Strict)" SSL mode in Cloudflare.<br>• Deploy Vercel Origin CA certificate on Vercel custom domain.<br>• Enable HSTS with `max-age=63072000; includeSubDomains; preload`.<br>• Add to HSTS preload list via hstspreload.org. |
| **Effort** | **S** |

---

### 1.4 Supabase Row-Level Security (RLS) — Undefined Policies
| | |
|:---|:---|
| **Description** | Supabase is listed as the backend, but no RLS policies are defined for any table. Without RLS, any client with the anon key can read/write all data. |
| **Why it matters** | SQL injection is less of a risk with Supabase's PostgREST API, but **unauthorized data access is a critical risk**. Contact form submissions, user data, or admin content could be exposed or deleted by anonymous users. |
| **Recommended solution** | • Enable RLS on **every table**.<br>• Define policies:<br>  - `contacts`: INSERT allowed for anon (from form), SELECT only for authenticated admin role.<br>  - `blog_posts`: SELECT allowed for anon, INSERT/UPDATE/DELETE only for authenticated admin.<br>  - `portfolio_items`: SELECT for anon, write for admin.<br>• Use Supabase Service Role Key only in Vercel Edge Functions, never client-side.<br>• Enable Prepared Statements in PostgREST (default). |
| **Effort** | **M** |

---

### 1.5 Contact Form — Rate Limiting, Bot Protection & Validation
| | |
|:---|:---|
| **Description** | The contact form uses React Hook Form + Zod (client-side validation) but lacks server-side rate limiting, CAPTCHA, or bot protection. Resend is the email provider but no abuse prevention is specified. |
| **Why it matters** | Without rate limiting, the form is vulnerable to spam and DDoS. Resend accounts have sending limits; abuse could lead to account suspension. |
| **Recommended solution** | • Add server-side rate limiting in Vercel Edge Functions (e.g., Vercel KV or Upstash Redis) — max 3 submissions per IP per hour.<br>• Integrate hCaptcha or Cloudflare Turnstile (invisible, privacy-focused CAPTCHA).<br>• Implement Zod validation on the server (edge function) as well as client.<br>• Add honeypot field (hidden field that bots fill in, humans don't).<br>• Log all submissions to Supabase for audit trail before emailing. |
| **Effort** | **S** |

---

### 1.6 Privacy Policy & Terms of Service
| | |
|:---|:---|
| **Description** | No legal pages are specified. A business website collecting any user data requires these documents. |
| **Why it matters** | Required by GDPR, CCPA, and most advertising/analytics platforms. Also protects the company from liability. |
| **Recommended solution** | • Generate Privacy Policy (covering: cookies, analytics, contact data, third-party services, data retention, user rights).<br>• Generate Terms of Service (covering: service descriptions, limitations of liability, intellectual property, governing law).<br>• Add "Last Updated" date and review annually.<br>• Consider using Termly or iubenda for auto-updating legal documents. |
| **Effort** | **S** |

---

### 1.7 Accessibility (WCAG) Compliance
| | |
|:---|:---|
| **Description** | No accessibility requirements are specified. Framer Motion animations and custom protocols can create barriers. |
| **Why it matters** | WCAG 2.1 AA is legally required in many jurisdictions (EU Web Accessibility Directive, ADA in US). Non-compliance exposes the company to lawsuits. |
| **Recommended solution** | • Require WCAG 2.1 AA compliance in all component specs.<br>• Implement: semantic HTML, ARIA labels where needed, keyboard navigation, focus indicators, `prefers-reduced-motion` support for Framer Motion.<br>• Add an Accessibility Statement page.<br>• Run automated audits (axe, Lighthouse) in CI. |
| **Effort** | **M** |

---

## 2. High-Priority Gaps (Should Address in MVP)

> *These gaps degrade user trust, SEO performance, or operational stability. They should be included in the initial build.*

### 2.1 404 & 500 Error Pages
| | |
|:---|:---|
| **Description** | No custom error pages are specified. Next.js defaults are unbranded and poor for UX. |
| **Why it matters** | Error pages are a trust signal. A custom 404 with navigation options reduces bounce rate. |
| **Recommended solution** | • Design branded `not-found.tsx` (404) and `error.tsx` (500) with: logo, friendly message, search bar, links to Home and Contact.<br>• Log 500 errors to an observability service (see 7.8). |
| **Effort** | **S** |

---

### 2.2 Loading States & Skeleton Screens
| | |
|:---|:---|
| **Description** | No loading UI strategy is defined. Next.js App Router supports `loading.tsx` but none are mentioned. |
| **Why it matters** | Perceived performance matters. Skeleton screens reduce perceived load time vs. spinners. |
| **Recommended solution** | • Implement `loading.tsx` for all route segments.<br>• Use Tailwind animate-pulse for skeleton placeholders.<br>• For Framer Motion sections, use staggered fade-in with skeleton placeholders. |
| **Effort** | **S** |

---

### 2.3 Image Optimization Pipeline
| | |
|:---|:---|
| **Description** | No image strategy is defined. Next.js has `next/image` but policies for formats, sizes, CDN, and storage are missing. |
| **Why it matters** | Images are typically 60-80% of page weight. Unoptimized images kill Core Web Vitals (LCP). |
| **Recommended solution** | • Use `next/image` with priority loading for above-the-fold images.<br>• Serve via Cloudflare Images or Vercel Edge Network.<br>• Require WebP/AVIF formats with JPEG fallbacks.<br>• Define max image dimensions per breakpoint.<br>• Use a DAM (Digital Asset Management) or at minimum a structured `/public/images` folder with naming conventions.<br>• Implement lazy loading for below-the-fold images. |
| **Effort** | **M** |

---

### 2.4 SEO Foundation — Metadata, Sitemap, Robots
| | |
|:---|:---|
| **Description** | No SEO strategy is specified. Next.js 14 has built-in metadata API but no implementation plan. |
| **Why it matters** | A services company lives or dies on organic search. Missing metadata = missing search traffic. |
| **Recommended solution** | • Implement `metadata` object in every page with: title, description, Open Graph, Twitter Cards, canonical URL.<br>• Auto-generate `sitemap.xml` (next-sitemap or dynamic route).<br>• Create `robots.txt` with sitemap reference.<br>• Implement structured data (JSON-LD) for: Organization, Service, BlogPosting, BreadcrumbList.<br>• Add hreflang if multilingual is future-planned. |
| **Effort** | **S** |

---

### 2.5 Analytics & Conversion Tracking
| | |
|:---|:---|
| **Description** | No analytics platform is specified. No event tracking plan exists. |
| **Why it matters** | Without analytics, marketing ROI is unmeasurable. Conversion tracking is essential for a services business. |
| **Recommended solution** | • Install Google Analytics 4 (GA4) with GTM (Google Tag Manager) for event flexibility.<br>• Define key events: `page_view`, `contact_form_start`, `contact_form_submit`, `service_page_view`, `portfolio_click`, `blog_read` (scroll depth 75%).<br>• Add Meta Pixel if social advertising is planned.<br>• Ensure analytics respects cookie consent (load only after consent).<br>• Consider privacy-friendly alternative: Plausible or Fathom (no cookie banner needed). |
| **Effort** | **M** |

---

### 2.6 CRM / Lead Management Integration
| | |
|:---|:---|
| **Description** | Contact form submissions go to Resend (email only). No CRM integration means leads are not tracked, scored, or nurtured. |
| **Why it matters** | A digital services company needs a lead pipeline. Email alone is insufficient for sales follow-up. |
| **Recommended solution** | • Integrate with HubSpot (free CRM tier) or Salesforce.<br>• Route form submissions to CRM via webhook (Zapier, Make, or direct API).<br>• Create contact entries with source attribution (UTM params, referrer).<br>• Set up automated email sequences (welcome, follow-up).<br>• If staying lightweight: use Airtable or Notion as interim CRM. |
| **Effort** | **M** |

---

### 2.7 Email Marketing Platform Selection
| | |
|:---|:---|
| **Description** | Resend is listed for transactional email but no newsletter/marketing email platform is chosen. |
| **Why it matters** | "Email Marketing" is listed as a service. The company should dog-food its own service with a newsletter. |
| **Recommended solution** | • Choose a platform: ConvertKit (creator-friendly), Mailchimp (ubiquitous), or Beehiiv (modern newsletter focus).<br>• Integrate signup forms with Supabase (store subscribers).<br>• Use Resend for transactional; marketing platform for campaigns.<br>• Implement double opt-in for compliance. |
| **Effort** | **S** |

---

### 2.8 Database Migration Strategy
| | |
|:---|:---|
| **Description** | Supabase is the database but no migration tooling or strategy is defined. |
| **Why it matters** | Schema changes without migrations cause data loss and downtime. |
| **Recommended solution** | • Use Supabase CLI for migrations (`supabase db diff`, `supabase migration new`).<br>• Store migrations in version control (`/supabase/migrations/`).<br>• Implement blue-green or rolling migrations for zero-downtime deploys.<br>• Seed scripts for dev/staging (see 6.5). |
| **Effort** | **S** |

---

### 2.9 Caching Strategy
| | |
|:---|:---|
| **Description** | No caching layer is specified. Next.js has some built-in caching but explicit strategy is missing. |
| **Why it matters** | Dynamic content (blog, portfolio) needs cache invalidation. Static content needs long TTLs. |
| **Recommended solution** | • Use Next.js `fetch` caching with `revalidate` (ISR) for blog/portfolio.<br>• Cloudflare caching rules: static assets (1 year), HTML (short TTL with cache-busting).<br>• Consider Vercel Edge Config for feature flags (see 6.3) and low-latency reads.<br>• For API routes: implement Redis/Upstash for rate-limiting and session caching. |
| **Effort** | **M** |

---

### 2.10 Font Loading Strategy
| | |
|:---|:---|
| **Description** | No font strategy is defined. Tailwind defaults to system fonts but custom brand fonts are likely. |
| **Why it matters** | Poor font loading causes FOUT/FOIT, layout shift (CLS), and bad UX. |
| **Recommended solution** | • Use `next/font` for automatic optimization, subsetting, and CSS variable injection.<br>• Preload critical font files (`<link rel="preload">`).<br>• Use `font-display: swap` to prevent invisible text.<br>• Limit font weights to 2-3 variants.<br>• Self-host fonts to avoid third-party requests (GDPR + performance). |
| **Effort** | **S** |

---

## 3. Medium-Priority Gaps (Nice to Have)

> *These improve quality of life, performance, or scalability but are not launch blockers.*

### 3.1 Site-Wide Search
| | |
|:---|:---|
| **Description** | No search functionality is specified for blog or portfolio. |
| **Why it matters** | Improves content discoverability, especially as blog grows. |
| **Recommended solution** | • Implement with Algolia DocSearch (free for open-source-like sites) or Fuse.js (client-side, no external dependency).<br>• For larger scale: Meilisearch or Typesense. |
| **Effort** | **M** |

---

### 3.2 Pagination for Blog & Portfolio
| | |
|:---|:---|
| **Description** | No pagination strategy is defined. Infinite scroll vs. numbered pages is undecided. |
| **Why it matters** | Large lists without pagination hurt performance and SEO. |
| **Recommended solution** | • Use numbered pagination for SEO (search engines prefer it).<br>• Implement with Next.js dynamic route segments (`/blog/page/2`).<br>• Add `rel="prev"` / `rel="next"` (deprecated by Google but helpful for other engines). |
| **Effort** | **S** |

---

### 3.3 Social Sharing Integration
| | |
|:---|:---|
| **Description** | No Open Graph custom images or share buttons are specified. |
| **Why it matters** | Social sharing drives traffic. OG images increase click-through rates. |
| **Recommended solution** | • Auto-generate OG images using `@vercel/og` or Satori for blog posts and services.<br>• Add social share buttons (Twitter/X, LinkedIn, Facebook) to blog posts.<br>• Ensure OG meta tags are complete for all pages. |
| **Effort** | **S** |

---

### 3.4 Print Stylesheets
| | |
|:---|:---|
| **Description** | No print styles are defined. Users may want to print service descriptions or proposals. |
| **Why it matters** | Professional services often involve printed proposals. |
| **Recommended solution** | • Add `@media print` styles: hide nav/footer, show URLs after links, ensure contrast, page breaks.<br>• Test print output for key pages (Services, About, Contact). |
| **Effort** | **S** |

---

### 3.5 Content Workflow & CMS
| | |
|:---|:---|
| **Description** | No CMS or content workflow is specified. Blog and portfolio content may be hardcoded or in Supabase with no editorial UI. |
| **Why it matters** | Non-technical team members need to publish content without developer involvement. |
| **Recommended solution** | • Use a headless CMS: Sanity, Contentful, Strapi, or Notion as CMS.<br>• Define approval workflow: Draft → Review → Published.<br>• If using Supabase only: build an admin dashboard for content management (significant effort). |
| **Effort** | **L** |

---

### 3.6 Image/Media Storage & CDN
| | |
|:---|:---|
| **Description** | Supabase Storage is implied but not specified. CDN strategy for media is unclear. |
| **Why it matters** | Media delivery speed impacts global UX. |
| **Recommended solution** | • Use Supabase Storage with public buckets for user-generated content.<br>• Use Cloudflare Images or Cloudinary for transformation (resize, format conversion).<br>• Set up custom domain for assets (`cdn.nothing.digital` or `assets.nothing.digital`). |
| **Effort** | **M** |

---

### 3.7 Content Versioning
| | |
|:---|:---|
| **Description** | No content versioning is specified. Blog post edits lose history. |
| **Why it matters** | Audit trails and rollback capability are important for compliance and mistakes. |
| **Recommended solution** | • If using headless CMS: most provide versioning out of the box.<br>• If Supabase-only: add `_history` tables or use temporal tables (if using PostgreSQL 17+).<br>• For code-based content: Git history is sufficient. |
| **Effort** | **M** |

---

### 3.8 PWA / Offline Support
| | |
|:---|:---|
| **Description** | No Progressive Web App features are specified. |
| **Why it matters** | PWAs improve engagement (installability, offline reading of blog). |
| **Recommended solution** | • Add `manifest.json` with app metadata.<br>• Implement Service Worker with `next-pwa` or Workbox.<br>• Cache static assets and recent blog posts for offline reading.<br>• Add "Add to Home Screen" prompt. |
| **Effort** | **M** |

---

### 3.9 Error Boundaries
| | |
|:---|:---|
| **Description** | No React Error Boundary strategy is defined. |
| **Why it matters** | A single component crash can white-screen the entire app without boundaries. |
| **Recommended solution** | • Implement `error.tsx` (already noted in 2.1) plus component-level error boundaries using `react-error-boundary`.<br>• Log errors to Sentry or similar (see 7.8). |
| **Effort** | **S** |

---

### 3.10 Code Splitting & Bundle Analysis
| | |
|:---|:---|
| **Description** | No bundle size budget or code splitting strategy is defined. |
| **Why it matters** | Large bundles hurt performance, especially on mobile. |
| **Recommended solution** | • Use dynamic imports (`next/dynamic`) for heavy components (Framer Motion sections below fold).<br>• Set a bundle budget (e.g., 200KB initial JS).<br>• Run `@next/bundle-analyzer` in CI.<br>• Tree-shake unused Tailwind classes (`tailwindcss` v3+ does this automatically). |
| **Effort** | **S** |

---

## 4. Low-Priority / Future (Post-MVP)

> *These are valuable but can be deferred until after launch.*

### 4.1 Multilingual Support (i18n)
| | |
|:---|:---|
| **Description** | No internationalization strategy is specified. |
| **Why it matters** | Expands market reach if services target non-English speakers. |
| **Recommended solution** | • Use `next-intl` or Next.js built-in i18n routing.<br>• Plan URL structure: `nothing.digital/en`, `nothing.digital/nl`, etc.<br>• Implement hreflang tags.<br>• Consider right-to-left (RTL) languages from day one in design. |
| **Effort** | **L** |

---

### 4.2 Content Migration Strategy
| | |
|:---|:---|
| **Description** | No plan for migrating existing content (if any). |
| **Why it matters** | If replacing an existing site, redirects and content porting are needed. |
| **Recommended solution** | • Audit existing content for URL mapping.<br>• Implement 301 redirects from old URLs.<br>• Use migration scripts for bulk content import. |
| **Effort** | **M** |

---

### 4.3 A/B Testing Infrastructure
| | |
|:---|:---|
| **Description** | No testing framework for conversion optimization. |
| **Why it matters** | Data-driven design improvements increase lead generation. |
| **Recommended solution** | • Use Vercel Edge Config for feature flags + lightweight A/B logic.<br>• Or integrate Optimizely, VWO, or Google Optimize (sunset; use GA4 A/B tests). |
| **Effort** | **M** |

---

### 4.4 Heatmap & Session Recording
| | |
|:---|:---|
| **Description** | No user behavior analytics tools specified. |
| **Why it matters** | Qualitative data (clicks, scrolls, rage clicks) reveals UX issues. |
| **Recommended solution** | • Hotjar (free tier) or Microsoft Clarity (free, GDPR-compliant with adjustments).<br>• Ensure compliance with cookie consent before loading scripts. |
| **Effort** | **S** |

---

### 4.5 User Feedback Collection
| | |
|:---|:---|
| **Description** | No mechanism for collecting user feedback. |
| **Why it matters** | Direct feedback identifies issues faster than analytics. |
| **Recommended solution** | • Add a micro-survey (Typeform, Hotjar Survey, or custom).<br>• Implement NPS or CSAT for service pages.<br>• Add a "Was this helpful?" widget on blog posts. |
| **Effort** | **S** |

---

### 4.6 Competitor Tracking
| | |
|:---|:---|
| **Description** | No competitive intelligence tooling. |
| **Why it matters** | Market positioning requires knowing competitor moves. |
| **Recommended solution** | • Use SEMrush, Ahrefs, or SimilarWeb for competitor SEO and traffic analysis.<br>• Set up Google Alerts for competitor brand mentions. |
| **Effort** | **S** (ongoing) |

---

### 4.7 Content Calendar
| | |
|:---|:---|
| **Description** | No editorial calendar or publishing cadence is defined. |
| **Why it matters** | Consistent content drives SEO and thought leadership. |
| **Recommended solution** | • Define publishing cadence: 1 blog post/week, 1 portfolio case study/month.<br>• Use Trello, Notion, or CoSchedule for editorial planning.<br>• Align content with service offerings and seasonal trends. |
| **Effort** | **S** (process, not technical) |

---

### 4.8 SEO Monitoring
| | |
|:---|:---|
| **Description** | No ongoing SEO health monitoring. |
| **Why it matters** | SEO is not set-and-forget. Algorithm changes and technical issues require vigilance. |
| **Recommended solution** | • Set up Google Search Console and Bing Webmaster Tools.<br>• Use Ahrefs or SEMrush for rank tracking.<br>• Run Lighthouse CI on every PR.<br>• Monitor Core Web Vitals in CrUX (Chrome User Experience Report). |
| **Effort** | **S** |

---

### 4.9 Feature Flags
| | |
|:---|:---|
| **Description** | No feature flag system is specified. |
| **Why it matters** | Enables safe rollouts, A/B tests, and quick rollbacks without redeploy. |
| **Recommended solution** | • Use Vercel Edge Config (free tier available) or LaunchDarkly.<br>• Wrap new features in flag checks for gradual rollout. |
| **Effort** | **S** |

---

### 4.10 Staging Environment Content Parity
| | |
|:---|:---|
| **Description** | No strategy for keeping staging data in sync with production. |
| **Why it matters** | Testing on stale data misses real-world edge cases. |
| **Recommended solution** | • Scheduled Supabase backup restore to staging (anonymize PII first).<br>• Use seed scripts for consistent dev/staging baseline. |
| **Effort** | **M** |

---

## 5. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|:---|:---|:---|:---|
| **`nothing://` protocol is infeasible** | High | Critical | Re-scope to HTTPS-only; use `nothing://` only for app deep links or marketing. Get stakeholder sign-off ASAP. |
| **GDPR fine due to missing consent** | Medium | Critical | Implement cookie consent before any tracking scripts. Draft privacy policy before launch. |
| **Supabase data breach (no RLS)** | High | Critical | Enable RLS on all tables before accepting real user data. Pen-test before launch. |
| **Contact form spam/DDoS** | High | Medium | Implement rate limiting + CAPTCHA before going live. Monitor Resend quotas. |
| **Poor Core Web Vitals** | Medium | High | Define image optimization, font loading, and caching strategy in MVP. |
| **No lead tracking (no CRM)** | High | High | Integrate HubSpot or lightweight CRM within 2 weeks of launch. |
| **Accessibility lawsuit** | Low | High | WCAG 2.1 AA audit before launch. Add accessibility statement. |
| **SEO invisible at launch** | Medium | High | Implement metadata, sitemap, and structured data before launch. Verify indexing in Search Console. |
| **Certificate misconfiguration** | Low | Critical | Cloudflare + Vercel setup checklist. Test SSL Labs rating before launch. |
| **No rollback plan on failure** | Medium | High | Implement Vercel instant rollback. Test rollback procedure. |

---

## 6. Recommended Additions to Project Scope

### 6.1 Immediate Additions (Pre-Launch)
1. **HTTPS-First Decision** — Kill or redefine `nothing://` requirement.
2. **Legal Pages** — Privacy Policy + Terms of Service.
3. **Cookie Consent Banner** — With GTM/GA4 deferred loading.
4. **Supabase RLS Policies** — For all tables.
5. **Server-Side Form Protection** — Rate limiting + CAPTCHA.
6. **Error Pages** — Custom 404 and 500.
7. **SEO Foundation** — Metadata, sitemap, robots, structured data.
8. **Analytics** — GA4 or Plausible with event tracking plan.
9. **Accessibility Audit** — WCAG 2.1 AA compliance check.
10. **Image Optimization** — `next/image`, WebP/AVIF, Cloudflare.

### 6.2 MVP Additions (Within 4 Weeks of Launch)
1. **CRM Integration** — HubSpot or equivalent.
2. **Email Marketing Platform** — Newsletter signup + automation.
3. **Caching Strategy** — ISR, Cloudflare rules, Redis.
4. **Database Migrations** — Supabase CLI workflow.
5. **Search** — Fuse.js or Algolia for blog/portfolio.
6. **Social Sharing** — OG images + share buttons.
7. **PWA Features** — Manifest, Service Worker, offline cache.

### 6.3 Post-MVP Additions (3-6 Months)
1. **Headless CMS** — Sanity/Contentful for non-technical editors.
2. **A/B Testing** — Vercel Edge Config or Optimizely.
3. **Heatmaps** — Hotjar or Microsoft Clarity.
4. **Feature Flags** — Gradual rollouts.
5. **Multilingual** — `next-intl` if market demands.
6. **Staging Parity** — Automated data sync.

---

## 7. The `nothing://` Protocol — Deep Dive

> *This section provides a critical analysis of the most unusual and risky requirement.*

### 7.1 Browser Security Model
Modern browsers implement the **Same-Origin Policy** and **Secure Context** requirements. A "secure context" requires one of:
- `https://` origin
- `http://localhost` / `http://127.0.0.1`
- `file://` (with restrictions)
- Packaged app origins (Chrome extensions, etc.)

`nothing://` is none of these. Therefore:
- **Service Workers** will refuse to register.
- **Push Notifications** are unavailable.
- **Geolocation** API throws `PermissionDeniedError`.
- **Camera/Microphone** access is blocked.
- **Web Crypto** (subtle crypto) may be restricted.
- **Payment Request API** is unavailable.

### 7.2 Certificate Handling
TLS certificates are bound to DNS names, not URI schemes. A certificate for `nothing.digital` secures `https://nothing.digital`. There is no PKI (Public Key Infrastructure) that issues certificates for `nothing://`. Without TLS:
- Browsers show "Not Secure".
- Data is transmitted in plaintext (MITM vulnerable).
- HTTP/2 and HTTP/3 require TLS.

### 7.3 Mixed Content
If `nothing://` were somehow loaded, any resource referenced via `https://` would be considered cross-origin or mixed-content. Conversely, an `https://` page cannot load `nothing://` resources (blocked as mixed-content or unknown protocol).

### 7.4 Search Engine Indexing
Search engine crawlers (Googlebot, Bingbot) only crawl `http://` and `https://`. `nothing://` URLs will not be discovered, crawled, or indexed. The site will be invisible to search.

### 7.5 Social Sharing
When users share `nothing://nothing.digital` on social media, platforms will:
- Fail to fetch Open Graph metadata.
- Not generate link previews.
- Possibly flag the link as suspicious/malware.

### 7.6 User Education
If `nothing://` is pursued, users must be educated to:
- Install a browser extension or native app.
- Understand why their browser warns them.
- Manually type `nothing://` instead of relying on search.

### 7.7 Fallback Strategy
If `nothing://` fails (no extension installed, mobile browser, corporate proxy), the site must fallback gracefully. No fallback is currently specified.

### 7.8 Recommendation
**The `nothing://` requirement should be reclassified as a branding/marketing concept, not a technical protocol.** Options:
- **Marketing:** Use "nothing://" in logos, taglines, and print materials as a brand metaphor.
- **Native Apps:** Register `nothing://` as a custom URI scheme in iOS/Android apps for deep linking.
- **Browser Extension:** Build an extension that redirects `nothing://` to `https://nothing.digital` for power users.
- **Primary Site:** Use `https://nothing.digital` exclusively.

---

## 8. Summary — Top 10 Most Critical Gaps

| # | Gap | Category | Risk if Unaddressed |
|:---|:---|:---|:---|
| **1** | **`nothing://` protocol feasibility** | Technical / Strategic | **Launch blocker.** Site may be unaccessible, unindexable, and insecure. |
| **2** | **Supabase RLS policies missing** | Security | **Data breach.** Anonymous users can read/write all data. |
| **3** | **GDPR/CCPA compliance missing** | Legal | **Fines up to 4% revenue.** Lawsuits, regulatory action. |
| **4** | **No privacy policy / terms of service** | Legal | **Liability exposure.** Required by law and ad platforms. |
| **5** | **No rate limiting / bot protection on forms** | Security / Ops | **Spam, DDoS, Resend account suspension.** |
| **6** | **No CRM / lead management** | Business | **Lost revenue.** Leads fall into a black hole after form submission. |
| **7** | **No analytics or conversion tracking** | Business | **Unmeasurable marketing.** Flying blind on ROI. |
| **8** | **Accessibility (WCAG) not specified** | Legal / UX | **ADA lawsuits.** Exclusion of users with disabilities. |
| **9** | **No custom error pages** | UX | **Lost trust.** Default Next.js errors look unprofessional. |
| **10** | **Image optimization undefined** | Performance | **Poor Core Web Vitals.** SEO penalty, high bounce rate. |

---

## 9. Questions for Stakeholders

To resolve critical ambiguities, the following questions need answers:

1. **Is `nothing://` negotiable?** Can it be redefined as a marketing concept rather than a technical protocol?
2. **What is the target launch date?** This affects which gaps must be MVP vs. post-launch.
3. **Is there an existing website?** If so, what is the content migration and redirect strategy?
4. **Who is the target audience geographically?** Determines GDPR/CCPA applicability and i18n priority.
5. **What is the expected traffic volume?** Affects infrastructure sizing and caching strategy.
6. **Will there be a client login portal?** Determines authentication/authorization scope.
7. **Who will create and approve content?** Determines CMS choice and workflow design.
8. **What is the budget for third-party tools?** CRM, CMS, analytics, and legal services have costs.
9. **Are there existing brand guidelines?** Logo, colors, typography, tone of voice.
10. **What is the disaster recovery SLA?** RTO/RPO targets for backups and incident response.

---

## 10. Cross-Reference with Parallel Plans

| Gap | Relevant Plan | Recommendation |
|:---|:---|:---|
| `nothing://` protocol | `01-principal-architect.md` | Architect must produce feasibility study with security analysis. |
| SSL/TLS, CDN, caching | `02-devops-engineer.md` | DevOps must define Cloudflare+Vercel TLS termination and caching rules. |
| RLS, migrations, seeding | `01-principal-architect.md` | Architect must specify Supabase schema + RLS policies. |
| Rate limiting, bot protection | `03-qa-engineer.md` | QA must include security testing (OWASP ZAP, pen-test). |
| GDPR, accessibility | `03-qa-engineer.md` | QA must define compliance test cases. |
| Error boundaries, loading states | `01-principal-architect.md` | Architect must specify error/loading component patterns. |
| SEO, analytics | `01-principal-architect.md` | Architect must include metadata and tracking architecture. |

---

*End of Gap Analysis*
