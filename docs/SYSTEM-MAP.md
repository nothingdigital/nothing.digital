# Nothing.Digital — System Map

> **Audience:** Owner + agents  
> **Updated:** 2026-08-07  
> **Role:** How the product works end-to-end — purpose, client, admin, integrations, workflows.  
> **Not a todo board.** Live remaining work lives only in [`../SCRATCHPAD.md`](../SCRATCHPAD.md).

Deep how-tos stay in runbooks. This map answers _what / why / where / when_.

---

## Table of contents

1. [Spin up an agent](#1-spin-up-an-agent)
2. [Purpose](#2-purpose)
3. [Big picture](#3-big-picture)
4. [Client side](#4-client-side)
5. [Admin capabilities](#5-admin-capabilities)
6. [Integrations catalog](#6-integrations-catalog)
7. [Core workflows](#7-core-workflows)
8. [Data, auth, migrations](#8-data-auth-migrations)
9. [Historical / archived](#9-historical--archived)
10. [Doc index](#10-doc-index)

---

## 1. Spin up an agent

**Canonical short entry:** [`/AGENTS.md`](../AGENTS.md) (read order, rules, brand pointer).  
Longer paste prompt: [`superpowers/HANDOFF-post-launch-ops.md`](./superpowers/HANDOFF-post-launch-ops.md).

**Shipped:** site + `/admin` CRM, Pack F/H, client kit (`src/brand/` + module gates), Umami, Calendly, Listmonk env, Resend transactional (incl. score-gated day-0 nurture), Instantly CSV hybrid outbound, rule-based inbox lead scoring, AI code (flags may be off).  
**Owner-only:** Instantly account/DNS/warmup, Listmonk drip UI (day 3/7), Bing sitemap, AI Gateway keys, Places/Hunter keys, some migration confirmations — see SCRATCHPAD.  
**Live focus:** lead-gen activation (hybrid Instantly + Listmonk + inbound) — design/spec on SCRATCHPAD, not duplicated here.

---

## 2. Purpose

**Nothing.Digital** is a digital services agency (The Business of Nothing LLC): senior web, software, and AI work sold via portfolio + contact/Calendly — not a SaaS product.

The Next.js app does two jobs:

| Surface              | Job                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Public site**      | Trust + leads → scoping call                                                           |
| **`/admin` cockpit** | Solo founder ops until Approves/judgment regularly exceed ~30–60 min/day (hire signal) |

**Design rule:** Admin **approves, syncs, surfaces debt**. Specialist tools send mail, run analytics, and host drips. Cold ≠ warm ≠ transactional — never mix those lists or senders.

Conversion spine (from [`growth-tactics.md`](./growth-tactics.md)):

```text
Content → Trust → CTA → Contact / Calendly
Newsletter → Listmonk drips → Soft CTA → Contact / Calendly
Cold leads → Admin review → Instantly sequences (not Listmonk)
```

---

## 3. Big picture

```text
┌─────────────────────────────┐
│  nothing.digital (Vercel)   │
│  Public site · /portal ·    │
│  /admin · /api/*            │
└──────┬──────────┬───────────┘
       │          │
       │     ┌────▼────┐
       │     │ Supabase│  Auth, CRM DB, Storage (PDFs)
       │     └─────────┘
       │
  ┌────▼──────────────────────────────────────────┐
  │ Sidecars / SaaS                               │
  │ Umami · Listmonk (PikaPods)                   │
  │ Resend · Instantly · Calendly · Sentry ·      │
  │ UptimeRobot · (optional AI Gateway)           │
  └───────────────────────────────────────────────┘
```

| Layer         | Hosts                                   | Role                                                   |
| ------------- | --------------------------------------- | ------------------------------------------------------ |
| App           | Vercel                                  | Site, admin, APIs, PDFs, HITL AI drafts                |
| Data          | Supabase                                | Auth, clients/invoices/leads, Storage                  |
| Warm email    | Listmonk @ `newsletter.nothing.digital` | Opt-in newsletter + drips                              |
| Cold email    | Instantly (`app.instantly.ai`)          | Sequences after human CSV review                       |
| Transactional | Resend                                  | Contact confirm, admin notify, day-0 nurture, invoices |
| Analytics     | Umami @ `analytics.nothing.digital`     | Owned traffic (cookie-gated)                           |
| Booking       | Calendly                                | Scoping calls (SoT; no in-app bookings table)          |

Health chips: `https://nothing.digital/api/health` (env presence, not live uptime).

### Brand & modules (client kit Phase 0)

Redeploy this frame for other clients later without a rewrite. **Approach 1:** separate Vercel + Supabase per client; brand/modules in-repo. Guide: [`client-kit.md`](./client-kit.md) · checklist: [`runbooks/create-client-checklist.md`](./runbooks/create-client-checklist.md).

|          |                                                                                    |
| -------- | ---------------------------------------------------------------------------------- |
| Contract | `src/brand/` — `config.ts` (identity/assets/`fromEmail`), `modules.ts`, `email.ts` |
| Wiring   | `src/lib/site.ts` re-exports brand; admin nav + `ModuleGate` in admin layout       |
| Model    | Per-client deploy; **not** multi-tenant yet                                        |

| Module ID    | Covers                                      | ND default |
| ------------ | ------------------------------------------- | ---------- |
| `core`       | Public site, contact, auth shell            | always on  |
| `inbox`      | `/admin/inbox`                              | on         |
| `clients`    | `/admin/clients`                            | on         |
| `billing`    | `/admin/billing`                            | on         |
| `work`       | `/admin/work`                               | on         |
| `newsletter` | `/admin/newsletter` + Listmonk APIs         | on         |
| `outbound`   | `/admin/outbound`                           | on         |
| `health`     | `/admin/health`                             | on         |
| `docs`       | `/admin/docs`                               | on         |
| `ai`         | AI master switch (env flags still required) | on         |

Home, settings, system-map, login stay available whenever admin is reachable. Disabled modules drop from nav and soft-block their pages. **APIs/actions are not fully gated yet** — flags = deploy-time product shape.

**Not shipped yet:** template pack, `pnpm create-client` scaffolder, admin brand UI, onboarding wizard, `@nd/brand-kit` package, multi-tenant-by-domain.

---

## 4. Client side

### Public marketing site

| Route                                  | Purpose                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `/`                                    | Home + newsletter block                                                          |
| `/services`, `/services/[slug]`        | Offerings                                                                        |
| `/portfolio`, `/portfolio/[slug]`      | Case studies                                                                     |
| `/pricing`                             | Packages / ballparks                                                             |
| `/blog`, `/blog/[slug]`                | Content                                                                          |
| `/about`                               | Studio story                                                                     |
| `/contact`                             | Lead form → `/api/contact` → Supabase inbox + Resend; score > 60 → day-0 nurture |
| `/privacy`, `/terms`, `/accessibility` | Legal / a11y                                                                     |

**CTAs:** Contact form and Calendly (`CALENDLY_URL`) — not a self-serve checkout.

**Newsletter:** Site form → `/api/newsletter` → Listmonk (double opt-in). Never cold lists.

**AI (optional):** Admin-only HITL drafts (inbox, ops brief, invoice cover). Needs `AI_GATEWAY_API_KEY` + `AI_ENABLED=true`. No public site AI. Outbound Instantly lines from lead-finder `--ai-rank` or manual edit.

### Client portal & public views

| Route                      | Who                      | Purpose                                  |
| -------------------------- | ------------------------ | ---------------------------------------- |
| `/portal`, `/portal/login` | Client (`primary_email`) | View-only invoices + documents           |
| `/v/{token}`               | Anyone with link         | Public invoice/document view (tokenized) |

No Stripe Checkout in v1 — payment links/PDFs via invoice `external_url` or emailed PDF.

---

## 5. Admin capabilities

**Auth:** Supabase (password / Google / magic link) + `ADMIN_EMAILS` allowlist.  
**Entry:** `https://nothing.digital/admin` · How-to: [`runbooks/client-ops.md`](./runbooks/client-ops.md)

| Route                 | Capability                                            | Used for                                                                                                                         |
| --------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `/admin`              | Today loops + glance counts (+ optional AI ops brief) | Daily triage: inbox, overdue invoices, blocked/due work, weekly outbound, Listmonk setup                                         |
| `/admin/inbox`        | Contact submissions                                   | Rule-based `scoreLead` (0–100) for sort/badge; status new → read → replied → archived; optional AI reply draft (HITL — you send) |
| `/admin/outbound`     | Lead review queue                                     | Import lead-finder CSV **or** map pins → approve/reject/suppress → Instantly CSV export; optional AI personalization line        |
| `/admin/outbound/map` | Local business map                                    | MapLibre + Places search/drop pin → Add to `lead_candidates` (lat/lng); center Berry AL                                          |
| `/admin/clients`      | CRM accounts                                          | Clients, assets (sites/domains + optional monitor URL), work, files, invoices                                                    |
| `/admin/billing`      | All invoices                                          | Create/edit; mark draft/sent/paid/void; overdue computed on read                                                                 |
| `/admin/work`         | Cross-client work queue                               | Status + sort (due/priority/created); no kanban/assignees in v1                                                                  |
| `/admin/newsletter`   | Local subscriber mirror                               | Export/manage mirror; **Listmonk is SoT** for campaigns                                                                          |
| `/admin/health`       | Integration chips + Open links                        | Env presence + launchers to Umami/Listmonk/Instantly/etc.; Listmonk drip checklist                                               |
| `/admin/docs`         | Internal knowledge base (handbook / policies)         | Nested spaces/folders/pages; markdown drafts; review → approve; hybrid import; acknowledgments                                   |
| `/admin/system-map`   | This document (rendered)                              | Operator + agent orientation — how the system works                                                                              |
| `/admin/settings`     | Tool links / config surface                           | Same external dashboards; kill switches are env vars on Vercel                                                                   |

**AI admin features:** Needs `AI_GATEWAY_API_KEY` + `AI_ENABLED=true` (+ brand module `ai`). Inbox draft, ops brief, invoice cover HITL. Outbound Instantly lines come from lead-finder `--ai-rank` or manual edit — not a separate admin AI draft.

Enablement steps: [`runbooks/ops-credentials.md`](./runbooks/ops-credentials.md) §9.

---

## 6. Integrations catalog

Legend: **Live** = usable in production · **Optional** = code ready, env/account pending · **Deferred** = do not build unless asked · **Historical** = planning-era only (see §9)

| Integration                 | Purpose                    | Where you use it                                            | Link / path                                                                                 | What you need it for                                                       | Status                             |
| --------------------------- | -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------- |
| **Vercel**                  | Host app, env, deploys     | Dashboard                                                   | [vercel.com/dashboard](https://vercel.com/dashboard) · also `/admin/health`                 | Ship code, set secrets, AI Gateway                                         | Live                               |
| **Supabase**                | Auth + Postgres + Storage  | Dashboard + app                                             | Project dashboard · migrations in `supabase/migrations/`                                    | Admin login, CRM, PDFs, inbox                                              | Live                               |
| **Resend**                  | Transactional email        | App only (no campaign UI)                                   | [resend.com](https://resend.com) · DNS SPF                                                  | Contact confirms, day-0 nurture (score > 60), invoice emails, admin notify | Live                               |
| **Listmonk**                | Warm newsletter + drips    | Pod UI + site form + `/admin/newsletter` + Health checklist | [newsletter.nothing.digital](https://newsletter.nothing.digital) · `LISTMONK_DASHBOARD_URL` | Opt-in list, welcome sequence, monthly broadcast                           | Live (drip UI checklist open)      |
| **Instantly**               | Cold outbound sequences    | Instantly UI + `/admin/outbound` CSV                        | [app.instantly.ai](https://app.instantly.ai)                                                | Warmup, daily caps, 3-step cold sequence                                   | Live hybrid (CSV; no API yet)      |
| **Umami**                   | Privacy-friendly analytics | Pod UI · `/admin/health`                                    | [analytics.nothing.digital](https://analytics.nothing.digital) · `UMAMI_DASHBOARD_URL`      | Traffic after cookie accept                                                | Live                               |
| **Calendly**                | Booking SoT                | Site CTAs · Health/Settings                                 | `CALENDLY_URL`                                                                              | Scoping calls                                                              | Live                               |
| **Sentry**                  | Errors / traces            | Dashboard · `/admin/health`                                 | [sentry.io](https://sentry.io)                                                              | Production issues                                                          | Live                               |
| **UptimeRobot**             | External uptime            | Dashboard · optional asset Monitor URL                      | [uptimerobot.com](https://uptimerobot.com) · `UPTIMEROBOT_DASHBOARD_URL`                    | Homepage + `/api/health` alerts                                            | Live                               |
| **Vercel Speed Insights**   | CWV                        | Vercel project                                              | Vercel → Speed Insights                                                                     | LCP/INP/CLS                                                                | Live                               |
| **Google Search Console**   | Indexing                   | GSC UI                                                      | [search.google.com/search-console](https://search.google.com/search-console)                | Sitemap (done) · weekly Coverage                                           | Live                               |
| **Bing Webmaster**          | Indexing                   | Bing UI                                                     | [bing.com/webmasters](https://www.bing.com/webmasters)                                      | Sitemap submit (remaining)                                                 | Setup open                         |
| **AI Gateway**              | LLM drafts                 | Vercel AI Gateway + app flags                               | Vercel AI Gateway docs · flags in §5                                                        | Inbox/brief/ops/invoice/outbound AI                                        | Optional (code shipped)            |
| **Google Places / Hunter**  | Lead discovery CLI + map   | Local `pnpm lead-finder` · `/admin/outbound/map`            | Env: `GOOGLE_PLACES_API_KEY`, optional `HUNTER_API_KEY`                                     | Build outbound CSV / map pins                                              | Optional for outbound pilot        |
| **n8n**                     | Webhook fan-out            | Env only today                                              | `N8N_WEBHOOK_URL` / `N8N_DASHBOARD_URL`                                                     | Slack/Listmonk glue after contact/newsletter                               | Deferred (code no-ops without env) |
| **Uptime Kuma**             | Self-hosted uptime         | Dashboard link only                                         | `KUMA_DASHBOARD_URL`                                                                        | Only if UptimeRobot fails you                                              | Deferred                           |
| **Shlink / secondary pods** | URL shortener etc.         | —                                                           | plans only                                                                                  | —                                                                          | Deferred                           |
| **Stripe**                  | Payments                   | —                                                           | —                                                                                           | Checkout / auto-pay                                                        | Deferred (YAGNI)                   |

**Email separation (non-negotiable):**

| Kind          | Tool      | Must not                      |
| ------------- | --------- | ----------------------------- |
| Cold B2B      | Instantly | Listmonk or Resend broadcasts |
| Warm / opt-in | Listmonk  | Cold CSVs                     |
| Transactional | Resend    | Marketing blasts              |

Credentials & remaining dashboard steps: [`runbooks/ops-credentials.md`](./runbooks/ops-credentials.md).

---

## 7. Core workflows

### A. Warm inbound → reply / nurture

1. Visitor submits `/contact` → row in admin Inbox + Resend confirmation.
2. Team notify via Resend **unless** `N8N_WEBHOOK_URL` is set (then n8n fan-out only — dual-notify still open debt).
3. If `scoreLead(submission) > 60` → Resend **day-0 nurture** (Calendly soft CTA). Day 3/7 live in **Listmonk**, not app code — nurture copy must not promise them until drip UI is live.
4. `/admin/inbox` → triage by score + status.
5. Optional: **Draft reply** (AI) → edit → **Approve & Send** via Resend (HITL; no auto-send).
6. Book via Calendly if they want a call.
7. Optional: **Create client from lead** when they become a client.

### B. Client → invoice → paid

1. `/admin/clients/new` → status + billing model.
2. Billing → New invoice (`draft` → `sent`).
3. On `sent`: PDF (Storage) + Resend email + `/v/{token}` link; optional AI cover draft if flag on.
4. Mark `paid` when money lands; `void` to cancel (no hard delete).
5. Client can view via `/portal`.

Details: [`runbooks/client-ops.md`](./runbooks/client-ops.md).

### C. Cold outbound → Instantly

1. Discover via `pnpm lead-finder` (CSV) **or** `/admin/outbound/map` (Places search / drop pin → Add to outbound).
2. `/admin/outbound` → review → Approve / Reject / Suppress (DNC).
3. Optional personalization line → Save.
4. Download Instantly CSV → import in Instantly.
5. Sequence copy: `content/emails/northport-cold-sequence.md`.
6. Caps ~20–40/day/inbox; bounce ≥5% → pause.
7. Log handoff on Home weekly outbound loop.

Map needs `GOOGLE_PLACES_API_KEY` on Vercel + mig `009_lead_geo.sql` (`lat`/`lng`). Default center: 11628 Cripple Creek Rd, Berry, AL.

Runbooks: [`outbound-instantly.md`](./runbooks/outbound-instantly.md) · [`outbound-pilot.md`](./runbooks/outbound-pilot.md).

### D. Newsletter / drip

1. Site subscribe → Listmonk DOI.
2. Configure sequences in Listmonk UI from `content/emails/welcome-drip.md` (day 0/3/7 warm drip — owner UI checklist).
3. Contact high-score day-0 nurture is **Resend transactional**, separate from Listmonk (cold ≠ warm ≠ transactional).
4. Track checklist at `/admin/health#listmonk-drip`.
5. Monthly broadcast from `content/newsletters/` drafts.

Runbook: [`listmonk-drip.md`](./runbooks/listmonk-drip.md).

### E. Ops glance / monitoring

1. Daily: `/admin` Today loops + Sentry production issues.
2. UptimeRobot alerts email if site/health fails.
3. Weekly: Umami + Speed Insights + GSC — [`post-launch-monitoring.md`](./runbooks/post-launch-monitoring.md).
4. Asset-level: paste status-page URL on client asset **Monitor URL**.

---

## 8. Data, auth, migrations

**Admin gate:** email in `ADMIN_EMAILS` (comma-separated) + Supabase Auth user.  
**Client portal:** sign-in with client `primary_email` (separate from staff).

| Migration                      | Provides                                               |
| ------------------------------ | ------------------------------------------------------ |
| `001_initial.sql`              | Base (contact submissions, etc.)                       |
| `002_client_ops.sql`           | Clients, invoices, assets, work                        |
| `003_asset_monitor_url.sql`    | Asset `monitor_url`                                    |
| `004_profiles.sql`             | `profiles` / `app_role` / `is_staff` (confirm applied) |
| `005_admin_loops.sql`          | Today loops, checklists, lead candidates, DNC          |
| `006_pdf_documents.sql`        | Invoice PDFs, documents, Storage                       |
| `007_lead_personalization.sql` | Lead `personalization` column                          |
| `008_kb_docs.sql`              | Admin knowledge base                                   |
| `009_lead_geo.sql`             | Lead `lat`/`lng` for outbound map pins                 |

Apply via Supabase SQL editor when SCRATCHPAD / ops-credentials say so. Empty Billing/Work until you create clients — no seed data.

---

## 9. Historical / archived

> **Do not treat these as live work.** Open checklists inside them are stale. Use SCRATCHPAD for what’s left.

| Artifact                                                                                                         | What it was                                       | Status label                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`plans/00-master-document.md`](../plans/00-master-document.md)                                                  | Phase 1–6 build roadmap + agent planning rollup   | **Historical roadmap** — narrative only; next work = SCRATCHPAD                                                                               |
| [`plans/05-pikapods-integrations.md`](../plans/05-pikapods-integrations.md)                                      | Sidecar cost/build specs                          | **Partial live** (Umami/Listmonk/Calendly) · rest deferred                                                                                    |
| `nothing://` protocol / Tauri desktop                                                                            | Address-bar brand experiment                      | **Skipped / historical** — browsers cannot show custom schemes as secure web origins                                                          |
| Instantly **API** push from admin                                                                                | Approve → API sync, pause, metrics                | **Spec / future** — [`admin-automation-until-hire`](./superpowers/specs/2026-08-06-admin-automation-until-hire-design.md); today = CSV hybrid |
| Safe Resend auto-templates                                                                                       | Overdue reminders, receipts without freeform      | **Spec / future** — same design doc                                                                                                           |
| Client kit Phase 1+                                                                                              | Template pack, scaffolder, brand UI, multi-tenant | **Deferred** — Phase 0 seams shipped; see [`client-kit.md`](./client-kit.md)                                                                  |
| Full in-app nurture sequence                                                                                     | Day 3/7 in app                                    | **Out of scope** — Listmonk owns warm drip; app only day-0 when score > 60                                                                    |
| n8n / Kuma / Shlink / secondary pods                                                                             | Fan-out, self-hosted uptime, short links          | **Deferred** until explicit ask (n8n code no-ops without env)                                                                                 |
| Secretary Phase B                                                                                                | Staff profiles RLS, invites                       | **Deferred until hire**                                                                                                                       |
| Stripe Checkout                                                                                                  | Auto payment                                      | **Deferred (YAGNI)**                                                                                                                          |
| Sitewide chatbot / RAG agents                                                                                    | Growth LATER                                      | **Out of scope** until real need                                                                                                              |
| ML lead scoring / Instantly API / new nurture queue                                                              | Lead-gen dead ends                                | **Rejected** — rule-based score + CSV hybrid + Listmonk stay                                                                                  |
| [`docs/archive/`](./archive/), [`runbooks/archive/`](./runbooks/archive/), [`plans/archive/`](../plans/archive/) | Old SCRATCHPADs, smoke evidence, phase checklists | **Archive**                                                                                                                                   |
| [`docs/superpowers/plans/`](./superpowers/plans/), [`specs/`](./superpowers/specs/)                              | Shipped implementation plans + design specs       | **History / design reference** — update status lines only                                                                                     |

---

## 10. Doc index

| Need                     | Document                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **This map**             | [`SYSTEM-MAP.md`](./SYSTEM-MAP.md)                                                                                         |
| Live remaining work      | [`../SCRATCHPAD.md`](../SCRATCHPAD.md)                                                                                     |
| Docs hub                 | [`README.md`](./README.md)                                                                                                 |
| Agent entry              | [`../AGENTS.md`](../AGENTS.md)                                                                                             |
| Client kit / brand       | [`client-kit.md`](./client-kit.md) · [`runbooks/create-client-checklist.md`](./runbooks/create-client-checklist.md)        |
| Credentials / dashboards | [`runbooks/ops-credentials.md`](./runbooks/ops-credentials.md)                                                             |
| Admin CRM how-to         | [`runbooks/client-ops.md`](./runbooks/client-ops.md)                                                                       |
| Listmonk drip            | [`runbooks/listmonk-drip.md`](./runbooks/listmonk-drip.md)                                                                 |
| Cold outbound            | [`runbooks/outbound-instantly.md`](./runbooks/outbound-instantly.md) · [`outbound-pilot.md`](./runbooks/outbound-pilot.md) |
| Monitoring               | [`runbooks/monitoring.md`](./runbooks/monitoring.md) · [`post-launch-monitoring.md`](./runbooks/post-launch-monitoring.md) |
| DNS / SSL                | [`runbooks/dns.md`](./runbooks/dns.md) · [`ssl.md`](./runbooks/ssl.md)                                                     |
| Growth YES/NO/LATER      | [`growth-tactics.md`](./growth-tactics.md)                                                                                 |
| Agent paste prompt       | [`superpowers/HANDOFF-post-launch-ops.md`](./superpowers/HANDOFF-post-launch-ops.md)                                       |
| AI design                | [`superpowers/specs/2026-08-06-ai-integration-design.md`](./superpowers/specs/2026-08-06-ai-integration-design.md)         |
| Contracts / sales        | [`contracts/`](./contracts/) · [`sales/`](./sales/)                                                                        |

---

_Maintain this file when surfaces or integrations change. Do not duplicate SCRATCHPAD checklists here._
