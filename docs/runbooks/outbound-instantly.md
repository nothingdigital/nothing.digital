# Instantly Cold Outbound — Setup Runbook

> **Scope:** Cold B2B sequences only. **Never** import cold lists into Listmonk.  
> **Warm/opt-in:** [`listmonk-drip.md`](./listmonk-drip.md) + [`content/emails/welcome-drip.md`](../../content/emails/welcome-drip.md)  
> **Lead CSV:** `pnpm lead-finder` → see [`outbound-pilot.md`](./outbound-pilot.md)

## Why Instantly (not Listmonk / Resend)

| Tool                         | Use                                                |
| ---------------------------- | -------------------------------------------------- |
| **Instantly** (or Smartlead) | Cold sequences, inbox warmup, per-inbox daily caps |
| **Listmonk**                 | Double opt-in newsletter + drips only              |
| **Resend**                   | Transactional (contact confirm, admin notify)      |

Mixing cold prospects into Listmonk burns reputation and mixes legal bases.

## One-time account setup

1. Create Instantly workspace for Nothing.Digital (or client workspace later).
2. Add **sending inboxes** (Google Workspace or Microsoft 365 preferred). Start with 1–2 inboxes.
3. Use a **dedicated sending domain or subdomain**, e.g. `mail.nothing.digital` or a separate brand domain — **not** the primary Resend transactional identity if cold volume grows.
4. In DNS for the sending domain, add Instantly’s records:
   - **SPF** — include Instantly’s SPF (keep a single SPF TXT; merge includes).
   - **DKIM** — Instantly CNAME/TXT as shown in their UI.
   - **DMARC** — start with `v=DMARC1; p=none; rua=mailto:dmarc@nothing.digital` then tighten after warmup.
5. Verify domain + inbox in Instantly until all checks pass.
6. Enable **warmup** 2–3 weeks before real sends. Target healthy warmup scores before pilot launch.
7. Cap early sends: **~20–40 emails/day/inbox**; raise slowly after bounce &lt;5% and near-zero complaints.

## Suppression / do-not-contact

1. Keep [`data/lead-finder/do-not-contact.csv`](../../data/lead-finder/do-not-contact.csv) as the repo source of truth for emails/domains that opted out or bounced hard.
2. Before every Instantly import, run lead-finder (it skips suppressed rows) and also upload the same list into Instantly’s **global block / unsubscribe** list.
3. Honor Instantly’s unsubscribe link in every sequence (CAN-SPAM). Add physical mailing address in the footer.
4. When someone replies “stop” / “unsubscribe”, add their email to `do-not-contact.csv` the same day.

Example `do-not-contact.csv`:

```csv
email_or_domain,reason,added_at
optout@example.com,unsubscribed,2026-08-06
competitor.com,manual-block,2026-08-06
```

## Sequence import

1. Copy copy from [`content/emails/northport-cold-sequence.md`](../../content/emails/northport-cold-sequence.md).
2. Create a 3-step campaign in Instantly (Day 0 / +3 / +7).
3. CTA = free scoping call → `https://nothing.digital/contact` or Calendly.
4. Import only **human-reviewed** CSV rows with an email (see pilot runbook).

## Deliverability checklist

- [ ] Sending domain SPF/DKIM/DMARC pass in Instantly
- [ ] Warmup running ≥14 days (ideally 21)
- [ ] Daily cap set (20–40/inbox to start)
- [ ] CAN-SPAM footer: identity, physical address, unsubscribe
- [ ] Suppression list synced from `do-not-contact.csv`
- [ ] Listmonk confirmed **empty of** any cold CSV imports
- [ ] Resend domain left for transactional only

## Kill switch

- Pause campaign in Instantly.
- Disable warmup only if shutting down the inbox entirely.
- Do **not** “fix” deliverability by blasting from Listmonk or Resend.

## Smartlead alternative

Same playbook: dedicated domain, warmup, suppression, 3-step sequence, human-reviewed CSV. Swap product UI; keep lead-finder CSV columns stable (`email`, `companyName`, `website`, `phone`, `city`, `score`, `reasons`).
