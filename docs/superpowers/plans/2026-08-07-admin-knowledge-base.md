# Admin Knowledge Base (Docs) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship admin-only Confluence-style Docs at `/admin/docs` (left of System map) with nested tree, markdown pages, Draft→In review→Approved, hybrid import, and acknowledgments.

**Architecture:** Supabase `kb_*` tables + private `kb-docs` bucket; service-role queries like other admin ops; markdown body (not TipTap — ponytail: reuse `next-mdx-remote` / textarea). Pure helpers for status + ack rules.

**Tech Stack:** Next.js App Router, Supabase, Vitest, `mammoth` (docx), `xlsx` (SheetJS). Numbers = store file + fail banner (no parser).

**Spec:** `docs/superpowers/specs/2026-08-07-admin-knowledge-base-design.md`  
**Ponytail deltas vs TipTap in spec:** markdown string body; same IA/review/import/acks.

---

## File map

| Path                                  | Responsibility                       |
| ------------------------------------- | ------------------------------------ |
| `supabase/migrations/008_kb_docs.sql` | Tables, RLS, seed spaces, bucket     |
| `src/lib/supabase/database.ts`        | Add `kb_*` table types               |
| `src/lib/kb/status.ts`                | Transition matrix                    |
| `src/lib/kb/ack.ts`                   | needsAck helper                      |
| `src/lib/kb/queries.ts`               | CRUD / tree / versions / attachments |
| `src/lib/kb/import.ts`                | docx/xlsx extract → markdown         |
| `src/lib/kb/storage.ts`               | Upload/download kb-docs              |
| `src/lib/kb/*.test.ts`                | Unit tests                           |
| `src/app/admin/docs/**`               | Pages + server actions + tree UI     |
| `src/components/admin/admin-nav.tsx`  | Docs link before System map          |
| `docs/SYSTEM-MAP.md`                  | One row for `/admin/docs`            |

---

### Task 1: Migration + types (DevOps)

**Files:** Create `supabase/migrations/008_kb_docs.sql`; Modify `src/lib/supabase/database.ts`

- [ ] Create tables per spec: `kb_spaces`, `kb_nodes`, `kb_pages` (body `text` markdown, `approved_version` nullable), `kb_versions`, `kb_attachments`, `kb_acknowledgments`
- [ ] RLS: anon deny; staff/service patterns like `006_pdf_documents.sql`
- [ ] Bucket `kb-docs` private ~15MB; mime: docx, xlsx, numbers, pdf, images, octet-stream
- [ ] Seed spaces: HR, Legal, Templates, Business logic
- [ ] Add matching types to `database.ts`
- [ ] Commit: `feat(kb): add knowledge base schema`

### Task 2: Pure domain helpers + tests

**Files:** Create `src/lib/kb/status.ts`, `ack.ts`, `*.test.ts`

- [ ] `canTransition(from, to)` + `assertTransition`
- [ ] `needsAck({ status, requires_ack, approved_version, ackVersion })`
- [ ] Vitest for illegal jumps + re-approve stale acks
- [ ] Commit: `feat(kb): status and ack helpers`

### Task 3: Queries + storage + import

**Files:** Create `src/lib/kb/queries.ts`, `storage.ts`, `import.ts`, `import.test.ts`

- [ ] listSpaces, listNodes, getPage, createFolder/Page, rename, move, delete (empty folder block)
- [ ] savePage (bump version + kb_versions row), transitionStatus, listVersions, restoreToDraft
- [ ] acknowledgePage, listAcks, pagesNeedingAckForUser
- [ ] uploadKbFile / downloadKbFile (generic content-type, not PDF-only)
- [ ] extractDocx / extractXlsx → markdown; numbers → `{ ok:false, markdown:"" }`
- [ ] Commit: `feat(kb): queries import storage`

### Task 4: Admin UI + actions

**Files:** Create `src/app/admin/docs/**`; Modify `admin-nav.tsx`

- [ ] Nav: Docs before System map
- [ ] Layout: left tree + children
- [ ] Home: needs-ack strip + import form
- [ ] Page view/edit: markdown textarea, status buttons, version list, attachments, ack button
- [ ] Server actions wrapping queries (admin gate already via layout)
- [ ] Render approved/view with existing MDX approach (copy light styles from system-map)
- [ ] Commit: `feat(kb): admin docs UI`

### Task 5: Docs + QA pass

**Files:** Modify `docs/SYSTEM-MAP.md`; run tests

- [ ] Add `/admin/docs` row to admin capabilities table
- [ ] `npm test` for kb tests; `npm run type-check`
- [ ] Commit: `docs(kb): system map entry`

### Task 6: Ponytail review

- [ ] Run `/ponytail-review` on the branch diff; cut findings before push
