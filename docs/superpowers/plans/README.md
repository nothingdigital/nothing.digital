# Admin follow-up plans (2026-08-06)

Index of implementation plans for the Pack F/H admin polish wave.

> **Status:** **Implemented on** `feat/admin-followups-wave` (2026-08-06).  
> **Next wave handoff:** [../HANDOFF-post-launch-ops.md](../HANDOFF-post-launch-ops.md)  
> **Legacy handoff:** [../HANDOFF-admin-followups.md](../HANDOFF-admin-followups.md)

**Recommended order** (dependency / value) — historical:

| #   | Plan                                   | Path                                                                                         | Effort                | Status on feature branch         |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------- | -------------------------------- |
| 1   | Ops glance home (`/admin` counts)      | [2026-08-06-admin-ops-glance-home.md](./2026-08-06-admin-ops-glance-home.md)                 | S                     | ✅                               |
| 2   | Inbox → create client from lead        | [2026-08-06-inbox-create-client-from-lead.md](./2026-08-06-inbox-create-client-from-lead.md) | S                     | ✅                               |
| 3   | Newsletter CSV + unsubscribe           | [2026-08-06-newsletter-polish.md](./2026-08-06-newsletter-polish.md)                         | S                     | ✅                               |
| 4   | Work queue due-soon / sort             | [2026-08-06-work-queue-polish.md](./2026-08-06-work-queue-polish.md)                         | S                     | ✅                               |
| 5   | Health status chips + UptimeRobot link | [2026-08-06-health-status-chips.md](./2026-08-06-health-status-chips.md)                     | S                     | ✅                               |
| 6   | Asset edit + `monitor_url`             | [2026-08-06-asset-edit-monitor-link.md](./2026-08-06-asset-edit-monitor-link.md)             | S–M (needs migration) | ✅ code; apply `003` on Supabase |

## Hard rules (all plans)

- No Umami chart rebuilds / no iframes for Listmonk, n8n, Kuma
- No Stripe / client portal / secretary roles in this wave
- Full external dashboards stay deep-link **Open** targets
- Prefer TDD for pure helpers; frequent conventional commits

## Related documentation

| Doc                                                                             | Why                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------- |
| [docs/runbooks/client-ops.md](../../runbooks/client-ops.md)                     | Clients, billing, assets, work day-to-day |
| [docs/runbooks/monitoring.md](../../runbooks/monitoring.md)                     | UptimeRobot, health, Search Console       |
| [docs/runbooks/ops-credentials.md](../../runbooks/ops-credentials.md)           | Credential-only production checklist      |
| [plans/05-pikapods-integrations.md](../../../plans/05-pikapods-integrations.md) | Pack F/H status, launcher-only rule       |
| [plans/00-master-document.md](../../../plans/00-master-document.md)             | Master roadmap                            |
