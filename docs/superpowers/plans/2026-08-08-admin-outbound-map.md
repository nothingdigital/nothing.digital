# Admin Outbound Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Map UI at `/admin/outbound/map` to search local businesses and add pins into `lead_candidates` for Instantly export.

**Architecture:** MapLibre + server Places (shared with lead-finder CLI). Pins are `lead_candidates` with lat/lng. Center: Berry, AL (Cripple Creek Rd).

**Tech Stack:** Next.js 15, MapLibre GL, Google Places Text Search (server), Supabase, Vitest.

**Spec:** [`../specs/2026-08-08-admin-outbound-map-design.md`](../specs/2026-08-08-admin-outbound-map-design.md)

---

### Task 1: Migration + types

- Create: `supabase/migrations/009_lead_geo.sql`
- Modify: `src/lib/supabase/database.ts`

### Task 2: Shared Places + map center

- Create: `src/lib/leads/map-center.ts`, `src/lib/leads/places.ts`, tests
- Modify: `scripts/lead-finder/places.ts` to re-export / call shared search

### Task 3: Search API + add action

- Create: `src/app/api/admin/outbound/map/search/route.ts`
- Modify: `src/app/admin/outbound/actions.ts`, `src/lib/admin/outbound/queries.ts`

### Task 4: Map UI

- Create: map page + client MapLibre component
- Modify: outbound list page link; install `maplibre-gl`

### Task 5: Docs

- SYSTEM-MAP, outbound-pilot, SCRATCHPAD
