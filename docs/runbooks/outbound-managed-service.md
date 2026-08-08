# Managed Local Outreach — Service Playbook / SOW

> **Status:** Offer after Northport pilot proves deliverability + ≥1 qualified conversation.  
> **Product shape:** Managed service (ops), **not** self-serve SaaS on nothing.digital.  
> **Pricing anchor:** Email marketing line on `/pricing` ($1.5K–$5K/mo) — adjust SOW to scope.

## What clients buy

You run discovery + scoring + cold sequences (and optional warm Listmonk for **their** opt-in list) for a niche + geo they choose. They get weekly reply/lead reports and booked calls handed off to their calendar — or yours if white-label.

## What you do not sell

- A public “scrape anyone” product UI
- Guaranteed inbox placement or guaranteed meetings
- Importing purchased consumer email dumps
- Cold lists dumped into the client’s marketing newsletter tool without a separate cold platform

## Standard package (monthly)

| Item              | Included                                                     |
| ----------------- | ------------------------------------------------------------ |
| Geo + niche setup | 1 metro (or radius) · up to 3 vertical packs                 |
| Lead finder runs  | Up to 2 Places pulls / month · scored CSV                    |
| Human review      | You filter top N before send                                 |
| Sending           | Instantly workspace (yours or client’s) · 1–2 warmed inboxes |
| Sequence          | 3-step copy localized to their city/brand                    |
| Reporting         | Weekly: sent, bounces, replies, meetings booked              |
| Suppression       | Shared do-not-contact hygiene                                |

**Add-ons:** extra metros, Hunter/Apollo enrichment credits, landing page / offer rewrite, warm Listmonk drip setup (opt-in only).

## SOW blurb (paste into proposals)

```text
Managed Local Outreach — Month-to-month

Nothing.Digital will identify local businesses in [GEO] matching [VERTICALS]
using Google Places and a website-quality score, then run a human-reviewed
cold email sequence via a dedicated outbound platform (not the client’s
newsletter list).

Includes: up to two discovery runs per month, suppression list maintenance,
a three-step sequence, daily send caps aligned with deliverability best
practices, and a weekly metrics summary (sends, bounces, replies, meetings).

Client provides: brand voice notes, booking link, physical address for
CAN-SPAM footer, and approval of final copy before first send.

Exclusions: guaranteed meetings, purchased consumer lists, EU/GDPR cold
outreach without separate legal review, and self-serve access to scraping tools.

Fee: $[X]/month · [Y]-day cancel · kickoff after sending-domain warmup ready.
```

## Internal delivery checklist

1. Kickoff: geo, verticals, offer, Calendly/contact URL, postal address.
2. Stand up Instantly (or client workspace) per [`outbound-instantly.md`](./outbound-instantly.md).
3. Configure lead-finder queries (fork Northport categories in `scripts/lead-finder/categories.ts` or pass custom text queries later).
4. Run → review → enrich → import → launch.
5. Weekly report email; move positive replies to client CRM / Calendly.
6. Opt-outs → suppression CSV same day.

## Tooling reuse

| Asset             | Path                                                                |
| ----------------- | ------------------------------------------------------------------- |
| Lead finder       | `scripts/lead-finder/`                                              |
| Instantly runbook | `docs/runbooks/outbound-instantly.md`                               |
| Pilot checklist   | `docs/runbooks/outbound-pilot.md`                                   |
| Sequence template | `content/emails/northport-cold-sequence.md` (clone per client/city) |

## Kill criteria for a client engagement

Pause or cancel if bounce ≥5%, complaint spike, or client asks to blast unreviewed lists. Do not “rescue” with Listmonk cold imports.
