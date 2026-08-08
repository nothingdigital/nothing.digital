# Handoff prompt — Admin follow-up plans

> **ARCHIVED.** Shipped on `main`. Do not re-run.  
> Live board: [`../../SCRATCHPAD.md`](../../SCRATCHPAD.md) · Current handoff: [`../superpowers/HANDOFF-post-launch-ops.md`](../superpowers/HANDOFF-post-launch-ops.md)

> **Status (2026-08-06):** **Shipped on** `feat/admin-followups-wave` (plans 1–6 implemented).  
> **Next agent:** use HANDOFF-post-launch-ops — do not re-run this wave.

Copy everything below the line only if you must re-verify or finish merging this wave to `main`.

---

## Prompt (paste into next agent) — LEGACY

You are continuing work on **Nothing.Digital** admin portal polish at `/Users/DeSchroyer/workspace/nothingdigital`.

### Mission

Implement the **admin follow-up plans** already written under `docs/superpowers/plans/`. Do **not** invent a new roadmap. Do **not** rebuild Umami charts or iframe Listmonk/n8n/Kuma. External dashboards stay deep-links.

**If code for plans 1–6 already exists on `feat/admin-followups-wave`:** prefer merging that branch to `main` over re-implementing. Then switch to [HANDOFF-post-launch-ops.md](./HANDOFF-post-launch-ops.md).

### First actions (required)

1. **Spin up explore/generalPurpose agents in parallel** to load context before coding:
   - Agent A: read `docs/superpowers/plans/README.md` and skim all six plan files (headers + file maps only).
   - Agent B: map current admin routes (`src/app/admin/**`, `src/components/admin/admin-nav.tsx`, `src/lib/admin/*`).
   - Agent C: confirm related runbooks/plans listed below still match the codebase.
2. Ask the user which plan(s) to execute (or default to recommended order 1→6 if they say “do all”).
3. For each selected plan, use **subagent-driven-development** (preferred) or **executing-plans**: one task at a time, checkbox tracking, TDD for pure helpers, conventional commits when the user asks to commit.

### Where to view documentation

**Plan index (start here):**  
`docs/superpowers/plans/README.md`

**Implementation plans:**

| Order | File                                                                 |
| ----: | -------------------------------------------------------------------- |
|     1 | `docs/superpowers/plans/2026-08-06-admin-ops-glance-home.md`         |
|     2 | `docs/superpowers/plans/2026-08-06-inbox-create-client-from-lead.md` |
|     3 | `docs/superpowers/plans/2026-08-06-newsletter-polish.md`             |
|     4 | `docs/superpowers/plans/2026-08-06-work-queue-polish.md`             |
|     5 | `docs/superpowers/plans/2026-08-06-health-status-chips.md`           |
|     6 | `docs/superpowers/plans/2026-08-06-asset-edit-monitor-link.md`       |

**Product / ops docs:**

- `docs/runbooks/client-ops.md` — clients, billing, assets, work
- `docs/runbooks/monitoring.md` — uptime + health ops
- `plans/05-pikapods-integrations.md` — Pack F/H + “launcher links only — never reimplement Umami charts”
- `plans/00-master-document.md` — master roadmap

**Prior shipped wave (already on `main`):** Pack H billing/work usability (create from global tabs, invoice edit/void, work edit/delete). Do not redo that work.

### Locked product decisions

- Payments stay manual (no Stripe in this wave)
- Invoice cancel = `void` (no hard delete)
- Health/Settings: deep-link dashboards; chips may show `/api/health` env-presence flags only
- Asset `monitor_url` is a plain URL field (needs migration `003` if implementing plan 6)
- Newsletter: Supabase list + CSV/unsubscribe; Listmonk remains campaign SoT via deep-link

### Out of scope (do not start unless user explicitly expands)

- Secretary roles / RLS overhaul
- Calendly webhook → bookings table
- Stripe / client portal
- Full Umami/Listmonk embeds or chart libraries
- IT device inventory

### Done criteria per plan

- Plan checkboxes completed (or explicitly deferred with note)
- Unit tests for new pure helpers green
- Manual smoke of touched admin routes
- Runbook updates if the plan requires them
- Commit only when the user asks

### Suggested first message after agents return

Confirm plan order with the user, then begin plan **1 (ops glance home)** unless they pick otherwise — **or** if the feature branch already contains 1–6, open/merge the PR and hand off to post-launch ops.
