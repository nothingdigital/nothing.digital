# AI Follow-ons (2026-08-07)

> **Parent design:** [`../specs/2026-08-06-ai-integration-design.md`](../specs/2026-08-06-ai-integration-design.md)  
> **Board:** [`../../../SCRATCHPAD.md`](../../../SCRATCHPAD.md)

## Goal

Ship three HITL admin AI surfaces: today ops brief, invoice cover-note, outbound personalization line — all gated, no auto-send/email from AI.

## Flags (all need `AI_GATEWAY_API_KEY`)

- `AI_OPS_BRIEF_ENABLED`
- `AI_INVOICE_COVER_ENABLED`
- `AI_OUTBOUND_PERSONALIZATION_ENABLED`

## Migration

`supabase/migrations/007_lead_personalization.sql` — `lead_candidates.personalization` text column.

## Smoke checklist

1. **Ops brief** — flag on: draft/edit on `/admin`; flag off: panel hidden.
2. **Invoice HITL** — flag on: Draft → Approve & Send stamps `sent_emailed_at`; flag off: Send invoice email (no AI) works for stranded sent rows.
3. **Outbound** — flag on: draft/save personalization, Instantly CSV includes column and skips empty; flag off: legacy CSV, no personalization gate.

## Out of scope

Secretary · n8n · Shlink · Kuma · case studies · Instantly API · RAG · auto-reply
