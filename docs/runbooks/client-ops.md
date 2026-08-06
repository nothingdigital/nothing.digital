# Client Ops Runbook

Admin-only CRM for Nothing.Digital clients, billing, managed assets, and work queue.

**Routes:** `/admin/clients` · `/admin/billing` · `/admin/work`  
**Auth:** Supabase magic link + `ADMIN_EMAILS` (same as Pack F).  
**Migration:** `supabase/migrations/002_client_ops.sql` — apply in Supabase SQL editor or CLI before first use.

Empty Billing/Work lists are expected until you create clients and items — there is no seed data.

## Day-to-day

1. **New client** → `/admin/clients/new` → set status (`lead`/`active`/…) and billing model.
2. **Invoice** → `/admin/billing` → New invoice (pick client) **or** client detail → Billing → New invoice → set status `draft`/`sent`; mark `paid` when money lands; set `void` to cancel (no delete).
3. **Asset** → client detail → Assets → add website/app/domain you manage (URL optional).
4. **Work** → `/admin/work` Add work (pick client) **or** client detail → Work; use global `/admin/work` for open items across clients (Open excludes `done`).

## First invoice checklist

1. Confirm migration `002_client_ops.sql` is applied and admin env is set.
2. Create a client at `/admin/clients/new` if none exists.
3. Open `/admin/billing` → **New invoice** → pick client (or open the client → Billing → New invoice).
4. Fill number/title/amount; start as `draft` or `sent`; optional `external_url` for PDF/payment link.
5. When paid, set status to `paid`. To cancel, set status to `void` (invoices are never hard-deleted). Edit anytime via **Edit** on the list.

## First work item checklist

1. Create a client if needed.
2. On `/admin/work`, use **Add work** (pick client) or open the client → Work tab.
3. Confirm the item appears on Open (default Open filter hides `done`).
4. Change status from the list dropdown, or open **Edit** to change fields / delete permanently.

## Billing rules (v1)

- Manual status only — no Stripe Checkout, no client portal.
- Overdue is **computed on read** when `due_at` is past and status is not `paid`/`void`.
- `external_url` can hold a PDF or future payment-link URL.
- Cancel = set status to `void` (no hard delete).

## Deferred

| Item                                  | When                                |
| ------------------------------------- | ----------------------------------- |
| UptimeRobot/Kuma monitor id on assets | You regularly monitor client URLs   |
| IT device/network inventory           | IT retainers exist                  |
| Client login portal                   | Never until clients need self-serve |

## Ops gate

If Supabase is not configured or migration is missing, admin lists show an error string — fix env / run `002_client_ops.sql`.
