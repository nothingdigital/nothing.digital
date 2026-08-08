# Client Ops Runbook

Admin-only CRM for Nothing.Digital clients, billing, managed assets, and work queue.

**Routes:** `/admin` · `/admin/clients` · `/admin/billing` · `/admin/work` · `/admin/outbound`  
**Auth:** Supabase password, Google OAuth, or magic link + `ADMIN_EMAILS` allowlist (same gate as Pack F).

Apply migration `005_admin_loops.sql` once for Today loops, checklists, and outbound review tables.

### Admin sign-in setup (one-time)

1. **Supabase → Authentication → Providers**
   - Email: enable (password + magic link).
   - Google (optional): enable; paste Google Cloud OAuth Client ID/Secret; authorized redirect `https://<project-ref>.supabase.co/auth/v1/callback`.
2. **URL config:** Site URL + redirect allowlist include `https://nothing.digital/auth/callback` and `http://localhost:3000/auth/callback`.
3. **Password users:** Authentication → Users → your admin email → set password (or create user with password). Email must be in `ADMIN_EMAILS`.
4. **Employees later:** add their email to `ADMIN_EMAILS` (Vercel env), create/invite the user in Supabase Auth, have them set a password or use Google with that same email.

Empty Billing/Work lists are expected until you create clients and items — there is no seed data.

## Day-to-day

1. **Today** → `/admin` — open loops (inbox, overdue invoices, blocked/due work, weekly outbound, Listmonk setup). Cap of three visible; mark done / snooze / undo. Glance counts stay below.
2. **New client** → `/admin/clients/new` → set status (`lead`/`active`/…) and billing model.
3. **Invoice** → `/admin/billing` → New invoice (pick client) **or** client detail → Billing → New invoice → set status `draft`/`sent`; mark `paid` when money lands; set `void` to cancel (no delete).
4. **Asset** → client detail → Assets → add website/app/domain you manage (URL optional; optional **Monitor URL** for an UptimeRobot/Kuma status page). Edit via **Edit** on the list. Retire via status (no hard delete). Apply migration `003_asset_monitor_url.sql` once for `monitor_url`.
5. **Work** → `/admin/work` Add work (pick client) **or** client detail → Work; use global `/admin/work` for open items across clients (Open excludes `done`).
   - **Sort chips** (`?sort=`): `due` (default — earliest due first, nulls last), `priority` (high → med → low), `created` (newest first). Status chips preserve the current sort; Open preserves non-default sort.
   - **Emphasis:** `blocked` rows get a destructive tint + `· blocked` meta; otherwise items due within 7 days (or overdue) get an amber tint + `· due soon`.
   - No assignees or kanban in v1 — status chips + sort only.
6. **Outbound** → `/admin/outbound` — after `pnpm lead-finder`, upload CSV, approve/reject/suppress, download Instantly CSV. See [`outbound-pilot.md`](./outbound-pilot.md).
7. **Listmonk drip checklist** → `/admin/health#listmonk-drip` when Listmonk env is configured.

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
5. Use sort chips (`due` / `priority` / `created`) to reorder; blocked and due-soon rows are visually emphasized.

## Billing rules (v1)

- Manual status only — no Stripe Checkout.
- Overdue is **computed on read** when `due_at` is past and status is not `paid`/`void`.
- `external_url` can hold a PDF or payment-link URL; generated PDFs live in Supabase Storage (`storage_path` + `view_token`).
- Marking an invoice `sent` generates a PDF (if needed), emails the client via Resend once (`sent_emailed_at`), and links to `/v/{token}`.
- Cancel = set status to `void` (no hard delete).
- Client portal: `/portal` — clients sign in with `primary_email`; view-only invoices + documents.
- Documents: client detail **Files** tab (upload PDF / external URL → `/v/{token}`).
- Apply migration `006_pdf_documents.sql` (invoice PDF columns, `documents` table, Storage buckets).

## Deferred

| Item                        | When               |
| --------------------------- | ------------------ |
| IT device/network inventory | IT retainers exist |

## Ops gate

If Supabase is not configured or migration is missing, admin lists show an error string — fix env / run `002_client_ops.sql` (and `003_asset_monitor_url.sql` for Monitor URL; `004_profiles.sql` for secretary roles; `005_admin_loops.sql` for Today / Outbound / checklists; `006_pdf_documents.sql` for invoice PDFs + documents).

## Secretary roles (Phase B on hire)

- Create profile with `app_role` 'staff' or 'owner' (magic link login via ADMIN_EMAILS or profiles table).
- RLS on all tables uses `is_staff()` for authenticated staff access (view/manage clients, work, invoices, assets, submissions).
- Owner role can manage profiles (invite staff).
- Least-privilege: staff cannot delete/export/settings.
- Test with staff account: login, lists work, no admin settings.
- Run `004_profiles.sql` first. Update on hire day.

ponytail: min RLS + profiles; full CRM Phase C on volume.
