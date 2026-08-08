# Handoff — Post-launch ops

> **Canonical short entry:** [`/AGENTS.md`](../../AGENTS.md)

Copy below the line into a new agent chat.

**Do not** invent a new product roadmap. **Do not** start n8n / Kuma / Shlink / secretary / Stripe unless the user expands scope.

---

## Prompt

You are continuing **Nothing.Digital** at `/Users/DeSchroyer/workspace/nothingdigital`.

### Read first (in order)

1. [`SCRATCHPAD.md`](../../SCRATCHPAD.md) — live remaining work (only board)
2. [`AGENTS.md`](../../AGENTS.md) — short agent entry
3. [`docs/SYSTEM-MAP.md`](../SYSTEM-MAP.md) — how the system works (client, admin, integrations)
4. [`docs/README.md`](../README.md) — doc map
5. [`docs/runbooks/ops-credentials.md`](../runbooks/ops-credentials.md) — owner dashboard steps
6. Topic runbooks only as needed: `listmonk-drip.md`, `post-launch-monitoring.md`, `client-ops.md`

### Rules

- Owner boxes on SCRATCHPAD = human credentials/dashboards. Help with steps/docs; don’t claim they’re done.
- Agent work = code/tests/docs the user asks for. Prefer small PRs; commit only when asked.
- Historical plans/checklists live under `docs/archive/`, `docs/runbooks/archive/`, `plans/archive/` — **do not execute open boxes there**.
- Admin plans 1–6 and site polish #7–#10 are **shipped on `main`**. Do not re-implement. Legacy handoff: [`docs/archive/HANDOFF-admin-followups.md`](../archive/HANDOFF-admin-followups.md).

### When finishing

Update **only** `SCRATCHPAD.md` (and the relevant topic runbook). Do not fork a second “next steps” checklist.
