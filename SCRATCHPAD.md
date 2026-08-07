# Live board — Nothing.Digital

> **Single remaining-work board.** How the system works: [`docs/SYSTEM-MAP.md`](./docs/SYSTEM-MAP.md). Topic how-tos: `docs/runbooks/`. Index: [`docs/README.md`](./docs/README.md).  
> Updated: 2026-08-07

## Owner (you)

- [ ] Bing: submit sitemap → [`ops-credentials.md` §4](./docs/runbooks/ops-credentials.md)
- [ ] Confirm migration `004_profiles.sql` → [§7](./docs/runbooks/ops-credentials.md)
- [ ] Newsletter subscribe E2E (live form → Listmonk)
- [ ] Listmonk welcome drip UI → [`listmonk-drip.md`](./docs/runbooks/listmonk-drip.md)
- [ ] Optional: AI Gateway env + follow-on flags → [§9](./docs/runbooks/ops-credentials.md)
- [ ] Apply migration `007_lead_personalization.sql` (before outbound personalization)
- [ ] Week-1 glances → [`post-launch-monitoring.md`](./docs/runbooks/post-launch-monitoring.md)

## Agent (done this wave)

- [x] A11y: cookie focus + mobile menu trap
- [x] Lighthouse CI fix + local verify
- [x] Security smoke → [`runbooks/archive/security-smoke-2026-08-07.md`](./docs/runbooks/archive/security-smoke-2026-08-07.md)
- [x] Docs consolidate (this board + archives)
- [x] AI follow-ons (ops brief · invoice cover HITL · outbound personalization) + review fixes  
      **Uncommitted** — flags: `AI_OPS_BRIEF_ENABLED` · `AI_INVOICE_COVER_ENABLED` · `AI_OUTBOUND_PERSONALIZATION_ENABLED` (+ `AI_GATEWAY_API_KEY`)  
      Plans: [`docs/superpowers/plans/2026-08-07-ai-followons-README.md`](./docs/superpowers/plans/2026-08-07-ai-followons-README.md)

## Shipped (don’t re-open)

PRs #7–#10 on `main` · AI code on `main` (env pending) · GSC verified + sitemap · migration `003` · Listmonk `true` · Umami / Calendly / Pack F+H admin

## Deferred (YAGNI)

n8n · Kuma · Shlink · secretary Phase B · Instantly cold outbound (until pilot)

## Pointers

| Topic            | Doc                                           |
| ---------------- | --------------------------------------------- |
| System map       | `docs/SYSTEM-MAP.md`                          |
| Credentials      | `docs/runbooks/ops-credentials.md`            |
| Drip             | `docs/runbooks/listmonk-drip.md`              |
| Cadence          | `docs/runbooks/post-launch-monitoring.md`     |
| Agent paste      | `docs/superpowers/HANDOFF-post-launch-ops.md` |
| Master narrative | `plans/00-master-document.md` (historical)    |
