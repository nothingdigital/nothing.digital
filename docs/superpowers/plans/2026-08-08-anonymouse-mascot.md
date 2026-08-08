# Anonymouse Mascot Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Quiet Clever + Friendly Anonymouse brand assets and wire Quiet Clever into light site usage.

**Architecture:** Assets live under `public/images/brand/`. Paths exposed via `src/brand/config.ts`. A small presentational atom renders the chosen expression. About + 404 use Quiet Clever; Friendly is available for later social use.

**Tech Stack:** Next.js Image, brand config, generated PNGs

---

### Task 1: Spec already written

**Files:**

- Create: `docs/superpowers/specs/2026-08-08-anonymouse-mascot-design.md`

- [x] **Step 1: Design approved in chat; spec filed**

### Task 2: Generate assets

**Files:**

- Create: `public/images/brand/anonymouse-quiet.png`
- Create: `public/images/brand/anonymouse-friendly.png`
- Keep: `public/images/brand/anonymouse.png` (legacy reference; do not delete)

- [x] **Step 1: Generate Quiet Clever PNG from brief + reference**
- [x] **Step 2: Generate Friendly PNG (same character, smile + wave)**
- [x] **Step 3: Copy outputs into `public/images/brand/`**

### Task 3: Brand config + atom

**Files:**

- Modify: `src/brand/config.ts`
- Modify: `src/brand/config.test.ts`
- Create: `src/components/atoms/brand-mascot.tsx`

- [x] **Step 1: Extend `BrandAssets` with `mascotQuiet` + `mascotFriendly`**
- [x] **Step 2: Update config test to assert mascot paths**
- [x] **Step 3: Add `BrandMascot` atom (`expression: "quiet" | "friendly"`)**

### Task 4: Site usage

**Files:**

- Modify: `src/app/(site)/about/page.tsx`
- Modify: `src/app/not-found.tsx`

- [x] **Step 1: About story section — Quiet Clever beside copy**
- [x] **Step 2: 404 — Quiet Clever instead of pixel terminal**

### Task 5: Docs board

- [x] **Step 1: Skip SCRATCHPAD — mascot does not block ops**
