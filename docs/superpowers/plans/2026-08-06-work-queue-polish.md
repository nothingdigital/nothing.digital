# Work Queue Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/admin/work` emphasize due-soon and blocked items and support sort by due date / priority while keeping existing status filter chips.

**Architecture:** Keep `listWorkItems({ status })` (Open = not `done`). Pure helpers in `client-ops.ts`: `WORK_SORTS`, `isWorkDueSoon`, `compareWorkItems`. In-memory sort via `?sort=` (default `due`). Emphasize `blocked` + due within 7 days/overdue. No assignees/kanban.

**Tech Stack:** Next.js App Router, `AdminFilterChip`, Vitest, existing Badge/list UI on work page.

---

## File map

| File                                       | Responsibility                                                  |
| ------------------------------------------ | --------------------------------------------------------------- |
| Modify: `src/lib/admin/client-ops.ts`      | `WORK_SORTS`, `isWorkSort`, `isWorkDueSoon`, `compareWorkItems` |
| Modify: `src/lib/admin/client-ops.test.ts` | Sort keys, due-soon window, due/priority/created order          |
| Modify: `src/app/admin/work/page.tsx`      | Sort chips + row emphasis; preserve status chips                |
| Modify: `docs/runbooks/client-ops.md`      | Document Open / sort / due-soon / blocked                       |

**Reuse:** `listWorkItems`, `WORK_STATUSES`/`WORK_PRIORITIES`, `AdminFilterChip`, `WorkStatusSelect`. DB order unchanged — sort in page.

---

### Task 1: Sort + due-soon helpers (TDD)

**Files:** Modify `client-ops.ts` + `client-ops.test.ts`

- [ ] Failing tests: `isWorkSort` / `WORK_SORTS`; due-soon (overdue + ≤7d, not null/far); due asc nulls last; priority high>med>low; created desc
- [ ] Implement: `WORK_SORTS = ["due","priority","created"]`; `isWorkDueSoon(item, now, withinDays=7)`; `compareWorkItems(a,b,sort,now)`
- [ ] Tests PASS; commit: `feat: add work queue due-soon and sort helpers`

---

### Task 2: Wire `/admin/work`

**Files:** Modify `src/app/admin/work/page.tsx`

- [ ] Parse `searchParams.sort` (default `"due"`); sort rows with `compareWorkItems`
- [ ] Sort chip row; status chip hrefs preserve `sort`; Open href preserves non-default sort
- [ ] Row classes: blocked → destructive tint; else due-soon → amber; meta suffix `· blocked` / `· due soon`
- [ ] Keep Edit, Badge, `WorkStatusSelect`
- [ ] Tests + type-check PASS; commit: `feat: sort and emphasize due-soon/blocked work items`

---

### Task 3: Runbook

**Files:** Modify `docs/runbooks/client-ops.md`

- [ ] Document sort chips (due soon default, priority, created), blocked/due-soon emphasis, no assignees/kanban
- [ ] Commit: `docs: document work queue sort and due-soon emphasis`

---

## Test plan

- Unit: all sort/due-soon cases in `client-ops.test.ts`
- Manual: Open excludes done; status+sort URL; due/priority/created order; blocked + due-soon styling
- Create/edit/delete + client Work tab unchanged

## Out of scope

- Assignees/kanban; SQL order change; separate due-soon/blocked filter chips
- Stripe/Umami embeds; asset monitor work

## Commit checkpoints

1. `feat: add work queue due-soon and sort helpers`
2. `feat: sort and emphasize due-soon/blocked work items`
3. `docs: document work queue sort and due-soon emphasis`
