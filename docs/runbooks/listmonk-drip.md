# Listmonk Welcome Drip — Activation Runbook

> **Prerequisite:** Production `LISTMONK_*` env set (`/api/health` → `listmonk: true`).  
> **Copy source:** [`content/emails/welcome-drip.md`](../../content/emails/welcome-drip.md)  
> **Monthly broadcast draft:** [`content/newsletters/first-campaign.md`](../../content/newsletters/first-campaign.md)  
> **Track progress:** `/admin/health#listmonk-drip` (persists)  
> **Cold outbound:** Instantly only — see [`outbound-instantly.md`](./outbound-instantly.md). **Never** import cold CSVs here.

## One-time setup (Listmonk UI)

Open `https://newsletter.nothing.digital` (or `LISTMONK_DASHBOARD_URL`).

### 1. List + double opt-in

1. **Lists** → confirm a **public** list with **double opt-in** on.
2. Open the list → copy **UUID** → match Vercel `LISTMONK_LIST_UUID` (already set if health `listmonk: true`).
3. SMTP: Resend SMTP (or Fastmail) already on the pod — **Settings → SMTP** should show a working profile.

### 2. Import templates

**Campaigns → Templates → Create** (or **Transactional** for opt-in). For each block in `welcome-drip.md`, paste **Subject** + HTML body:

| Template                   | Source section in `welcome-drip.md` |
| -------------------------- | ----------------------------------- |
| Opt-in confirmation        | §1 Double opt-in confirmation       |
| Day 0 — Welcome            | §2 Day 0                            |
| Day 3 — Case study / proof | §3 Day 3                            |
| Day 7 — Soft CTA           | §4 Day 7                            |

Preview each with a test subscriber. Keep `{{ .UnsubscribeURL }}` / `{{ .OptinURL }}` intact.

### 3. Sequence (0 / 3 / 7)

**Campaigns → Create** an automation (or three campaigns linked by delays):

1. **Trigger:** subscription confirmed (post opt-in).
2. **Day 0** → send Welcome template immediately.
3. **Wait 3 days** → send Day 3 template.
4. **Wait 4 days** → send Day 7 template.
5. From: `Nothing.Digital <hello@nothing.digital>`.
6. Enable / start the sequence.

### 4. Live subscribe E2E

1. From `https://nothing.digital` footer (or newsletter form), subscribe with an inbox you control.
2. Confirm: Listmonk **Subscribers** row appears (unconfirmed → confirmed after opt-in click).
3. Confirm: opt-in email + Day 0 after confirm.
4. Open an email → click **Unsubscribe** → status updates in Listmonk (SoT). Admin Supabase unsub is a local mirror only.
5. Tick matching boxes on `/admin/health#listmonk-drip`.

## Kill switch

- Pause the campaign/automation in Listmonk.
- Optional: unset `N8N_WEBHOOK_URL` (contact fan-out only; does not stop Listmonk).

## Cadence after go-live

| Channel           | Cadence   | Source                                                     |
| ----------------- | --------- | ---------------------------------------------------------- |
| Welcome drip      | Automated | `content/emails/welcome-drip.md`                           |
| Monthly broadcast | 1 / month | `content/newsletters/first-campaign.md` (adapt each month) |

## Checklist

Track in admin at `/admin/health#listmonk-drip` or here:

- [x] `listmonk: true` on `/api/health` (2026-08-07)
- [ ] Templates imported and previewed
- [ ] Sequence scheduled (0 / 3 / 7)
- [ ] Live form → Listmonk subscribe verified
- [ ] Unsubscribe link works (Listmonk SoT for campaigns; admin Supabase unsub is local mirror only)
