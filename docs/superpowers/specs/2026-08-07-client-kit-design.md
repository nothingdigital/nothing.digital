# Client Kit — Design Spec

> **Status:** Approved (Approach 1) · **Date:** 2026-08-07  
> **Goal:** Make this app redeployable for other clients later without a rewrite.  
> **Not now:** Full template extraction, self-serve wizard, multi-tenant hosting.

## Problem

Nothing.Digital is one branded Next.js app. Brand, copy, and admin features are mostly hardcoded. Selling the same frame to other businesses needs a **one-step launch path** (you first, self-serve later) with placeholder content and opt-in admin modules.

## Decisions

| Decision      | Choice                                                                |
| ------------- | --------------------------------------------------------------------- |
| Approach      | Phased client kit (Approach 1)                                        |
| Hosting       | Separate Vercel + Supabase per client; seams allow multi-tenant later |
| Modules       | Core site always; admin modules opt-in                                |
| Customization | Brand config for first launch; admin UI later                         |
| Launch UX     | `create-client` script + setup doc now; onboarding wizard later       |
| Monorepo      | Defer (Approach 2) until fork/shared-fix pain; keep folder seams      |

## Architecture

```text
src/brand/          ← single brand + module contract (extractable later as @nd/brand-kit)
  config.ts         ← name, tagline, emails, phones, asset paths, fromEmail
  modules.ts        ← ModuleId + enabled flags
  theme.css         ← optional pointer; tokens stay in globals.css for now
  index.ts          ← public API

Public site         ← always on; reads brand config only
Admin modules       ← gated by modules.ts (nav + route guard)
Client pack (later) ← lorem content + brand overrides + env checklist
```

### Module IDs (v1)

| ID           | Covers                                         | Default (ND) |
| ------------ | ---------------------------------------------- | ------------ |
| `core`       | Public site, contact, auth shell               | always on    |
| `inbox`      | `/admin/inbox` + contact CRM                   | on           |
| `clients`    | `/admin/clients`                               | on           |
| `billing`    | `/admin/billing` + invoice flows               | on           |
| `work`       | `/admin/work`                                  | on           |
| `newsletter` | `/admin/newsletter` + Listmonk APIs            | on           |
| `outbound`   | `/admin/outbound` + lead-finder                | on           |
| `health`     | `/admin/health`                                | on           |
| `docs`       | `/admin/docs` KB                               | on           |
| `ai`         | AI flags still env-gated; module master switch | on           |

Home, settings, system-map, login stay available whenever any admin module is on.

### Brand config contract

```ts
type BrandConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string; // from NEXT_PUBLIC_SITE_URL
  email: string;
  contactEmail: string;
  phone: string;
  fromEmail: string; // Resend "Name <addr>"
  assets: {
    wordmarkLight: string;
    wordmarkDark: string;
    seal: string;
    ogDefault: string;
  };
};
```

`src/lib/site.ts` re-exports brand for backward compatibility.

### Later phases (out of this implementation)

1. **Template pack** — lorem `services`/`pricing`/MDX + placeholder assets
2. **`pnpm create-client <slug>`** — copy pack, write brand file, print env checklist
3. **Admin brand settings UI** — edit brand after deploy
4. **Onboarding wizard** — self-serve path
5. **Package extraction** — move `src/brand` + modules → pnpm packages when needed
6. **Multi-tenant** — domain → brand row (only after packages stabilize)

## Implementation scope (this pass)

1. Add `src/brand/` contract + ND defaults
2. Module registry + filter admin nav + soft route guard
3. Point `site.ts` + email `FROM` helper at brand config
4. Docs: client-kit guide + condense agent entry docs
5. Stub create-client checklist (script or markdown) — no full scaffolder yet

## Non-goals

- Migrating every hardcoded “Nothing.Digital” string in one PR
- Multi-tenant runtime
- Stripping ND-specific outbound/AI from this repo’s default
- Committing secrets or cloning Vercel projects automatically

## Success criteria

- New agent can read `docs/README.md` → know brand/modules live in `src/brand/`
- Disabling `outbound` hides nav link and blocks `/admin/outbound`
- Brand name/tagline/emails change in one file and flow through `siteConfig`
- Spec documents the path to Approach 2 without requiring it now
