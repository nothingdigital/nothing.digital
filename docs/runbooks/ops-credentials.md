# Ops Credentials Checklist — Nothing.Digital

> **Verified live:** 2026-08-06 via `https://nothing.digital/api/health` + public DNS.  
> **Owner:** DevOps. Items marked **Dashboard** need human credentials; code/runbooks are ready.

## Live verification (2026-08-07)

| Check                                                   | Result                                                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `/api/health`                                           | `status: ok`                                                                                                  |
| `supabase` / `resend` / `sentry` / `umami` / `calendly` | `true`                                                                                                        |
| `listmonk`                                              | **`true`**                                                                                                    |
| Sitemap                                                 | `https://nothing.digital/sitemap.xml` → 200                                                                   |
| Google Search Console TXT                               | Present on `@` — done                                                                                         |
| SPF TXT                                                 | Prefer single record with `include:_spf.resend.com` — **remove duplicate** Fastmail-only SPF if still present |
| Bing Webmaster TXT                                      | Not present                                                                                                   |
| Site polish + admin wave                                | PRs **#7–#10** merged to `main` (2026-08-07)                                                                  |

## Remaining dashboard steps

### 1. Listmonk Vercel env — DONE

`LISTMONK_URL` / `LISTMONK_LIST_UUID` / `LISTMONK_DASHBOARD_URL` live. `/api/health` → `integrations.listmonk: true`.

Still do: one live newsletter subscribe E2E, then [listmonk-drip.md](./listmonk-drip.md).

### 2. Resend SPF

Keep **one** SPF TXT on `@`:

```text
v=spf1 include:spf.messagingengine.com include:_spf.resend.com ?all
```

Delete the older Fastmail-only SPF duplicate if both still exist. Keep Google verification TXT unchanged. Re-check Resend domain → SPF pass.

### 3. Google Search Console

1. Open Search Console → Domain `nothing.digital` → Verify (TXT already in DNS).
2. Sitemaps → submit `https://nothing.digital/sitemap.xml` if not already submitted.
3. Week-1: review Coverage / indexing ([post-launch-monitoring.md](./post-launch-monitoring.md) §5.15).

### 4. Bing Webmaster Tools

1. Add site (import from GSC if offered).
2. Add Bing-provided `TXT` on `@`; update status in [monitoring.md](./monitoring.md).
3. Submit the same sitemap URL.

### 5. Sentry Week-1 cadence

`SENTRY_DSN` is live (`integrations.sentry: true`). Daily: Issues filtered to `production`; watch `/api/contact` and `/api/newsletter`. Details: [post-launch-monitoring.md](./post-launch-monitoring.md).

### 6. GitHub branch protection / secret scanning

Repo `nothingdigital/nothing.digital` → Settings → Branches + Code security. Review required checks and secret scanning (UI-only). Branch protection was **not** configured as of 2026-08-07 (API 404).

### 7. Supabase migrations

Apply on production (SQL editor or CLI), in order if not already applied:

1. `supabase/migrations/003_asset_monitor_url.sql` — `client_assets.monitor_url`
2. `supabase/migrations/004_profiles.sql` — shipped with admin wave; apply if not yet on prod

Smoke: client asset edit + optional `monitor_url` link.

## Done when

- [x] `listmonk: true` on production `/api/health`
- [x] SPF includes `_spf.resend.com` (remove duplicate SPF TXT if present)
- [ ] GSC verified + sitemap submitted
- [ ] Bing verified + sitemap submitted
- [ ] Week-1 Sentry / Umami / Speed Insights reviews started
- [ ] Live newsletter E2E confirmed
- [ ] Migration `003_asset_monitor_url.sql` applied on Supabase
- [x] Site polish PRs #7–#9 + admin follow-ups wave on `main` (#10)

## Related

- [dns.md](./dns.md) · [monitoring.md](./monitoring.md) · [listmonk-drip.md](./listmonk-drip.md) · [post-launch-monitoring.md](./post-launch-monitoring.md)
- Next-agent handoff: [../superpowers/HANDOFF-post-launch-ops.md](../superpowers/HANDOFF-post-launch-ops.md)
