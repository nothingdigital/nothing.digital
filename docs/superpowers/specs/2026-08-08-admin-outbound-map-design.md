# Admin Outbound Map — Design Spec

> **Status:** Approved · **Date:** 2026-08-08  
> **Goal:** Find local businesses on a map and add them as pins into the outbound sales queue.  
> **Not now:** Hunter enrich on map, Instantly API, Google Maps JS, separate pins table.

## Problem

Lead discovery is CLI-only (`pnpm lead-finder` → CSV → `/admin/outbound`). Operators want a map to search an area, drop pins on businesses, and push them into the same Instantly review path.

## Decisions

| Decision  | Choice                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------- |
| Job       | Discover + pin into outbound in one flow                                                       |
| Discovery | Search this area (Places) + manual pin fallback                                                |
| Stack     | MapLibre + OSM tiles; Places server-only (reuse lead-finder)                                   |
| Storage   | Reuse `lead_candidates` (+ `lat`/`lng`); no second table                                       |
| Route     | `/admin/outbound/map` under existing `outbound` module                                         |
| Center    | 11628 Cripple Creek Road, Berry, AL 35546 (approx town coords until precise geocode available) |
| CLI       | Keep `pnpm lead-finder`; share Places helpers                                                  |

## Architecture

```text
/admin/outbound/map
  → POST /api/admin/outbound/map/search  (Places, bounds + query)
  → addLeadFromMapAction                 (insert lead_candidates)
  → existing review + Instantly CSV export
```

- Places key (`GOOGLE_PLACES_API_KEY`) stays server-only (Vercel + local CLI).
- Preview pins = search results not yet saved; saved pins = rows with lat/lng.
- Dedupe by `place_id`; respect `do_not_contact`.

## UI

- Full-bleed map; top bar: query, vertical preset, Search this area, Drop pin, link to Outbound list.
- Status-colored saved pins; distinct preview pins; detail sheet with Add to outbound.
- Already-in-queue `place_id` → “In queue” (no duplicate).

## Non-goals

Clustering polish, routing, bulk-select hundreds, Hunter on map, Instantly send from map, Google Maps JS, multi-tenant map centers UI.

## Success criteria

1. Admin can search Berry area businesses and see preview pins.
2. Add creates a `lead_candidates` row with lat/lng visible as a saved pin.
3. Added leads appear on `/admin/outbound` for approve → Instantly CSV.
4. Missing Places key shows a clear empty state (no key leak).
