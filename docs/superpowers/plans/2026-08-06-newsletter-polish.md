# Newsletter Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CSV export and admin unsubscribe on `/admin/newsletter` while keeping Listmonk as campaign SoT and reusing the existing Health/Settings dashboard link.

**Architecture:** Supabase `newsletter_subscribers` stays admin list mirror. Pure CSV formatter + `unsubscribeNewsletterSubscriber` (sets `unsubscribed_at`). Server action + authenticated CSV GET route. Page: Export CSV, Open Listmonk, dual-SoT note, per-row Unsubscribe. No Listmonk UI rebuild.

**Tech Stack:** Next.js App Router RSC, `"use server"` actions, Supabase service role, Vitest.

---

## File map

| File                                               | Responsibility                            |
| -------------------------------------------------- | ----------------------------------------- |
| Create: `src/lib/admin/newsletter-csv.ts`          | `escapeCsvField`, `buildNewsletterCsv`    |
| Create: `src/lib/admin/newsletter-csv.test.ts`     | Escape + header/status rows               |
| Modify: `src/lib/admin/queries.ts`                 | `unsubscribeNewsletterSubscriber(id)`     |
| Create: `src/app/admin/newsletter/actions.ts`      | `unsubscribeNewsletterAction`             |
| Create: `src/app/admin/newsletter/export/route.ts` | `GET` → `text/csv` after `requireAdmin`   |
| Modify: `src/app/admin/newsletter/page.tsx`        | Export, Listmonk link, Unsubscribe column |
| Modify: `plans/05-pikapods-integrations.md`        | Check off CSV + unsubscribe               |

**Reuse:** `listNewsletterSubscribers`, `ConfirmSubmitButton`, `getAdminToolLinks().listmonk`, `requireAdmin`. Schema: `unsubscribed_at` already in `001_initial.sql`.

---

### Task 1: CSV helper (TDD)

**Files:** Create `newsletter-csv.ts` + `.test.ts`

- [ ] Failing tests: plain escape; quote commas/quotes/newlines; CSV header `email,subscribed_at,status,unsubscribed_at` + active/unsubscribed rows
- [ ] Implement escape + `buildNewsletterCsv` (status from `unsubscribed_at`)
- [ ] Tests PASS; commit: `feat: add newsletter CSV formatter`

---

### Task 2: Unsubscribe query

**Files:** Modify `src/lib/admin/queries.ts`

- [ ] Add `unsubscribeNewsletterSubscriber`: set `unsubscribed_at` where null; return `{ ok }` / error; no Listmonk API call
- [ ] Commit: `feat: unsubscribe newsletter subscriber in Supabase`

---

### Task 3: Action + export route

**Files:** Create `actions.ts`, `export/route.ts`

- [ ] `unsubscribeNewsletterAction`: `requireAdmin`, id from FormData, query, `revalidatePath("/admin/newsletter")`
- [ ] `GET` export: `requireAdmin` → list → `buildNewsletterCsv` → attachment `newsletter-subscribers-YYYY-MM-DD.csv`, `Cache-Control: no-store`
- [ ] Commit: `feat: add newsletter unsubscribe action and CSV export route`

---

### Task 4: Newsletter UI

**Files:** Modify `src/app/admin/newsletter/page.tsx`

- [ ] Header: Export → `/admin/newsletter/export`; Open Listmonk if `tools.listmonk`; dual-SoT one-liner
- [ ] Actions column: `ConfirmSubmitButton` Unsubscribe for active rows only (message mentions Listmonk)
- [ ] Type-check PASS; commit: `feat: wire newsletter CSV export and unsubscribe UI`

---

### Task 5: Docs checklist

**Files:** Modify `plans/05-pikapods-integrations.md`

- [ ] Mark CSV + unsubscribe shipped; keep dual-SoT wording (no Listmonk API sync claim)
- [ ] Commit: `docs: mark newsletter CSV and unsubscribe polish done`

---

## Test plan

- Unit: CSV escape + build
- Manual: export CSV; unsubscribe → status + re-export; Listmonk Open on Health unchanged
- Unauthed GET `/admin/newsletter/export` → login redirect

## Out of scope

- Listmonk campaign/DOI UI; Listmonk API sync; drop Supabase writes
- Resubscribe action; Stripe/Umami embeds/n8n

## Commit checkpoints

1. `feat: add newsletter CSV formatter`
2. `feat: unsubscribe newsletter subscriber in Supabase`
3. `feat: add newsletter unsubscribe action and CSV export route`
4. `feat: wire newsletter CSV export and unsubscribe UI`
5. `docs: mark newsletter CSV and unsubscribe polish done`
