# Agents — Nothing.Digital

## Read order

1. [`SCRATCHPAD.md`](./SCRATCHPAD.md) — live remaining work (only board)
2. [`AGENTS.md`](./AGENTS.md) — this file
3. [`docs/SYSTEM-MAP.md`](./docs/SYSTEM-MAP.md) — how the system works
4. [`docs/README.md`](./docs/README.md) — doc map
5. Topic runbooks as needed (`docs/runbooks/`)

Longer paste prompt: [`docs/superpowers/HANDOFF-post-launch-ops.md`](./docs/superpowers/HANDOFF-post-launch-ops.md)

## Brand & modules

Brand + module flags live in **`src/brand/`**. Guide: [`docs/client-kit.md`](./docs/client-kit.md).

## Rules

- Do not invent a product roadmap.
- Commit only when asked. Prefer small PRs.
- Archives under `docs/archive/`, `docs/runbooks/archive/`, `plans/archive/` are **historical** — do not execute open boxes there.
- Owner boxes on SCRATCHPAD = human credentials/dashboards; help with steps, don’t claim done.
- When finishing, update only `SCRATCHPAD.md` (+ the relevant topic runbook).

## Shipped vs owner

|                |                                                                                                                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shipped**    | Site + `/admin` CRM, Pack F/H, client kit (`src/brand/`), Umami, Calendly, Listmonk env, Resend transactional (+ day-0 nurture), Instantly CSV hybrid outbound, rule-based lead scoring, AI code (flags may be off). Details: SYSTEM-MAP. |
| **Owner-only** | Instantly account/DNS/warmup, Listmonk drip UI, Bing sitemap, AI Gateway keys, Places/Hunter keys, some migration confirmations — see SCRATCHPAD.                                                                                         |
