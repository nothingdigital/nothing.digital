# Ops Credentials Checklist — Nothing.Digital

> **Verified live:** 2026-08-06 via `https://nothing.digital/api/health` + public DNS.  
> **Owner:** DevOps. Items marked **Dashboard** need human credentials; code/runbooks are ready.

## Live verification (2026-08-06)

| Check                                                   | Result                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/api/health`                                           | `status: ok`                                                                                            |
| `supabase` / `resend` / `sentry` / `umami` / `calendly` | `true`                                                                                                  |
| `listmonk`                                              | **`false`** — missing production env                                                                    |
| Sitemap                                                 | `https://nothing.digital/sitemap.xml` → 200                                                             |
| Google Search Console TXT                               | Present on `@` — done                                                                                   |
| SPF TXT                                                 | `v=spf1 include:spf.messagingengine.com include:_spf.resend.com ?all` — `include:_spf.resend.com` added |
| Bing Webmaster TXT                                      | Not present                                                                                             |

## Remaining dashboard steps

### 1. Listmonk Vercel env (blocks newsletter → Listmonk)

ponytail: dashboard steps only (YAGNI runbook).

In Vercel → Project → Settings → Environment Variables (Production + Preview):

| Key                      | Value                                  |
| ------------------------ | -------------------------------------- |
| `LISTMONK_URL`           | `https://newsletter.nothing.digital`   |
| `LISTMONK_LIST_UUID`     | Public list UUID from Listmonk → Lists |
| `LISTMONK_DASHBOARD_URL` | `https://newsletter.nothing.digital`   |

Redeploy. Confirm `/api/health` → `integrations.listmonk: true`. Then run one live newsletter subscribe test (see [post-launch-monitoring.md](./post-launch-monitoring.md)).

### 2. Resend SPF

At DNS (Cloudflare / Sav) edit the existing SPF TXT on `@` to:

```text
v=spf1 include:spf.messagingengine.com include:_spf.resend.com ?all
```

Keep Google verification TXT unchanged. Re-check Resend domain → SPF pass.

### 3. Google Search Console

1. Open Search Console → Domain `nothing.digital` → Verify (TXT already in DNS).
2. Sitemaps → submit `https://nothing.digital/sitemap.xml`.
3. Week-1: review Coverage / indexing ([post-launch-monitoring.md](./post-launch-monitoring.md) §5.15).

### 4. Bing Webmaster Tools

1. Add site (import from GSC if offered).
2. Add Bing-provided `TXT` on `@`; update status in [monitoring.md](./monitoring.md).
3. Submit the same sitemap URL.

### 5. Sentry Week-1 cadence

`SENTRY_DSN` is live (`integrations.sentry: true`). Daily: Issues filtered to `production`; watch `/api/contact` and `/api/newsletter`. Details: [post-launch-monitoring.md](./post-launch-monitoring.md).

ponytail: sentry in health; no extra check.

### 6. GitHub branch protection / secret scanning

Repo `nothingdigital/nothing.digital` → Settings → Branches + Code security. Review required checks and secret scanning (UI-only).

## Done when

- [ ] `listmonk: true` on production `/api/health`
- [x] SPF includes `_spf.resend.com` (re-verify in Resend if needed)
- [ ] GSC verified + sitemap submitted
- [ ] Bing verified + sitemap submitted
- [ ] Week-1 Sentry / Umami / Speed Insights reviews started
- [ ] Live newsletter E2E confirmed
- [ ] Migration `003_asset_monitor_url.sql` applied on Supabase
- [ ] Site polish PRs #7–#9 + admin follow-ups wave on `main`

## Related

- [dns.md](./dns.md) · [monitoring.md](./monitoring.md) · [listmonk-drip.md](./listmonk-drip.md) · [post-launch-monitoring.md](./post-launch-monitoring.md)
- Next-agent handoff: [../superpowers/HANDOFF-post-launch-ops.md](../superpowers/HANDOFF-post-launch-ops.md)
