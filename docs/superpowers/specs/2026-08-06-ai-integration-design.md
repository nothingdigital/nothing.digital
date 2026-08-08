# AI Integration — Design Spec

**Date:** 2026-08-06  
**Status:** Admin HITL AI live (env-enabled). Public contact brief **removed** (admin-only AI).  
**Owner:** Nothing.Digital (The Business of Nothing LLC)

## Purpose

Add a shared AI runtime to the Nothing.Digital app so the studio can:

1. Cut founder judgment time on warm inbound (draft → Approve → Resend)
2. Reuse one stack (Vercel AI SDK + Gateway) for admin HITL drafts (ops brief, invoice cover, outbound)

~~Dogfood public brief helper on `/contact`~~ — removed; no public site AI.

This extends — and does not contradict — [admin-automation-until-hire](./2026-08-06-admin-automation-until-hire-design.md): freeform mail still requires Approve; unrestricted auto-reply stays banned.

## Decisions (locked)

| Decision                   | Choice                                                                     |
| -------------------------- | -------------------------------------------------------------------------- |
| First build sequence       | **Shared foundation → Admin inbox drafts → Project Brief Assistant**       |
| Runtime                    | **Vercel AI SDK in Next.js** via AI Gateway                                |
| n8n role                   | Fan-out / glue only — **not** the LLM path                                 |
| RAG / agents / embeddings  | **Deferred** until a real retrieval need appears                           |
| Sitewide chatbot           | **Out of scope** (growth tactics: LATER)                                   |
| Freeform outbound email    | Always **draft → edit → Approve → send**; never auto-send                  |
| Public pricing / timelines | Model must **not invent** quotes; only published ballparks if cited at all |

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  src/lib/ai.ts + src/lib/ai/types.ts                     │
│  gateway · flags · draft helpers · Zod schemas           │
└────────────┬─────────────────────────────┬───────────────┘
             │                             │
    Admin (generateText + Output.object)         Public (generateText + Output.object)
             │                             │
   /admin/inbox server actions    /api/ai/brief (+ contact form UX)
             │                             │
          Resend (Approve)            /api/contact (unchanged submit)
```

**Rules**

- One model factory; no scattered provider keys in feature code
- Admin AI routes/actions require existing admin auth (`ADMIN_EMAILS` / middleware)
- Public AI is rate-limited and feature-flagged; output is always editable by the visitor before submit
- Do not warehouse full PII prompt/response bodies in v1
- Kill switches (env): `AI_INBOX_DRAFTS_ENABLED` / `AI_BRIEF_ASSISTANT_ENABLED` each require `AI_GATEWAY_API_KEY`

---

## Phase 0 — Shared foundation

**Outcome:** Any feature can call shared draft helpers + Zod schemas without reinventing providers.

### Packages

- `ai` (includes Gateway via `createGateway`)

### Env

| Var                          | Required            | Notes                                                                 |
| ---------------------------- | ------------------- | --------------------------------------------------------------------- |
| `AI_GATEWAY_API_KEY`         | Yes for AI features | Preferred single key                                                  |
| `AI_MODEL`                   | No                  | Default `openai/gpt-4.1-mini` via Gateway; override per env if needed |
| `AI_INBOX_DRAFTS_ENABLED`    | No                  | Feature flag for Phase 1 (also needs gateway key)                     |
| `AI_BRIEF_ASSISTANT_ENABLED` | No                  | Feature flag for Phase 2 (also needs gateway key)                     |

Also document in `.env.local.example` and Health chip (presence of gateway key).

### Files

| Path                  | Responsibility                                    |
| --------------------- | ------------------------------------------------- |
| `src/lib/ai.ts`       | Flags, gateway model, inbox + brief draft helpers |
| `src/lib/ai/types.ts` | Shared Zod schemas for structured outputs         |

Public rate limits reuse existing `src/lib/rate-limit.ts`.

### Smoke

- Features hide CTAs when flag/key missing; actions/routes return clear errors

### Out of scope (Phase 0)

- Chat UI, tools, embeddings, usage billing UI

---

## Phase 1 — Inbox reply drafts + triage

**Outcome:** Founder opens `/admin/inbox`, generates a reply draft with triage hint, edits, Approves, and sends via Resend — without leaving admin for mailto.

### UX

On each contact submission card:

1. **Draft reply** (visible only when `AI_INBOX_DRAFTS_ENABLED`)
2. Panel opens with:
   - Triage badge: `urgent` \| `good-fit` \| `needs-clarification` \| `archive-candidate`
   - Editable subject + body
   - **Approve & Send** \| Discard
3. On send success: flash confirmation; set submission status to `replied` (already in `INBOX_STATUSES`)

### Data flow

```
contact_submission
  → generateText + Output.object({ triage, subject, body })
  → founder edits in UI
  → Approve & Send
  → Resend to submission.email (from existing transactional from-address)
  → optional BCC admin
  → set status `replied` on success
```

No new table in v1: draft stays ephemeral in client state until send. Audit warehouse deferred until Approve volume justifies it.

### Structured output (Zod)

```ts
{
  triage: "urgent" | "good-fit" | "needs-clarification" | "archive-candidate",
  triageReason: string, // short, internal
  subject: string,
  body: string, // plain text email body in studio voice
}
```

### Guardrails

- Never send without explicit Approve click
- Never call Instantly from this path (warm inbox only)
- Prompt must use studio voice; no invented pricing or delivery dates
- If Resend fails: show error; do not claim sent; do not flip status

### Plug-in points

- [`src/app/admin/inbox/page.tsx`](../../../src/app/admin/inbox/page.tsx) — CTA + panel mount
- [`src/app/admin/inbox/actions.ts`](../../../src/app/admin/inbox/actions.ts) — `draftInboxReplyAction`, `sendInboxReplyAction`
- [`src/lib/email/templates.ts`](../../../src/lib/email/templates.ts) — wrap freeform approved body in base HTML template
- [`src/lib/resend.ts`](../../../src/lib/resend.ts) — existing client

### Testing

- Unit: Zod schema + prompt version constant; action refuses when AI disabled / unauthenticated
- Mock AI SDK + Resend in tests; no live LLM in CI
- Manual: draft one real inbox row in staging with flag on

### Out of scope (Phase 1)

- Auto-reply, auto-archive, bulk draft-all
- Outbound Instantly personalization (later candidate)
- Today ops brief (later candidate; UI-only)

---

## Phase 2 — Project Brief Assistant

**Outcome:** Visitor on `/contact` can optionally generate a structured project brief into the message field, edit it, then submit through the **existing** contact API unchanged.

### UX

- Secondary control near the message field: **Help me write a brief** (only when `AI_BRIEF_ASSISTANT_ENABLED`)
- Guided, scoped flow (not free chat): 3–5 fixed questions (e.g. goal, current site/state, must-haves, timeline feel, constraints)
- Model returns structured fields → rendered as editable message draft (and optional service/budget suggestions the visitor can accept)
- Disclaimer: “Draft for you to edit — not a quote or commitment.”
- Submit still goes to `POST /api/contact` with normal validation

### API

- `POST /api/ai/brief` — `generateText` + `Output.object` only (same structured pattern as inbox; no streaming chat in v1)
- Auth: none (public); rate limit by IP; max tokens capped
- Input: answers to five fixed questions + honeypot field
- Output: `{ message, suggestedService?, suggestedBudget? }` — suggestions must be existing `serviceSlugs` / budget enum values or omitted (never free strings)

### Guardrails

- System prompt forbids inventing prices, timelines, guarantees, or legal claims
- If visitor asks for a quote in free text answers, respond with ballpark language pointing to `/pricing` / book a call — never a custom number
- No sitewide floating widget; contact-page composition only
- Feature flag off → control hidden; form works exactly as today

### Plug-in points

- [`src/app/(site)/contact/components/contact-form.tsx`](<../../../src/app/(site)/contact/components/contact-form.tsx>)
- New: `src/components/contact/brief-assistant.tsx` (client)
- New: `src/app/api/ai/brief/route.ts`
- Existing submit: [`src/app/api/contact/route.ts`](../../../src/app/api/contact/route.ts) — **no behavior change** required for submit

### Testing

- Unit: output schema rejects invented budget strings; rate-limit blocks burst
- Component: assistant fills message; user can edit before submit
- Mock AI in CI

### Out of scope (Phase 2)

- RAG over docs, Calendly booking agent, service-fit quiz as separate surface (can reuse prompts later)
- Portal document Q&A

---

## Error handling

| Failure                                          | Behavior                                                |
| ------------------------------------------------ | ------------------------------------------------------- |
| Missing `AI_GATEWAY_API_KEY` or feature flag off | Hide AI CTAs; actions return clear error                |
| Model/provider error                             | Surface toast/inline error; leave form/inbox usable     |
| Resend failure on Approve                        | Error only; draft remains editable                      |
| Public rate limit                                | 429 + short message; contact form still usable manually |
| Hallucination risk (pricing)                     | Prompt + schema constraints; public disclaimer          |

## Privacy & contracts

- Align with [`docs/contracts/05-ai-rider.md`](../../contracts/05-ai-rider.md) HITL posture for anything we sell
- Public brief: treat answers as contact PII — same retention mindset as contact submissions; do not log full prompts in app logs
- Admin drafts: submission content already in DB; draft body ephemeral until send

## Explicit non-goals

- Sitewide chatbot / Intercom-style widget
- Unrestricted AI auto-reply
- Full RAG / agent platform
- n8n-hosted LLM for interactive UX
- Contract pack auto-fill (later, heavy HITL)
- Invented pricing estimator

## Success criteria

1. Phase 0: Health/env shows AI ready; one successful generate in staging
2. Phase 1: Founder can Approve & Send a warm reply from inbox without mailto
3. Phase 2: Visitor can produce an editable brief on contact; submissions still land in inbox as today
4. Zero freeform emails leave the system without an explicit Approve (admin) or visitor Submit (public)
5. Hire signal unchanged: if Approves alone exceed ~30–60 min/day, hire — don’t build more AI

## Follow-ons (not this spec)

Ranked backlog after Phases 0–2:

1. Today ops brief (UI-only from `collectLoops`)
2. Outbound Instantly one-line personalization (Approve before export/API)
3. Invoice cover-note draft on send
4. Service Fit Navigator on `/services`
5. Grounded Ask on `/services/ai-solutions` only (first RAG candidate)
