# Growth Tactics — Verdicts & Cadence

> **Updated:** 2026-08-06  
> **Scope:** All three lenses — strict agency YES set, LATER productization flags, full yes/no/later on every listed tactic.  
> **Product:** Nothing.Digital agency site (portfolio + lead gen → scoping call). Not SaaS.

## Conversion spine

```
Content (blog / case studies) → Trust → Clear CTA → Contact / Calendly
Newsletter → Listmonk drips → Soft CTA → Contact / Calendly
```

---

## Full verdict table

### Conversion & Lead Gen

| Tactic             | Verdict   | Why                                                         |
| ------------------ | --------- | ----------------------------------------------------------- |
| Free Tier / Trial  | **NO**    | No product to trial; free value is the scoping call         |
| Interactive Demo   | **NO**    | Proof = portfolio + discovery, not a sandbox                |
| Lead Magnets       | **LATER** | Valid once Listmonk is live + one real PDF/checklist exists |
| Exit-Intent Popups | **NO**    | Brand-hostile; cookie banner already owns interrupt UI      |
| Referral Program   | **NO**    | Premature; informal post-delivery ask beats software        |

### Engagement & Retention

| Tactic                       | Verdict   | Why                                                      |
| ---------------------------- | --------- | -------------------------------------------------------- |
| Gamification                 | **NO**    | No accounts; SaaS retention theater                      |
| Personalized Onboarding Quiz | **LATER** | Service-fit quiz → Calendly only when volume justifies   |
| Community Forum              | **NO**    | Empty Discord hurts brand; Slack in plans is ops fan-out |
| Blog / Newsletter            | **YES**   | Half-built; gap is Listmonk ops + cadence                |
| Webinars / Workshops         | **LATER** | External Zoom/Calendly landing only; no platform build   |

### Social Proof & Trust

| Tactic                      | Verdict   | Why                                                                    |
| --------------------------- | --------- | ---------------------------------------------------------------------- |
| Testimonials / Case Studies | **YES**   | Highest trust lever; anonymized composites until named clients approve |
| Live Activity Feed          | **NO**    | Fake FOMO / dark pattern                                               |
| Trust Badges                | **LATER** | After real clients; no generic compliance spam                         |
| User-Generated Content      | **NO**    | No community product; curated quotes only                              |

### UX / UI

| Tactic                    | Verdict         | Why                                                 |
| ------------------------- | --------------- | --------------------------------------------------- |
| Chatbot / Live Chat       | **LATER**       | Contact + Calendly enough until inbox latency hurts |
| One-Click Sign-Up (OAuth) | **NO**          | No public accounts; admin is magic-link only        |
| PWA                       | **NO**          | Brochure site; Phase 4 skipped protocol/PWA path    |
| Dark Mode                 | **YES (done)**  | Shipped via `next-themes`                           |
| Micro-Interactions        | **YES (light)** | Existing hover/motion only; no motion-library pass  |

### Data & Personalization

| Tactic                       | Verdict   | Why                                                |
| ---------------------------- | --------- | -------------------------------------------------- |
| End-user Analytics Dashboard | **NO**    | Umami is internal ops                              |
| Personalized Recommendations | **NO**    | No session/catalog graph                           |
| A/B Testing                  | **LATER** | Traffic too thin; Umami events + manual copy tests |

### Integration & Monetization

| Tactic                  | Verdict   | Why                                             |
| ----------------------- | --------- | ----------------------------------------------- |
| Public API Access       | **NO**    | Lead-capture routes only                        |
| Client Zapier           | **NO**    | n8n is internal ops                             |
| Multi-Language          | **LATER** | EN-only until non-EN market demand              |
| Upsell / Cross-Sell     | **YES**   | Service pages + contact thank-you (no checkout) |
| Affiliate Program       | **LATER** | Manual referral fees until partner volume       |
| SaaS Subscription Tiers | **NO**    | Not self-serve SaaS                             |
| Agency pricing packages | **YES**   | Ballparks on `/pricing`                         |

### Low-Hanging Fruit

| Tactic               | Verdict | Why                                                   |
| -------------------- | ------- | ----------------------------------------------------- |
| Clear CTA Buttons    | **YES** | Primary = scoping call; nav CTA; blog newsletter form |
| Mobile Optimization  | **YES** | Polish pass, not rebuild                              |
| SEO Optimization     | **YES** | Blog in sitemap + OG metadata                         |
| Email Drip Campaigns | **YES** | Listmonk + n8n when pods live                         |

---

## Content cadence

| Channel              | Cadence                   | Owner              |
| -------------------- | ------------------------- | ------------------ |
| Blog                 | 1 post / 2 weeks          | Content            |
| Newsletter broadcast | 1 / month                 | Content + Listmonk |
| Case study           | 1 / month                 | Content            |
| Welcome drip         | Automated (Day 0 / 3 / 7) | Listmonk ops       |

---

## Email drip outline (Listmonk)

**Prerequisite:** Listmonk pod + `LISTMONK_*` env + double opt-in list + copy in `content/emails/welcome-drip.md`. Import the templates and activate the drip in Listmonk.

| Day | Email              | Goal                                            |
| --- | ------------------ | ----------------------------------------------- |
| 0   | Welcome + confirm  | Set expectation; link 1 blog post               |
| 3   | Case study / proof | Trust; link `/portfolio`                        |
| 7   | Soft CTA           | Book free scoping call → `/contact` or Calendly |

**Contact leads (optional n8n):** on `event: "contact"` → Slack/ops notify; optional “Leads” list. Never block HTTP 201 if n8n is down.

**Kill switch:** pause campaign in Listmonk; unset `N8N_WEBHOOK_URL`.

---

## Cross-sell principles

- No cart, checkout, or payment UI.
- Related services on each service page (siblings).
- After contact submit: thank-you + links to pricing, related service, blog.
- Proposal add-ons offline: email retainer, maintenance care plan.
- **Founding Client** (invite-only, max 2): $2,500 build + 12 mo care included → $99+/mo after. Pitch: `docs/sales/founding-client-pitch.md`. Spec: `docs/superpowers/specs/2026-08-06-founding-client-package-design.md`. Not a public `/pricing` SKU.

---

## Ballpark ranges (published on `/pricing`)

| Service         | Range           |
| --------------- | --------------- |
| Websites        | $5K–$15K        |
| Software        | $15K–$60K       |
| Apps            | $20K–$80K       |
| Email marketing | $1.5K–$5K/mo    |
| AI Solutions    | $8K–$35K        |
| Tech Literacy   | $75–$150/hr     |
| Coding & SQL    | $40–$80/session |

All quotes fixed after scoping. Ranges are starting points only.

---

## Implementation map

| Slice                       | Status                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------- |
| CTAs + SEO (sitemap/OG)     | Code                                                                                    |
| Pricing ballparks           | Code                                                                                    |
| Case studies + home feature | Code (anonymized)                                                                       |
| Cross-sell                  | Code                                                                                    |
| Mobile polish               | Code                                                                                    |
| Listmonk cutover + drips    | ✅ Live; drip copy in `content/emails/welcome-drip.md`                                  |
| Soft-launch blog            | ✅ `content/blog/soft-launch-notes.mdx`                                                 |
| Studio portfolio case study | ✅ `content/portfolio/soft-launching-nothing-digital.mdx` (honest; no invented clients) |
| Founding Client outreach    | Tracker in `docs/sales/founding-client-outreach.md`                                     |
| Listmonk drip activate      | Runbook `docs/runbooks/listmonk-drip.md` (needs `listmonk: true`)                       |
