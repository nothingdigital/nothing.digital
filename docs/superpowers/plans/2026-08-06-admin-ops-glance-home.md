# Admin Ops Glance Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pure `/admin` → inbox redirect with a thin ops glance page showing three counts only (new inbox, overdue invoices, open work), each linking into the existing filtered lists.

**Architecture:** Reuse `listContactSubmissions("new")`, `listInvoices()` + `effectiveInvoiceStatus`, and `listWorkItems()` (excludes `done`). Pure `countOverdueInvoices` helper for TDD. Three link cards on `src/app/admin/page.tsx`. Middleware login redirect → `/admin`. Home nav with exact active match. No charts/embeds/new APIs.

**Tech Stack:** Next.js App Router RSC, existing Supabase list helpers, Vitest, admin layout/nav.

---

## File map

| File                                         | Responsibility                                      |
| -------------------------------------------- | --------------------------------------------------- |
| Create: `src/lib/admin/ops-glance.ts`        | `countOverdueInvoices` via `effectiveInvoiceStatus` |
| Create: `src/lib/admin/ops-glance.test.ts`   | Mixed statuses → 2; empty → 0                       |
| Modify: `src/app/admin/page.tsx`             | Replace redirect with three count cards             |
| Modify: `src/middleware.ts`                  | Login bounce `/admin/inbox` → `/admin` (~L52–54)    |
| Modify: `src/components/admin/admin-nav.tsx` | Prepend Home `/admin` with `exact` active           |

**Reuse:** `/admin/inbox?status=new`, `/admin/billing?overdue=1`, `/admin/work` (open). `effectiveInvoiceStatus` in `client-ops.ts`.

---

### Task 1: Overdue count helper (TDD)

**Files:** Create `ops-glance.ts` + `ops-glance.test.ts`

- [ ] Write failing tests: overdue count with mixed statuses; empty → 0
- [ ] `npm test -- src/lib/admin/ops-glance.test.ts` — FAIL (missing export)
- [ ] Implement `countOverdueInvoices(invoices, now?)` filtering `effectiveInvoiceStatus === "overdue"`
- [ ] Re-run tests — PASS
- [ ] Commit: `feat(admin): add overdue invoice count helper`

---

### Task 2: Ops glance page

**Files:** Modify `src/app/admin/page.tsx`

- [ ] Replace redirect with RSC: `Promise.all` of new inbox / invoices / work; three `Link` cards (label, count or `—` on error, hint)
- [ ] Card hrefs: `/admin/inbox?status=new`, `/admin/billing?overdue=1`, `/admin/work`
- [ ] Counts only — no charts, tables, `getAdminToolLinks`, Stripe
- [ ] `npm run type-check` — PASS
- [ ] Commit: `feat(admin): replace /admin redirect with ops glance`

---

### Task 3: Landing + Home nav

**Files:** Modify `src/middleware.ts`, `src/components/admin/admin-nav.tsx`

- [ ] Middleware: redirect allowed login to `/admin` (not `/admin/inbox`)
- [ ] Nav: prepend `{ href: "/admin", label: "Home", exact: true }`; exact match so `/admin/*` does not highlight Home
- [ ] `npm test -- src/lib/admin/ops-glance.test.ts src/lib/admin/client-ops.test.ts` + type-check — PASS
- [ ] Manual smoke: login → `/admin`; three links; Home active only on `/admin`
- [ ] Commit: `feat(admin): land on ops glance and add Home nav`

---

## Test plan

- Unit: overdue mixed + empty (`ops-glance.test.ts`)
- Manual: login lands `/admin`; card URLs match filters; Home exact-active
- Review: no charts/embeds on `page.tsx`

## Out of scope

- Charts/sparklines; embeds (Calendly/Umami/Listmonk/n8n/Kuma)
- New `count(*)` RPCs; Stripe/roles; changing list pages; newsletter/health counts

## Commit checkpoints

1. `feat(admin): add overdue invoice count helper`
2. `feat(admin): replace /admin redirect with ops glance`
3. `feat(admin): land on ops glance and add Home nav`
