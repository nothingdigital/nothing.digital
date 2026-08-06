# Nothing.Digital — PikaPods Integrations & Ops Backend

> **Document:** `05-pikapods-integrations.md`  
> **Date:** 2026-08-05  
> **Status:** In progress — Pack F admin + Calendly CTA shipped; Umami code ready (pod pending); Listmonk/n8n deferred  
> **Parent:** [`00-master-document.md`](./00-master-document.md)  
> **Standards:** ponytail (YAGNI), SOLID, never-nesting, caveman prose in summaries  
> **Agents:** [Umami](d5b86a08-a858-4671-8bfc-46a836b2a6fa) · [Listmonk](ccabcb50-5c94-4409-b8a7-5edad7f7c2ee) · [n8n](e212eb16-7dba-4f32-84ea-31bc8afada76) · [Uptime Kuma](b8134db9-9505-453c-ba52-826f8e521d62) · [Secondary](cadea115-b2ad-44b4-a465-9791b6c3d93d) · [Admin](ec11bd9c-fba7-4764-b3e9-40c8a0ea5e74) · [Secretary](2dc1953e-9bed-4ac6-a85a-4f66312813c3)

---

## 0. Executive summary

Client site stays on Vercel. PikaPods hosts **sidecar OSS tools**. Admin/ops lives in same Next.js app under `/admin`.

### Status board (2026-08-05)

| Track                            | Status                   | Notes                                                                                                                                            |
| -------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pack F — `/admin`**            | ✅ Code shipped          | Inbox, newsletter list, health, settings, magic-link auth. Live gate: Supabase Auth + `ADMIN_EMAILS`.                                            |
| **Pack A — Umami**               | 🟡 Code ready / ops open | `UmamiScript`, consent gate, privacy copy, Speed Insights kept. **Next:** pod + `analytics.nothing.digital` + Vercel env + cut Vercel Analytics. |
| **Calendly**                     | ✅ CTA shipped           | Env-gated link on `/contact` + admin Health/Settings. `/admin/bookings` removed (Calendly SoT). Webhook/`bookings` table deferred.               |
| **Pack B — Listmonk**            | 🟡 Code ready / ops open | `/api/newsletter` proxies when `LISTMONK_*` set; else Supabase. Admin launcher.                                                                  |
| **Pack C — n8n**                 | 🟡 Code ready / ops open | `notifyN8n()` after contact/newsletter; no-op without env. Admin launcher.                                                                       |
| **Kuma / secondary / secretary** | ⬜ Deferred              | Kuma admin link ready via `KUMA_DASHBOARD_URL`. See §5–§8.                                                                                       |

**Next to complete:** Umami ops (pod + DNS + env). **After that:** Listmonk when a campaign exists (set env only). Drip outline + cadence: [`docs/growth-tactics.md`](../docs/growth-tactics.md).

**Growth drip acceptance (when Pack B live):**

- [ ] Double opt-in list + welcome transactional
- [ ] Day 0 / 3 / 7 welcome series (blog → case study → scoping CTA)
- [ ] Privacy copy names Listmonk / DOI
- [ ] Site forms still succeed if n8n down

**Ship order (ponytail):**

1. ~~Owner `/admin` inbox~~ ✅ code
2. Umami (~$1.80/mo) — 🟡 code done; **ops next**
3. ~~Calendly CTA on `/contact`~~ ✅ (webhook later)
4. Listmonk (~$2–3/mo) — when campaigns exist
5. n8n (~$4–5/mo) — when Slack/Listmonk fan-out needed
6. Uptime Kuma (~$1.80/mo) — only if UptimeRobot free fails you
7. Secondary pods — defer (see §6)
8. Secretary role — when hire exists

---

## 1. Cost rollup (USD/mo, excl. VAT)

PikaPods pricing v4 baseline: **~$1.80/mo** = 0.25 CPU + 0.25 GB RAM + default storage. Billed hourly. $5 welcome credit. Min ~$1/pod/mo even stopped.

### 1.1 Individual

| Item               | Role                 | Minimal   | Recommended start         | Effort    | Skip unless                     |
| ------------------ | -------------------- | --------- | ------------------------- | --------- | ------------------------------- |
| **Umami**          | Privacy analytics    | **$1.80** | $1.80 (0.25/0.25)         | 3–5 h     | Vercel Analytics enough forever |
| **Listmonk**       | Newsletter campaigns | **$1.80** | **$2.20–2.50** (0.25/0.5) | 8–12 h    | No campaigns in 6 mo            |
| **n8n**            | Webhook automation   | **$3.60** | **$4.50–5.00** (0.5/1 GB) | 4–6 h MVP | Resend notify alone enough      |
| **Uptime Kuma**    | Availability         | **$1.80** | $1.80                     | ~1 h      | Keep free UptimeRobot           |
| FreeScout          | Helpdesk             | $3–4      | —                         | M         | Secretary + shared inbox pain   |
| Shlink             | Short links          | $1.80     | —                         | S         | Weekly A/B short links          |
| Ntfy               | Push alerts          | $1.80     | —                         | S         | Miss email alerts               |
| BookStack          | Wiki                 | $2–3      | —                         | M         | Non-dev edits docs              |
| Fider              | Feedback board       | $1.80     | —                         | M         | SaaS product w/ users           |
| **/admin (owner)** | Lead inbox           | **$0**    | $0 (Supabase/Vercel)      | 33–43 h   | —                               |
| **Secretary ops**  | Roles + CRM light    | **$0–10** | Calendly Free/Std         | Phase A–C | No hire yet                     |

### 1.2 Cumulative packs

| Pack                      | Pods / systems                                    | Est. $/mo   | When                         |
| ------------------------- | ------------------------------------------------- | ----------- | ---------------------------- |
| **A — Analytics only**    | Umami                                             | **~$1.80**  | Post-launch                  |
| **B — Marketing**         | Umami + Listmonk                                  | **~$4–5**   | First newsletter campaign    |
| **C — Automation**        | B + n8n                                           | **~$8–10**  | Slack/Listmonk fan-out       |
| **D — Full ops sidecars** | C + Kuma                                          | **~$10–12** | Status page / sub-min checks |
| **E — + secondary (all)** | D + FreeScout + Shlink + Ntfy + BookStack + Fider | **~$22–28** | **Don't** — YAGNI            |
| **F — Admin software**    | `/admin` + Calendly                               | **+$0–10**  | Parallel to A–C              |
| **G — Secretary ready**   | F + Phase B roles (+ optional FreeScout)          | **+$0–15**  | Hire day                     |

**Recommended year-1 target:** Pack **B** (~$4–5/mo) + Pack **F** ($0–10) ≈ **$5–15/mo** incremental vs current stack.

---

## 2. Umami

**Does:** Owned pageviews, referrers, UTMs. Cookieless. Complements Speed Insights; **replaces** Vercel Analytics.

**Flow:** Browser → `analytics.nothing.digital/script.js` → Umami Postgres → dashboard.

**Build:**

| #   | Item                                                          | Status                                                                                         |
| --- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | PikaPods Umami pod (0.25/0.25)                                | ⬜ Ops                                                                                         |
| 2   | Domain `analytics.nothing.digital`                            | ⬜ Ops (NXDOMAIN today)                                                                        |
| 3   | Atom `UmamiScript` + env `NEXT_PUBLIC_UMAMI_*`                | ✅ Code                                                                                        |
| 4   | Keep Speed Insights; drop `@vercel/analytics` when Umami live | 🟡 Code keeps Speed Insights; Analytics still interim fallback until env set + package removed |
| 5   | CSP allow script/connect to analytics host                    | 🟡 Documented in `infra/cloudflare/security-headers.md`; not enforced in app yet               |
| 6   | Privacy page accurate (consent + Umami)                       | ✅ Code                                                                                        |

**SOLID:** `env.ts` owns config; `umami-script.tsx` owns inject; layout/consent compose; pod owns store.

**Cost:** ~$1.80/mo · **Remaining effort:** ops ~1–2 h

**Skip if:** Never open analytics dashboards.

**Accept:** Pageview in Umami <30s after visit; no CSP errors; Privacy copy accurate; no dual Vercel Analytics + Umami.

---

## 3. Listmonk

**Status:** 🟡 Code ready — gate: first newsletter campaign + pod. Set `LISTMONK_URL` + `LISTMONK_LIST_UUID` to cut over.

**Does:** Double opt-in lists, campaigns, unsub, open/click. Site `/api/newsletter` becomes thin forwarder.

**Owns:**

| Owner             | What                                 |
| ----------------- | ------------------------------------ |
| Listmonk          | Subscribers, campaigns, DOI          |
| Resend SMTP       | Marketing transport only             |
| Resend API        | Contact transactional (unchanged)    |
| `/api/newsletter` | Validate, rate-limit, proxy          |
| Supabase          | Drop newsletter writes after cutover |

**Build:**

1. Pod + `newsletter.nothing.digital` + Resend SMTP
2. Public list, double opt-in
3. Swap newsletter API → Listmonk public subscription API
4. Form copy → “check email to confirm”
5. Migrate existing Supabase emails (import as confirmed if prior single opt-in)
6. Privacy policy update

**Cost:** ~$1.80–2.50/mo · **Effort:** M (8–12 h)

**Skip if:** No campaigns planned.

**Accept:** Subscribe → Unconfirmed → confirm → Confirmed; contact form still works via Resend API.

---

## 4. n8n

**Status:** 🟡 Code ready — gate: Slack/Listmonk fan-out needed. Set `N8N_WEBHOOK_URL` (+ optional secret).

**Does:** Optional fan-out after critical path. User response never waits on n8n.

**MVP workflows (max 3):**

1. Contact webhook → Slack/ntfy
2. Newsletter → Listmonk (if Listmonk live)
3. Uptime Kuma → ntfy

**Pattern:** After Supabase + Resend success → fire-and-forget `POST` with `X-N8N-Secret`.

**Build:** Pod `automation.nothing.digital` → Basic Auth UI + public webhooks → WF-1 → Next.js `notifyN8n()` helper.

**Cost:** ~$3.60–5.00/mo (0.5 CPU / 0.5–1 GB) · **Effort:** 4–6 h MVP

**Skip if:** Inbox email enough.

**Accept:** Form 201 when n8n down; Slack arrives when n8n up; bad secret rejected.

---

## 5. Uptime Kuma

**Does:** HTTP monitors for `nothing.digital` + `/api/health` keyword `"ok"`. Email alerts.

**Ponytail:** Launch with **UptimeRobot free**. Kuma only for branded status page or sub-minute checks (~$1.80 vs UptimeRobot Pro ~$8–13).

**Cost:** ~$1.80/mo · **Effort:** ~1 h · **Don't run both** paid tools.

---

## 6. Secondary pods (defer-first)

| App       | $/mo  | Effort | Skip unless                   | Tag                     |
| --------- | ----- | ------ | ----------------------------- | ----------------------- |
| FreeScout | $3–4  | M      | ≥2 people triage mail         | Only if secretary hired |
| Ntfy      | $1.80 | S      | Miss email alerts + Kuma live | Maybe later             |
| BookStack | $2–3  | M      | Non-tech edits SOPs           | Maybe later             |
| Shlink    | $1.80 | S      | Weekly short-link A/B         | Defer forever           |
| Fider     | $1.80 | M      | SaaS product ≥100 users       | Defer forever           |

---

## 7. Admin dashboard (owner)

**Problem:** Leads split across Supabase + Resend + Calendly + ops tools.

**Status:** ✅ Code shipped (Pack F). Live gate: Supabase Auth + `ADMIN_EMAILS` + service role.

**Shipped routes (`/admin`):**

| Screen     | Route               | Status | Notes                                                    |
| ---------- | ------------------- | ------ | -------------------------------------------------------- |
| Inbox      | `/admin/inbox`      | ✅     | Triage `new`→`read`→`replied`→`archived`                 |
| Newsletter | `/admin/newsletter` | 🟡     | List only — CSV export + unsubscribe still open          |
| Health     | `/admin/health`     | ✅     | `/api/health` + Umami / Calendly / Vercel / Sentry links |
| Settings   | `/admin/settings`   | ✅     | Env tool registry (read-only)                            |
| Login      | `/admin/login`      | ✅     | Magic link → `/auth/callback`                            |

**Calendly:** Public CTA on `/contact` when `CALENDLY_URL` set. Admin link lives on Health/Settings. **`/admin/bookings` removed** — Calendly remains source of truth until webhook/`bookings` table is justified.

**Auth:** Supabase magic link + `ADMIN_EMAILS` allowlist. Middleware fail-closed.

**Data:** **No new tables v1.** Use existing `contact_submissions.status`. Service role after admin auth for reads/writes.

**Module layout (flat):**

```
src/app/admin/...
src/lib/admin/auth.ts | config.ts | queries.ts
src/components/admin/*  (presentational)
```

Pages compose; queries own SQL; no god context.

**PikaPods in UI:** launcher links only — never reimplement Umami charts.

**Still open (admin polish, not blockers for Pack A):** newsletter CSV, admin unsubscribe, optional restore of a dedicated bookings page after webhook.

**Not v1:** CRM kanban, AI, billing, Realtime, multi-role.

---

## 8. Secretary & client ops

### Roles

| Cap                                       | Owner | Secretary |
| ----------------------------------------- | ----- | --------- |
| Clients / notes / tasks / bookings view   | ✅    | ✅        |
| Invite staff / delete / export / settings | ✅    | ❌        |

### Phases

| Phase                  | Ship                                                            | Skip                          | Effort | $/mo                  |
| ---------------------- | --------------------------------------------------------------- | ----------------------------- | ------ | --------------------- |
| **A** Owner admin      | Auth, inbox, notes/tasks, Calendly embed + webhook → `bookings` | Full CRM                      | 5–8 d  | $0–10 (Calendly)      |
| **B** Invite secretary | `profiles.app_role`, RLS                                        | Self-signup, audit log        | 3–5 d  | $0                    |
| **C** Light CRM        | `clients` entity, search, CSV export                            | HubSpot, first-party calendar | 8–12 d | $0–25 if Supabase Pro |

**Booking:** Calendly first until >50 bookings/mo or white-label need.

**Tables (Phase B/C):** `profiles`, `clients`, `bookings`, `client_notes`, `client_tasks` + RLS `is_staff()` / `is_owner()`.

**Audit log:** Skip — notes + `author_id` enough until compliance force.

---

## 9. Architecture (sidecar + site)

```
┌──────────────────────────────────────────┐
│ https://nothing.digital (Next.js/Vercel) │
│  Public site + /admin                    │
│  Supabase · Resend · Upstash             │
└────────────┬─────────────────────────────┘
             │ webhooks / script / SMTP
     ┌───────┴───────┬────────────┬────────┐
     ▼               ▼            ▼        ▼
  Umami          Listmonk        n8n    Kuma
  analytics.*    newsletter.*    automation.*  status.*
  (PikaPods)     (PikaPods)      (PikaPods)    (PikaPods)
```

**Never-nesting rule:** Public API critical path (validate → store → Resend → 201) finishes before optional n8n. Early return on missing env. Flat admin modules.

---

## 10. Recommended rollout checklist

### Done

- [x] Phase F: Ship `/admin` inbox + magic link (Pack F) — code; needs Supabase Auth + `ADMIN_EMAILS` live
- [x] Phase A code: `UmamiScript` + env schema + consent gate + privacy + Speed Insights kept with Umami
- [x] Calendly CTA on `/contact` (env-gated `CALENDLY_URL`) + admin Health/Settings link
- [x] Drop `/admin/bookings` page — Calendly external SoT until volume
- [x] Code ready for Listmonk / n8n / Kuma — env-gated helpers + admin launchers (pods optional)

### Next (ops — Pack A)

- [ ] Create Umami pod on PikaPods (~0.25/0.25)
- [ ] DNS `analytics.nothing.digital` → pod
- [ ] Set `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `UMAMI_DASHBOARD_URL` in Vercel
- [ ] Confirm pageview <30s; disable Vercel Web Analytics; remove `@vercel/analytics` when stable
- [ ] Apply Cloudflare CSP allowlist for analytics host (see `infra/cloudflare/security-headers.md`)

### Later

- [ ] Set `CALENDLY_URL` in Vercel if not already (CTA hidden until set)
- [ ] Webhook → `bookings` table — defer until >50 bookings/mo or secretary needs list
- [ ] Admin newsletter CSV export + unsubscribe action (or retire after Listmonk)
- [ ] Phase B ops: Listmonk pod + set `LISTMONK_URL` / `LISTMONK_LIST_UUID` / dashboard URL (~+$2–3)
- [ ] Phase C ops: n8n pod + set `N8N_WEBHOOK_*` / dashboard URL (~+$5)
- [ ] Keep UptimeRobot free; set `KUMA_DASHBOARD_URL` only if Kuma is live
- [ ] Phase Secretary B only on hire day
- [ ] Secondary pods: default **no**

---

## 11. Risk register (delta)

| Risk                   | Mitigation                                |
| ---------------------- | ----------------------------------------- |
| Pod sprawl cost/ops    | Cap at Pack B until pain                  |
| n8n down loses Slack   | Resend remains primary notify             |
| Listmonk admin exposed | Cloudflare Access / no public admin DNS   |
| Dual analytics         | Cut Vercel Analytics same deploy as Umami |
| Over-CRM               | Status field until secretary; no HubSpot  |
| Secret leak webhooks   | Header secret + rotate; form still 201    |

---

## 12. Reference

- [PikaPods](https://www.pikapods.com/) · [App notes](https://docs.pikapods.com/apps/)
- Parent: [`00-master-document.md`](./00-master-document.md)
- Existing: Supabase `contact_submissions` / `newsletter_subscribers`, Resend, `/api/health`

---

_Last updated: 2026-08-05 — status board + done/next/later checklist after Phase F + Calendly CTA + Umami code_
