# Handoff prompt — Post-launch ops + Listmonk activation

Copy everything below the line into a new Cursor agent chat to continue this work.

**Prior wave:** Admin follow-ups 1–6 are **implemented on** `feat/admin-followups-wave` (not necessarily merged to `main` yet). Do not re-implement those plans. See [HANDOFF-admin-followups.md](./HANDOFF-admin-followups.md) (status: shipped on feature branch).

---

## Prompt (paste into next agent)

You are continuing work on **Nothing.Digital** at `/Users/DeSchroyer/workspace/nothingdigital`.

### Mission

Execute the **post-launch ops close-out** wave: merge/ship pending work, finish credential-only production steps, activate Listmonk drip, then sales outreach. Prefer runbook execution and small docs/code fixes over new features.

Do **not** invent a new product roadmap. Do **not** start n8n / Kuma / Calendly webhooks / secretary roles / Stripe unless the user explicitly expands scope.

### First actions (required)

1. **Orient in parallel** (explore/generalPurpose agents or direct reads):
   - Agent A: read this handoff + `docs/runbooks/ops-credentials.md` + `docs/runbooks/listmonk-drip.md`.
   - Agent B: `gh pr list --state open` and compare `main` vs `feat/admin-followups-wave` (what still needs merge).
   - Agent C: check live `https://nothing.digital/api/health` integrations + whether `003_asset_monitor_url.sql` is applied (Supabase).
2. Confirm with the user: merge first vs credentials-first if both are blocked on them.
3. Work the ordered checklist below; commit only when asked; conventional commits; small PRs.

### Ordered checklist

#### A. Ship pending branches / PRs

Open site-polish PRs into `main` (as of 2026-08-06):

| PR  | Branch                         | What                                           |
| --- | ------------------------------ | ---------------------------------------------- |
| #7  | `fix/calendly-embed-resize`    | Calendly `initInlineWidget({ resize: true })`  |
| #8  | `fix/footer-seal`              | Footer seal textPath / double-ring fix         |
| #9  | `fix/contact-privacy-checkbox` | Privacy checkbox left of label (FormField bug) |

Also merge or open PR for **`feat/admin-followups-wave`** (admin plans 1–6 + soft-launch content + ops runbooks) if not yet on `main`.

Verify production after merge: `/contact` checkbox left-aligned; Calendly no nested scroll; footer seal concentric; `/admin` ops glance.

#### B. Supabase migration

- Apply `supabase/migrations/003_asset_monitor_url.sql` on production Supabase if not applied.
- Smoke: client asset edit + optional `monitor_url` link.

#### C. Ops credentials (dashboard / DNS)

Follow `docs/runbooks/ops-credentials.md` remaining items:

1. **Listmonk Vercel env** (`LISTMONK_URL`, `LISTMONK_LIST_UUID`, `LISTMONK_DASHBOARD_URL`) → redeploy → `/api/health` `listmonk: true`
2. Confirm Resend SPF already includes `_spf.resend.com` (marked done in runbook — re-verify)
3. GSC: verify property + submit sitemap if not done
4. Bing Webmaster: TXT + sitemap
5. GitHub branch protection / secret scanning review
6. Live newsletter subscribe E2E once Listmonk env is true

#### D. Listmonk welcome drip

After `listmonk: true`, execute `docs/runbooks/listmonk-drip.md`:

- Import templates from `content/emails/welcome-drip.md`
- Sequence Day 0 / 3 / 7
- Test subscribe from the live site form
- Check off the runbook checklist

#### E. Founding client outreach (sales)

- Cap 2 slots: `docs/sales/founding-client-outreach.md`
- Pitch: `docs/sales/founding-client-pitch.md`
- Contracts: `docs/contracts/` (MSA + Fixed SOW + Founding Client Addendum)
- Agent helps with copy/process only; user owns outreach sends

### Where to view documentation

| Doc                                               | Why                                         |
| ------------------------------------------------- | ------------------------------------------- |
| `docs/runbooks/ops-credentials.md`                | Credential checklist (source of truth)      |
| `docs/runbooks/listmonk-drip.md`                  | Welcome drip activation                     |
| `docs/runbooks/post-launch-monitoring.md`         | Week-1 Sentry / Umami / GSC cadence         |
| `docs/runbooks/monitoring.md`                     | Uptime + search console                     |
| `docs/sales/founding-client-outreach.md`          | 2-slot outreach tracker                     |
| `plans/00-master-document.md` §12 Done/Next/Later | Phase 6 status                              |
| `docs/superpowers/plans/README.md`                | Admin plans — **shipped on feature branch** |
| `docs/growth-tactics.md`                          | YES/NO/LATER; no new YES without ask        |

### Locked decisions

- Payments stay manual (no Stripe)
- External dashboards = deep-links only (no Umami/Listmonk iframes)
- n8n / Kuma deferred until a real fan-out / sub-minute need
- Calendly webhook / bookings table deferred until volume
- Admin follow-ups 1–6: do not rebuild

### Out of scope unless user expands

- Secretary roles / RLS overhaul
- Client portal
- IT device inventory
- Lead magnets / chatbots / A/B frameworks (growth LATER)

### Done criteria for this wave

- [ ] Site polish PRs (#7–#9) merged (or explicitly deferred)
- [ ] `feat/admin-followups-wave` on `main` (or PR open + user-owned merge)
- [ ] Migration `003` applied
- [ ] `/api/health` → `listmonk: true` + live subscribe verified
- [ ] Listmonk drip checklist complete (or blocked with clear next human step)
- [ ] Bing + GSC status updated in runbooks
- [ ] Founding outreach tracker has next actions (not necessarily signed clients)
- [ ] `SCRATCHPAD.md` + master **Next** updated

### Suggested first message after agents return

Summarize merge vs credentials blockers, then start with **A (ship PRs)** or **C1 (Listmonk env)** depending on what the user can do right now.
