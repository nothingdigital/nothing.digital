# Client Ops Runbook

Admin-only CRM for Nothing.Digital clients, billing, managed assets, and work queue.

**Routes:** `/admin/clients` · `/admin/billing` · `/admin/work`  
**Auth:** Supabase magic link + `ADMIN_EMAILS` (same as Pack F).  
**Migration:** `supabase/migrations/002_client_ops.sql` — apply in Supabase SQL editor or CLI before first use.

## Day-to-day

1. **New client** → `/admin/clients/new` → set status (`lead`/`active`/…) and billing model.
2. **Invoice** → client detail → Billing → New invoice → set status `draft`/`sent`; mark `paid` when money lands.
3. **Asset** → client detail → Assets → add website/app/domain you manage (URL optional).
4. **Work** → client detail → Work, or global `/admin/work` for open items across clients.

## Billing rules (v1)

- Manual status only — no Stripe Checkout, no client portal.
- Overdue is **computed on read** when `due_at` is past and status is not `paid`/`void`.
- `external_url` can hold a PDF or future payment-link URL.

## Deferred

| Item                                  | When                                |
| ------------------------------------- | ----------------------------------- |
| UptimeRobot/Kuma monitor id on assets | You regularly monitor client URLs   |
| IT device/network inventory           | IT retainers exist                  |
| Client login portal                   | Never until clients need self-serve |

## Ops gate

If Supabase is not configured or migration is missing, admin lists show an error string — fix env / run `002_client_ops.sql`.
