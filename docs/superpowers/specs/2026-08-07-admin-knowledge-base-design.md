# Admin Knowledge Base (Docs) — Design Spec

**Date:** 2026-08-07  
**Status:** Draft — pending review  
**Owner:** Nothing.Digital (The Business of Nothing LLC)

## Purpose

Give `/admin` a Confluence-style internal documentation space for business logic, privacy policy, onboarding, employee handbook, contracts, templates, and similar company docs — with nested organization, hybrid file import, formal review, and read acknowledgments.

This is **admin-only**. It does not publish to the public site or client portal. It is separate from CRM/portal `documents` (client PDFs).

## Decisions (locked)

| Decision        | Choice                                                          |
| --------------- | --------------------------------------------------------------- |
| Audience        | Admin only (`ADMIN_EMAILS` / staff gate)                        |
| Architecture    | In-app wiki on Supabase + private Storage                       |
| Organization    | Nested tree: spaces → folders → pages                           |
| Import          | Hybrid: keep original file + extract editable draft             |
| Review          | Draft → In review → Approved, with version history              |
| Acknowledgments | On approved pages that require ack; re-approve stale prior acks |
| Scope           | Full stack in one project (wiki + import + approval + acks)     |
| Nav             | **Docs** immediately left of **System map**                     |
| System map      | Unchanged (repo `docs/SYSTEM-MAP.md` render)                    |

## Placement & IA

- Route: `/admin/docs` (tree + home) and `/admin/docs/[pageId]` (stable page ids).
- Nav: insert `{ href: "/admin/docs", label: "Docs" }` before System map in `admin-nav.tsx`.
- Layout: left tree (spaces / folders / pages) + main pane (view / edit).
- Seed empty spaces (renameable): **HR**, **Legal**, **Templates**, **Business logic**.
- Do not merge with `documents` table / portal file UX.

## Data model

New migration (e.g. `008_kb_docs.sql`). Namespaced `kb_*` to avoid collision with client `documents`.

### Tables

| Table                | Role                                                                                                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `kb_spaces`          | Top-level buckets: `id`, `title`, `slug`, `sort_order`, timestamps                                                                                                                                                       |
| `kb_nodes`           | Tree: `id`, `space_id`, `parent_id` (nullable), `type` (`folder` \| `page`), `title`, `sort_order`, timestamps                                                                                                           |
| `kb_pages`           | 1:1 with page nodes: `node_id`, body (TipTap JSON), `body_text` (search/plain), `status` (`draft` \| `in_review` \| `approved`), `current_version` int, `approved_version` int nullable, `requires_ack` bool, timestamps |
| `kb_versions`        | Snapshots: `page_id`, `version`, body snapshot, `status`, `author_id`, `note`, `created_at`                                                                                                                              |
| `kb_attachments`     | Files: `page_id`, `storage_path`, `filename`, `mime`, `kind` (`import_original` \| `attachment`), `byte_size`, timestamps                                                                                                |
| `kb_acknowledgments` | `page_id`, `user_id`, `version` (must match `approved_version` when acking), `acked_at`; unique `(page_id, user_id, version)`                                                                                            |

### Rules

- Folder nodes have no `kb_pages` row; page nodes always have one.
- Page URLs use `kb_pages.id` (stable; tree moves do not change the URL).
- Moving a page = update `kb_nodes.parent_id` / `space_id` (ids stable).
- Delete folder: block if children exist unless explicit cascade confirm.
- Status transitions only: `draft` → `in_review` → `approved`, or `in_review` / `approved` → `draft` (send back). Illegal jumps rejected in server logic. No skip from `draft` straight to `approved`.
- Content save always bumps `current_version` and appends `kb_versions`. Status-only transitions also append a version row (same body, new status).
- On **Approve**: set `status = approved` and `approved_version = current_version`.
- On edit after approve: transition back to `draft` (send back or save-as-draft); `approved_version` stays until the next Approve so history of “what was signed off” remains clear; “needs ack” only applies while `status = approved`.
- Acknowledgments apply only when `status = approved` and `requires_ack = true`. “Needs ack” for a user = no `kb_acknowledgments` row for `(page_id, user_id, approved_version)`.
- Re-approve after changes sets a new `approved_version`; prior ack rows remain for audit but no longer satisfy “needs ack.”
- RLS: no anon access; authenticated staff / service role aligned with other admin tables. Storage bucket private.

### Storage

- New private bucket `kb-docs` (size limit ~15MB unless raised), allowed mime types for docx/xlsx/numbers/pdf/images as needed for attachments.
- Distinct from `invoices` and `documents` buckets.

## Editor, import, page actions

### Editor

- TipTap rich text: headings, lists, tables, links, basic marks.
- Persist TipTap JSON + derived `body_text`.
- Tree actions: create space / folder / page; rename; reorder (`sort_order`); move (change parent).

### Status UX

- Buttons: Save draft · Submit for review · Approve · Send back to draft.
- Version history: list snapshots; open read-only; restore copies body into a new draft version.

### Hybrid import

1. Upload `.docx` / `.xlsx` / `.numbers` (optional `.pdf` as attachment-only, no extract required).
2. Store original in `kb-docs` + `kb_attachments` (`kind = import_original`).
3. Create draft page under chosen folder; run extractors:
   - **Word:** Mammoth → HTML → TipTap JSON (best-effort).
   - **XLSX:** SheetJS → HTML/markdown tables → TipTap JSON.
   - **Numbers:** best-effort parse; on failure keep file + empty draft + banner: export to XLSX and re-run extract.
4. User cleans extract, then normal review flow.
5. Original always downloadable from the page.

### Acknowledgments UX

- Approved + `requires_ack`: “I have read this” records ack for current approved version.
- Page shows who has / hasn’t among known admin users (from auth/profiles allowlist as available).
- `/admin/docs` home: “Needs your acknowledgment” strip.

## Architecture & flows

```
Admin nav → /admin/docs
                │
        ┌───────┴────────┐
        │ Tree (kb_*)    │  Main pane (view / TipTap / import)
        └───────┬────────┘
                │
     Server actions / admin APIs
                │
     ┌──────────┼──────────┐
     Supabase   Storage    Extractors
     (kb_*)     (kb-docs)  (Mammoth / SheetJS)
```

| Flow   | Steps                                                                                                                        |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Edit   | Open page → TipTap → save → version row                                                                                      |
| Review | draft → in_review → approved (or back to draft)                                                                              |
| Import | upload → store → extract → draft + attachment → edit → review                                                                |
| Ack    | approved + requires_ack → user acks `approved_version` → list updates; re-approve → new `approved_version` → needs ack again |

## Error handling

| Case                    | Behavior                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| Extract fails           | Draft page + original file still created; banner explains failure |
| Concurrent edit         | Last-write-wins (solo-admin acceptable; no CRDT)                  |
| Non-empty folder delete | Block unless cascade confirmed                                    |
| Oversize upload         | Reject at Storage / API limit                                     |
| Numbers unsupported     | Attachment kept; empty body + guidance                            |

## Testing

Vitest (prefer pure helpers over full UI):

- Status transition matrix (illegal jumps throw / return error).
- Ack “needs ack” logic vs `approved_version`; re-approve sets new `approved_version` so old acks no longer count.
- Tree parent/move constraints.
- Import helpers with fixture docx/xlsx → non-empty extract (Numbers optional / skip if unsupported).

## Out of scope (v1)

- Public site or portal publishing of KB pages
- Comments, @mentions, realtime collab
- Full-text search beyond title / simple `body_text` filter
- Notion / external wiki sync
- Merging with client CRM `documents`
- Instantly / Listmonk / secretary Phase B staff invites (acks work for current admin users; richer staff roster later)

## Implementation touchpoints (indicative)

| Area                | Likely paths                                     |
| ------------------- | ------------------------------------------------ |
| Nav                 | `src/components/admin/admin-nav.tsx`             |
| Routes              | `src/app/admin/docs/**`                          |
| Domain              | `src/lib/kb/**` (queries, status, import, ack)   |
| Migration           | `supabase/migrations/008_kb_docs.sql`            |
| System map / README | Document new `/admin/docs` capability after ship |
| Deps                | `@tiptap/*`, `mammoth`, `xlsx` (SheetJS)         |

## Success criteria

- Admin can create a nested handbook page, submit for review, approve, and ack it.
- Importing a Word or Excel file yields a downloadable original plus an editable draft (or a clear failure banner with the file preserved).
- Docs sits left of System map; client portal documents behavior unchanged.
