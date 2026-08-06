# Asset Edit + Monitor Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins edit client asset fields and optionally store/show an external monitor (uptime) URL on the Assets tab — without building IT inventory.

**Architecture:** Mirror invoice edit pattern. `monitor_url` missing on `client_assets` — add migration `003`, types, then create/edit/list. Plain URL field (UptimeRobot/Kuma status link), not an API integration. Keep status dropdown; no hard delete (retire via status).

**Tech Stack:** Next.js App Router, Supabase migration + service-role queries, existing admin form primitives.

---

## File map

| File                                                    | Responsibility                                       |
| ------------------------------------------------------- | ---------------------------------------------------- |
| Create: `supabase/migrations/003_asset_monitor_url.sql` | `ADD COLUMN monitor_url text`                        |
| Modify: `src/lib/supabase/database.ts`                  | Row/Insert/Update `monitor_url`                      |
| Modify: `src/lib/admin/client-ops-queries.ts`           | `getClientAsset`, `updateClientAsset`; extend create |
| Modify: `src/app/admin/clients/actions.ts`              | `updateAssetAction`; `monitor_url` on create         |
| Create: `.../assets/[assetId]/edit/page.tsx`            | Edit form (all fields + monitor_url)                 |
| Modify: `src/app/admin/clients/[id]/page.tsx`           | Create field; list Edit + monitor link               |
| Modify: `docs/runbooks/client-ops.md`                   | Document edit + monitor_url                          |
| Modify: `docs/runbooks/monitoring.md`                   | Cross-link client asset monitor URLs                 |

**Reuse:** Invoice edit at `.../invoices/[invoiceId]/edit/page.tsx`. Keep `updateClientAssetStatus` for list dropdown.

---

### Task 1: Migration + types

**Files:** `003_asset_monitor_url.sql`, `database.ts`

- [ ] Confirm `002` has no `monitor_url`
- [ ] Migration: `ALTER TABLE client_assets ADD COLUMN IF NOT EXISTS monitor_url text`
- [ ] Types: `monitor_url: string | null` on Row; optional on Insert/Update
- [ ] Commit: `feat: add client_assets.monitor_url column`

---

### Task 2: Query layer

**Files:** Modify `client-ops-queries.ts`

- [ ] Extend `CreateAssetInput` / `createClientAsset` with `monitor_url`
- [ ] Add `getClientAsset(id)`, `UpdateAssetInput`, `updateClientAsset` (all editable fields + `updated_at`)
- [ ] Keep `updateClientAssetStatus`
- [ ] Commit: `feat: add get/update client asset queries with monitor_url`

---

### Task 3: Server actions

**Files:** Modify `src/app/admin/clients/actions.ts`

- [ ] Pass `monitor_url` from FormData in `createAssetAction`
- [ ] Add `updateAssetAction`: validate type/env/status; `updateClientAsset`; revalidate + redirect `?tab=assets`
- [ ] No delete action
- [ ] Commit: `feat: add updateAssetAction and monitor_url on create`

---

### Task 4: Edit page

**Files:** Create `src/app/admin/clients/[id]/assets/[assetId]/edit/page.tsx`

- [ ] Mirror invoice edit: load client+asset; `notFound` if wrong client; form → `updateAssetAction` (name, type, env, status, url, monitor_url, managed_by_us, notes)
- [ ] Commit: `feat: add admin edit asset page`

---

### Task 5: List + create UI

**Files:** Modify `src/app/admin/clients/[id]/page.tsx`

- [ ] Create form: optional Monitor URL field
- [ ] List row: Edit link; **monitor** link if set (`target="_blank"`); keep open URL + `AssetStatusSelect`
- [ ] Type-check PASS; commit: `feat: show asset edit and monitor links on client assets tab`

---

### Task 6: Runbooks

**Files:** `client-ops.md`, `monitoring.md`

- [ ] Client-ops: edit fields + monitor_url; apply `003`; deferred = IT inventory only
- [ ] Monitoring: paste status URL into asset Monitor URL; link client-ops
- [ ] Commit: `docs: document asset edit and monitor_url`

---

## Test plan

- Apply `003`; type-check PASS
- Manual: create with monitor → list link; edit all fields; clear monitor; wrong-client edit → notFound; retire via status (no delete)

## Out of scope

- Hard delete; UptimeRobot/Kuma API/IDs/webhooks
- IT inventory; Stripe/Umami embeds; global `/admin/assets`

## Commit checkpoints

1. `feat: add client_assets.monitor_url column`
2. `feat: add get/update client asset queries with monitor_url`
3. `feat: add updateAssetAction and monitor_url on create`
4. `feat: add admin edit asset page`
5. `feat: show asset edit and monitor links on client assets tab`
6. `docs: document asset edit and monitor_url`
