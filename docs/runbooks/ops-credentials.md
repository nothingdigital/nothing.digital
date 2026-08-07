# Ops Credentials Checklist — Nothing.Digital

> **Verified live:** 2026-08-07 via `https://nothing.digital/api/health` + public DNS + owner report.  
> **Owner:** DevOps. Dashboard items need human credentials.  
> **Live remaining-work board:** [`../../SCRATCHPAD.md`](../../SCRATCHPAD.md) (don't fork checklists elsewhere).

## Live verification (2026-08-07)

| Check                                                   | Result                                                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `/api/health`                                           | `status: ok`                                                                                                  |
| `supabase` / `resend` / `sentry` / `umami` / `calendly` | `true`                                                                                                        |
| `listmonk`                                              | **`true`**                                                                                                    |
| `ai` (AI Gateway key)                                   | **pending** — set `AI_GATEWAY_API_KEY` on Vercel when enabling AI                                             |
| Sitemap                                                 | `https://nothing.digital/sitemap.xml` → 200                                                                   |
| Google Search Console                                   | **Done** — property verified + sitemap submitted (owner 2026-08-07)                                           |
| SPF TXT                                                 | Prefer single record with `include:_spf.resend.com` — **remove duplicate** Fastmail-only SPF if still present |
| Bing Webmaster Tools                                    | Site accessible; **sitemap submit remaining**                                                                 |
| Migration `003_asset_monitor_url.sql`                   | **Applied** (owner 2026-08-07)                                                                                |
| Migration `004_profiles.sql`                            | **Check** — may already be applied; confirm with SQL below                                                    |
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

### 3. Google Search Console — DONE

Property verified + `https://nothing.digital/sitemap.xml` submitted (2026-08-07).

Week-1 only: review Coverage / indexing ([post-launch-monitoring.md](./post-launch-monitoring.md) §5.15).

### 4. Bing Webmaster Tools — sitemap remaining

Code already serves the sitemap. No app change needed.

**If the site is already verified** (Import from GSC or DNS TXT done):

1. Open <https://www.bing.com/webmasters> → select `nothing.digital`.
2. Left nav → **Sitemaps** (sometimes under **Configure My Site** → **Sitemaps**).
3. In **Submit a sitemap**, paste exactly:
   ```text
   https://nothing.digital/sitemap.xml
   ```
4. Click **Submit** / **Add**.
5. Wait for status → **Success** (or “Indexed” / URL count > 0). Refresh after a few minutes if pending.
6. Optional: **URL Inspection** → paste `https://nothing.digital/` → **Crawl** if you want a first index nudge.
7. Update [monitoring.md](./monitoring.md) Bing row to `submitted` when done.

**If the site is not verified yet:**

1. Open <https://www.bing.com/webmasters> → sign in with Microsoft account.
2. Prefer **Import from Google Search Console** (fastest — GSC already done). Approve access when prompted.
3. Else: **Add a site** → Domain `nothing.digital` → copy Bing’s `TXT` value → add as DNS `TXT` on `@` → click **Verify**.
4. Paste the Bing TXT value into [monitoring.md](./monitoring.md) (replace `REPLACE_ME`).
5. Then do steps 1–7 above for the sitemap.

### 5. Sentry Week-1 cadence

`SENTRY_DSN` is live (`integrations.sentry: true`). Daily: Issues filtered to `production`; watch `/api/contact` and `/api/newsletter`. Details: [post-launch-monitoring.md](./post-launch-monitoring.md).

### 6. GitHub branch protection / secret scanning

Repo `nothingdigital/nothing.digital` → Settings → Branches + Code security. Review required checks and secret scanning (UI-only). Branch protection was **not** configured as of 2026-08-07 (API 404).

### 7. Supabase migrations

| Migration                   | Status                            |
| --------------------------- | --------------------------------- |
| `003_asset_monitor_url.sql` | **Applied** (owner 2026-08-07)    |
| `004_profiles.sql`          | **Confirm** — run check SQL below |

**Check whether `004` already ran** (SQL editor → production):

```sql
SELECT EXISTS (
  SELECT 1 FROM pg_type WHERE typname = 'app_role'
) AS has_app_role,
EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'profiles'
) AS has_profiles,
EXISTS (
  SELECT 1 FROM pg_proc WHERE proname = 'is_staff'
) AS has_is_staff;
```

- All `true` → `004` is done; skip.
- Any `false` → run full contents of `supabase/migrations/004_profiles.sql` in the SQL editor, then re-run the check.

Smoke after `003`: `/admin` → client → Assets → edit → optional **Monitor URL**.

### 8. Instantly cold outbound (hybrid)

Dashboard-only: Instantly account, sending domain DNS, warmup, suppression sync.  
Runbooks: [outbound-instantly.md](./outbound-instantly.md) · [outbound-pilot.md](./outbound-pilot.md).  
CLI: `pnpm lead-finder` (needs `GOOGLE_PLACES_API_KEY`). Never import cold CSVs into Listmonk.

### 9. AI Gateway enablement (optional — code already on `main`)

AI inbox drafts + contact brief assistant are **shipped**. Enablement is env-only on Vercel (Production).

1. Vercel → team/project → **AI Gateway** (or [vercel.com/docs/ai-gateway](https://vercel.com/docs/ai-gateway)) → create an API key (set a monthly budget if offered).
2. Project → **Settings** → **Environment Variables** → Production:

   | Name                                  | Value                 | Notes                            |
   | ------------------------------------- | --------------------- | -------------------------------- |
   | `AI_GATEWAY_API_KEY`                  | (secret from step 1)  | Required for both features       |
   | `AI_MODEL`                            | `openai/gpt-4.1-mini` | Optional; this is the default    |
   | `AI_INBOX_DRAFTS_ENABLED`             | `true`                | Admin `/admin/inbox` drafts      |
   | `AI_BRIEF_ASSISTANT_ENABLED`          | `true`                | Public contact brief helper      |
   | `AI_OPS_BRIEF_ENABLED`                | `true`                | Admin `/admin` today brief       |
   | `AI_INVOICE_COVER_ENABLED`            | `true`                | Invoice cover HITL before Resend |
   | `AI_OUTBOUND_PERSONALIZATION_ENABLED` | `true`                | Instantly one-line before CSV    |

3. **Redeploy** Production (env changes alone do not always hot-reload server flags).
4. Confirm `https://nothing.digital/api/health` → `integrations.ai: true`.
5. Smoke:
   - `/admin/settings` → AI rows show gateway + effective flag state (on only when key + flag are set)
   - `/admin/inbox` → open a submission → **Draft reply** appears → generate → edit → do **not** send a real client until you trust the draft.
   - `/contact` → **Help me write a brief** → generate → fields fill → you can discard without submitting.
   - `/admin` → **Draft today brief** (ops)
   - Invoice cover + outbound personalization when those flags are on (outbound needs migration `007`)
6. Kill switch: set any flag to `false` (or remove `AI_GATEWAY_API_KEY`) and redeploy — CTAs hide; Settings rows flip to `off`.

Local: mirror the same keys in `.env.local` (see `.env.local.example`).

Admin AI drafts are rate-limited per admin email + feature (same in-memory limiter as public brief).

## Done when

- [x] `listmonk: true` on production `/api/health`
- [x] SPF includes `_spf.resend.com` (remove duplicate SPF TXT if present)
- [x] GSC verified + sitemap submitted
- [ ] Bing sitemap submitted (verification already or via Import from GSC)
- [ ] Week-1 Sentry / Umami / Speed Insights reviews started
- [ ] Live newsletter E2E confirmed
- [x] Migration `003_asset_monitor_url.sql` applied on Supabase
- [ ] Migration `004_profiles.sql` confirmed applied (check SQL above)
- [ ] AI enabled (optional): `integrations.ai: true` + inbox/brief smoke
- [x] Site polish PRs #7–#9 + admin follow-ups wave on `main` (#10)

## Related

- **Live board:** [`../../SCRATCHPAD.md`](../../SCRATCHPAD.md) · **Docs index:** [`../README.md`](../README.md)
- [dns.md](./dns.md) · [monitoring.md](./monitoring.md) · [listmonk-drip.md](./listmonk-drip.md) · [post-launch-monitoring.md](./post-launch-monitoring.md)
- AI design: [../superpowers/specs/2026-08-06-ai-integration-design.md](../superpowers/specs/2026-08-06-ai-integration-design.md)
- Agent handoff: [../superpowers/HANDOFF-post-launch-ops.md](../superpowers/HANDOFF-post-launch-ops.md)
- Security smoke (2026-08-07): [archive/security-smoke-2026-08-07.md](./archive/security-smoke-2026-08-07.md)
