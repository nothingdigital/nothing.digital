# Admin follow-up plans (2026-08-06)

Index of implementation plans for the next Pack F/H admin polish wave. Each plan is self-contained and can be executed independently with **subagent-driven-development** or **executing-plans**.

**Recommended order** (dependency / value):

| #   | Plan                                   | Path                                                                                         | Effort                |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------- |
| 1   | Ops glance home (`/admin` counts)      | [2026-08-06-admin-ops-glance-home.md](./2026-08-06-admin-ops-glance-home.md)                 | S                     |
| 2   | Inbox → create client from lead        | [2026-08-06-inbox-create-client-from-lead.md](./2026-08-06-inbox-create-client-from-lead.md) | S                     |
| 3   | Newsletter CSV + unsubscribe           | [2026-08-06-newsletter-polish.md](./2026-08-06-newsletter-polish.md)                         | S                     |
| 4   | Work queue due-soon / sort             | [2026-08-06-work-queue-polish.md](./2026-08-06-work-queue-polish.md)                         | S                     |
| 5   | Health status chips + UptimeRobot link | [2026-08-06-health-status-chips.md](./2026-08-06-health-status-chips.md)                     | S                     |
| 6   | Asset edit + `monitor_url`             | [2026-08-06-asset-edit-monitor-link.md](./2026-08-06-asset-edit-monitor-link.md)             | S–M (needs migration) |

**Handoff for the next agent:** [../HANDOFF-admin-followups.md](../HANDOFF-admin-followups.md)

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
| [plans/05-pikapods-integrations.md](../../../plans/05-pikapods-integrations.md) | Pack F/H status, launcher-only rule       |
| [plans/00-master-document.md](../../../plans/00-master-document.md)             | Master roadmap                            |
