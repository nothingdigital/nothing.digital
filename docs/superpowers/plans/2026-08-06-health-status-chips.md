# Health Status Chips (API-Pull Lite) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/admin/health` from a single ok/fail label into env-presence status chips from `/api/health`’s `integrations` object, plus an UptimeRobot launcher link — without reimplementing Umami charts or iframe-ing Listmonk/n8n/Kuma.

**Architecture:** `/api/health` remains SoT for integration flags (env-presence only). Parse JSON; render chips inline on the Health page. Dashboards stay `Open` deep-links via `getAdminToolLinks()`. Add `UPTIMEROBOT_DASHBOARD_URL` like `KUMA_DASHBOARD_URL`. Do not change `/api/health` route for v1.

**Tech Stack:** Next.js App Router RSC, existing `Badge`, Vitest, Zod-backed `src/lib/env.ts`.

---

## Locked decisions

- No charts/iframes; launcher-only Open links
- Chips = `integrations` booleans (configured ≠ live uptime)
- UptimeRobot = optional `*_DASHBOARD_URL` only (no API key)

---

## File map

| File                                      | Responsibility                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| Create: `src/lib/admin/health.ts`         | Parse payload; labels; chip tone                                             |
| Create: `src/lib/admin/health.test.ts`    | Parse valid/malformed; key coverage                                          |
| Modify: `src/app/admin/health/page.tsx`   | Fetch JSON; **inline chips JSX** + tool links (no extracted chip components) |
| Modify: `src/lib/env.ts`                  | Optional `UPTIMEROBOT_DASHBOARD_URL`                                         |
| Modify: `src/lib/admin/config.ts`         | `uptimerobot` on `getAdminToolLinks()`                                       |
| Modify: `src/lib/admin/config.test.ts`    | Assert uptimerobot when env set                                              |
| Modify: `src/app/admin/settings/page.tsx` | Registry row for env                                                         |
| Modify: `.env.example`                    | Document URL                                                                 |
| Modify: `docs/runbooks/monitoring.md`     | Admin launcher note                                                          |
| `src/app/api/health/route.ts`             | **Do not change**                                                            |

**Reuse:** `Badge`, `getAdminToolLinks()`, existing health fetch (`cache: "no-store"`). Keys: supabase, resend, sentry, umami, calendly, listmonk.

---

### Task 1: Parse helpers (TDD)

**Files:** Create `health.ts` + `health.test.ts`

- [ ] Failing tests: valid body → integrations; null/malformed → `ok: false`; every `HEALTH_INTEGRATION_KEYS` has label; tone ok/missing
- [ ] Implement `parseHealthPayload`, `labelForIntegration`, `chipToneForConfigured`
- [ ] Tests PASS; commit: `feat(admin): add health payload parse helpers for status chips`

---

### Task 2: UptimeRobot env + tool links

**Files:** `env.ts`, `config.ts`, `config.test.ts`, `.env.example`

- [ ] Failing tests: `tools.uptimerobot` when URL set; omitted when unset
- [ ] Wire optional URL in env + `getAdminToolLinks`; document in `.env.example`
- [ ] Tests PASS; commit: `feat(admin): add UPTIMEROBOT_DASHBOARD_URL launcher env`

---

### Task 3: Rewire `/admin/health` (inline chips)

**Files:** Modify `src/app/admin/health/page.tsx` only — **inline chips JSX in health/page.tsx**; do **not** extract `health-integration-chips` or `health-tool-link-list` components

- [ ] Fetch `/api/health`; `parseHealthPayload`; show Integrations section as inline `Badge` map over keys (configured/missing)
- [ ] Tools list inline: API health note + Open/— for umami, listmonk, n8n, uptimerobot, kuma, calendly, vercel, sentry
- [ ] Copy: env-presence chips; no reimplemented charts
- [ ] Type-check PASS; commit: `feat(admin): surface /api/health integrations as status chips`

---

### Task 4: Settings + runbook

**Files:** `settings/page.tsx`, `docs/runbooks/monitoring.md`

- [ ] Settings row `UPTIMEROBOT_DASHBOARD_URL`
- [ ] Monitoring runbook: admin launcher env; deep-link only (no API key)
- [ ] Commit: `docs(admin): register UptimeRobot dashboard URL on settings + runbook`

---

### Task 5: Verify

- [ ] `vitest run` health + config + `/api/health` route tests — PASS
- [ ] Manual: six chips match API; tools Open/—; set UptimeRobot env → Open; no charts/iframes

---

## Test plan

- Unit: parse + tool links; existing `/api/health` still green
- Manual: chips when fetch ok; graceful when unreachable; UptimeRobot on/off
- No charts, iframes, live probes, Umami API

## Out of scope

- Umami charts/embeds; iframes for any tool
- UptimeRobot/Umami APIs; probing remotes in `/api/health`
- Adding n8n/kuma into `integrations`; client portal; polling refresh

## Commit checkpoints

1. `feat(admin): add health payload parse helpers for status chips`
2. `feat(admin): add UPTIMEROBOT_DASHBOARD_URL launcher env`
3. `feat(admin): surface /api/health integrations as status chips`
4. `docs(admin): register UptimeRobot dashboard URL on settings + runbook`
