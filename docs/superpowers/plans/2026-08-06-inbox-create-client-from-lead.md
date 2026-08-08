# Inbox → Create Client from Lead Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** From an admin inbox contact submission, one action creates a client prefilled from name/email/company/message notes, redirects to the new client, and optionally marks the submission replied or archived.

**Architecture:** Pure notes helper + `getContactSubmission` + server action `createClientFromInboxAction` (`requireAdmin` → fetch → `createClient` → optional `updateContactStatus` → redirect `/admin/clients/{id}`). Per-row form on inbox. Defaults match `createClientAction`: `status: "lead"`, `billing_model: "none"`, `payment_terms: "net_15"`.

**Tech Stack:** Next.js server actions, Supabase service role, Vitest, existing admin `Button`/form patterns.

---

## File map

| File                                          | Responsibility                                  |
| --------------------------------------------- | ----------------------------------------------- |
| Create: `src/lib/admin/inbox-lead.ts`         | `buildClientNotesFromSubmission`                |
| Create: `src/lib/admin/inbox-lead.test.ts`    | Service/budget/message lines; omit nulls        |
| Modify: `src/lib/admin/queries.ts`            | `getContactSubmission(id)`                      |
| Modify: `src/app/admin/inbox/actions.ts`      | `createClientFromInboxAction`                   |
| Create: `src/app/admin/inbox/actions.test.ts` | Happy path, skip mark, missing submission       |
| Modify: `src/app/admin/inbox/page.tsx`        | Per-row Create client form + mark_status select |

**Reuse:** `requireAdmin`, `createClient`, `updateContactStatus`, `isInboxStatus`, contact row types. Mock pattern: `src/app/admin/login/actions.test.ts`.

---

### Task 1: Notes helper (TDD)

**Files:** Create `inbox-lead.ts` + `inbox-lead.test.ts`

- [ ] Failing tests: notes include service/budget/message; omit null service/budget
- [ ] `npm test -- src/lib/admin/inbox-lead.test.ts` — FAIL
- [ ] Implement `buildClientNotesFromSubmission` — lines: `Inbox lead {id}`, optional Service/Budget, blank line, trimmed message
- [ ] Tests PASS; commit: `feat(admin): add inbox lead notes helper`

---

### Task 2: Fetch submission by id

**Files:** Modify `src/lib/admin/queries.ts`

- [ ] Add `getContactSubmission(id)` — mirror `getClient` shape `{ row, error }`; `contact_submissions` `.maybeSingle()`
- [ ] Type-check PASS; commit: `feat(admin): fetch contact submission by id`

---

### Task 3: Server action (TDD)

**Files:** Modify `actions.ts`; create `actions.test.ts`

- [ ] Failing mocked tests: create + redirect + mark replied; empty `mark_status` skips update; missing submission throws
- [ ] Implement `createClientFromInboxAction(formData)`: validate id/`mark_status`; create with notes; optional status; `revalidatePath` inbox+clients; `redirect` to new client
- [ ] Keep existing `updateInboxStatusAction`
- [ ] Tests PASS; commit: `feat(admin): create client from inbox submission`

---

### Task 4: Inbox UI

**Files:** Modify `src/app/admin/inbox/page.tsx`

- [ ] Per row: form → `createClientFromInboxAction`; hidden `submission_id`; select `mark_status` (default `replied`; options leave/replied/archived); **Create client** button
- [ ] Keep `StatusSelect` / filter chips; no charts
- [ ] Type-check + unit tests PASS
- [ ] Manual: create → client fields/notes; mark replied/leave status
- [ ] Commit: `feat(admin): add create-client control on inbox rows`

---

## Test plan

- Unit: notes helper; action happy/skip/missing
- Manual: create client from inbox; status select behavior
- Auth: `requireAdmin` + middleware unchanged

## Out of scope

- Email dedupe/merge; prefill `/admin/clients/new`; submission↔client FK
- Stripe/roles/charts; changing filters/`StatusSelect`

## Commit checkpoints

1. `feat(admin): add inbox lead notes helper`
2. `feat(admin): fetch contact submission by id`
3. `feat(admin): create client from inbox submission`
4. `feat(admin): add create-client control on inbox rows`
