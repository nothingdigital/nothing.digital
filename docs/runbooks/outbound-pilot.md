# Outbound Pilot — Northport, AL

> **Goal:** ≥50 scored candidates · ≥20 enriched emails imported after review · bounce &lt;5% · ≥1 positive reply or booked call.  
> **Stack:** Places + lead-finder → Instantly. Listmonk stays warm-only ([`listmonk-drip.md`](./listmonk-drip.md)).  
> **Setup:** [`outbound-instantly.md`](./outbound-instantly.md) · **Copy:** [`content/emails/northport-cold-sequence.md`](../../content/emails/northport-cold-sequence.md)

## Preflight

- [ ] Instantly domain SPF/DKIM/DMARC green; warmup ≥14 days
- [ ] `GOOGLE_PLACES_API_KEY` set; optional `HUNTER_API_KEY`
- [ ] `data/lead-finder/do-not-contact.csv` current
- [ ] Confirmed Listmonk will **not** receive this CSV

## Run discovery

```bash
# Sanity
pnpm lead-finder --fixture

# Live — all verticals (trades, pro, hospitality)
pnpm lead-finder --min-score=0

# Optional: AI re-rank top N (fit score + reason + Instantly one-liner)
# Needs AI_GATEWAY_API_KEY. Does not send mail — CSV only.
AI_GATEWAY_API_KEY=... pnpm lead-finder --ai-rank --ai-limit=40
```

`--ai-rank` adds `aiScore`, `aiReason`, `personalization` columns. Admin import prefers `aiScore` for sort and stores personalization for HITL Instantly export.
Outputs land in `data/lead-finder/out/`:

| File                              | Use                                  |
| --------------------------------- | ------------------------------------ |
| `northport-leads-YYYY-MM-DD.csv`  | Full human review                    |
| `instantly-import-YYYY-MM-DD.csv` | Import **after** review + enrichment |

## Human review (admin)

Prefer `/admin/outbound`:

1. Upload `northport-leads-*.csv` (full lead-finder export).
2. Approve / reject / suppress rows; edit missing emails inline.
3. Download Instantly CSV from the Send section (approved + email only).
4. Import into Instantly; sync `do-not-contact.csv` / admin Suppress into Instantly’s global block list.
5. On Home Today, expand the weekly outbound loop → **Log handoff** with the import count.

### Manual spreadsheet fallback

Sort `northport-leads-*.csv` by `score` descending. For each high-intent row (suggest score ≥30):

1. Open Google listing / website; confirm still local and relevant.
2. Drop chains, closed businesses, and anyone already a client.
3. Fill missing `email` via Hunter/Apollo/manual (or leave blank → call/SMS later).
4. Add junk/opt-outs to `do-not-contact.csv`.
5. Copy approved rows into Instantly import CSV (or re-run lead-finder after enrichment file merge).

**Pilot targets**

| Metric                 | Target                                        |
| ---------------------- | --------------------------------------------- |
| Scored candidates      | ≥50                                           |
| Reviewed + email-ready | ≥20                                           |
| Daily send / inbox     | 20–40                                         |
| Bounce rate            | &lt;5%                                        |
| Spam complaints        | ~0                                            |
| Success signal         | ≥1 positive reply or Calendly/contact booking |

## Enrichment tips

- Prefer business role emails (`info@`, owner name@domain) over personal Gmail.
- If no email: queue for Google Business message or phone — do not guess random `@gmail.com`.
- Re-check suppression before import.

## Launch sequence

1. Import reviewed Instantly CSV.
2. Attach 3-step campaign from `northport-cold-sequence.md`.
3. Verify unsubscribe + physical address footer.
4. Start with one vertical pack if volume feels high; expand after 1 week of clean metrics.

## Tracking (weekly)

| Date | Sent | Bounces | Replies (+) | Replies (−) | Booked | Notes |
| ---- | ---- | ------- | ----------- | ----------- | ------ | ----- |
|      |      |         |             |             |        |       |

Pause if bounce ≥5% or any complaint spike. Log opt-outs into `do-not-contact.csv` same day.

## Fixture dry-run (no API keys)

```bash
pnpm lead-finder --fixture
pnpm test -- scripts/lead-finder/scorer.test.ts
```

Use fixture output only to validate CSV shape — never send fixture emails.
