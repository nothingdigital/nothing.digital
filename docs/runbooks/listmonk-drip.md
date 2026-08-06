# Listmonk Welcome Drip — Activation Runbook

> **Prerequisite:** Production `LISTMONK_*` env set (`/api/health` → `listmonk: true`).  
> **Copy source:** [`content/emails/welcome-drip.md`](../../content/emails/welcome-drip.md)  
> **Monthly broadcast draft:** [`content/newsletters/first-campaign.md`](../../content/newsletters/first-campaign.md)

## One-time setup

1. Open Listmonk at `https://newsletter.nothing.digital` (or `LISTMONK_DASHBOARD_URL`).
2. Confirm a **double opt-in** public list exists; copy its UUID into Vercel `LISTMONK_LIST_UUID` if not already set.
3. SMTP: use Resend SMTP (or existing Fastmail) already wired on the pod.
4. Import templates from `welcome-drip.md`:
   - Day 0 — Welcome + confirm (transactional / opt-in if separate)
   - Day 3 — Case study / proof → link `/portfolio`
   - Day 7 — Soft CTA → `/contact` or Calendly
5. Create an automation / campaign sequence: Day 0 → wait 3d → Day 3 → wait 4d → Day 7.
6. Send yourself a test subscribe from `https://nothing.digital` newsletter form.
7. Confirm: Listmonk subscriber row + confirmation email + Day 0 after opt-in.

## Kill switch

- Pause the campaign/automation in Listmonk.
- Optional: unset `N8N_WEBHOOK_URL` (contact fan-out only; does not stop Listmonk).

## Cadence after go-live

| Channel           | Cadence   | Source                                                     |
| ----------------- | --------- | ---------------------------------------------------------- |
| Welcome drip      | Automated | `content/emails/welcome-drip.md`                           |
| Monthly broadcast | 1 / month | `content/newsletters/first-campaign.md` (adapt each month) |

## Checklist

- [ ] `listmonk: true` on `/api/health`
- [ ] Templates imported and previewed
- [ ] Sequence scheduled (0 / 3 / 7)
- [ ] Live form → Listmonk subscribe verified
- [ ] Unsubscribe link works (Listmonk SoT for campaigns; admin Supabase unsub is local mirror only)
