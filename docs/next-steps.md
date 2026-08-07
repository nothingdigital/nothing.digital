# Next steps

> **Superseded as a live board.** Use [`../SCRATCHPAD.md`](../SCRATCHPAD.md).  
> Index: [`README.md`](./README.md).

## Owner remaining

See SCRATCHPAD + [`runbooks/ops-credentials.md`](./runbooks/ops-credentials.md).

## Deferred — secretary Phase B (on hire only)

Do not start without an explicit hire. Outline:

1. Confirm `004_profiles.sql` on production.
2. RLS: clients / invoices / assets / work_items / contact_submissions → `is_staff()`.
3. Magic-link auth allows `profiles.app_role = 'staff'`.
4. Settings: invite staff (create profile + magic link).
5. Runbook section in [`runbooks/client-ops.md`](./runbooks/client-ops.md).

## Don’t reinvent

- A11y procedure: [`runbooks/a11y-manual.md`](./runbooks/a11y-manual.md) · last pass: [`runbooks/archive/a11y-manual-pass.md`](./runbooks/archive/a11y-manual-pass.md)
- LHCI: `lighthouserc.json` + `.github/workflows/pr-validation.yml` (verified 2026-08-07)
- Growth triage: [`growth-tactics.md`](./growth-tactics.md)
- Phase checklists: [`../plans/archive/`](../plans/archive/) (historical)
