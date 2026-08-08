# Client Kit Phase 0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a brand + module contract so the app can later be redeployed for other clients without a rewrite.

**Architecture:** `src/brand/` owns brand config and module flags. Admin nav and a layout guard respect modules. `site.ts` re-exports brand. Docs explain the kit and stay short for agents. No commits unless the user asks.

**Tech Stack:** Next.js 15 App Router, TypeScript, Vitest, existing admin patterns.

**Spec:** [`docs/superpowers/specs/2026-08-07-client-kit-design.md`](../specs/2026-08-07-client-kit-design.md)

---

### Task 1: Brand config + module registry

**Files:**

- Create: `src/brand/config.ts`
- Create: `src/brand/modules.ts`
- Create: `src/brand/index.ts`
- Create: `src/brand/modules.test.ts`
- Create: `src/brand/config.test.ts`
- Modify: `src/lib/site.ts`

- [ ] **Step 1: Write failing module tests**

```ts
// src/brand/modules.test.ts
import { describe, expect, it } from "vitest";
import {
  DEFAULT_MODULES,
  isModuleEnabled,
  type ModuleId,
  withModules,
} from "./modules";

describe("modules", () => {
  it("enables all default ND modules", () => {
    expect(isModuleEnabled("outbound")).toBe(true);
    expect(isModuleEnabled("inbox")).toBe(true);
  });

  it("disables a module when overridden", () => {
    const flags = withModules({ outbound: false });
    expect(isModuleEnabled("outbound", flags)).toBe(false);
    expect(isModuleEnabled("inbox", flags)).toBe(true);
  });

  it("treats core as always on", () => {
    const flags = withModules({ core: false } as Partial<
      Record<ModuleId, boolean>
    >);
    expect(isModuleEnabled("core", flags)).toBe(true);
  });

  it("DEFAULT_MODULES matches expected keys", () => {
    expect(DEFAULT_MODULES).toMatchObject({
      core: true,
      inbox: true,
      clients: true,
      billing: true,
      work: true,
      newsletter: true,
      outbound: true,
      health: true,
      docs: true,
      ai: true,
    });
  });
});
```

```ts
// src/brand/config.test.ts
import { describe, expect, it } from "vitest";
import { brandConfig } from "./config";

describe("brandConfig", () => {
  it("exposes Nothing.Digital defaults", () => {
    expect(brandConfig.name).toBe("Nothing.Digital");
    expect(brandConfig.email).toContain("@");
    expect(brandConfig.fromEmail).toContain(brandConfig.name);
    expect(brandConfig.assets.wordmarkLight).toMatch(/^\/images\//);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `pnpm exec vitest run src/brand/modules.test.ts src/brand/config.test.ts`  
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement brand + modules**

```ts
// src/brand/config.ts
export type BrandAssets = {
  wordmarkLight: string;
  wordmarkDark: string;
  seal: string;
  ogDefault: string;
};

export type BrandConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  contactEmail: string;
  phone: string;
  fromEmail: string;
  assets: BrandAssets;
};

export const brandConfig: BrandConfig = {
  name: "Nothing.Digital",
  tagline: "Ship premium digital products on time—every time.",
  description:
    "Senior web, software, and AI development studio. Custom websites, software, apps, email marketing, AI solutions, tech literacy, and coding & SQL — delivered on fixed timelines.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nothing.digital",
  email: "hello@nothing.digital",
  contactEmail: "alexander@nothing.digital",
  phone: "205-561-7049",
  fromEmail: "Nothing.Digital <hello@nothing.digital>",
  assets: {
    wordmarkLight: "/images/brand/wordmark-light.png",
    wordmarkDark: "/images/brand/wordmark-dark.png",
    seal: "/images/brand/seal.png",
    ogDefault: "/og/default.png",
  },
};
```

```ts
// src/brand/modules.ts
export const MODULE_IDS = [
  "core",
  "inbox",
  "clients",
  "billing",
  "work",
  "newsletter",
  "outbound",
  "health",
  "docs",
  "ai",
] as const;

export type ModuleId = (typeof MODULE_IDS)[number];

export type ModuleFlags = Record<ModuleId, boolean>;

export const DEFAULT_MODULES: ModuleFlags = {
  core: true,
  inbox: true,
  clients: true,
  billing: true,
  work: true,
  newsletter: true,
  outbound: true,
  health: true,
  docs: true,
  ai: true,
};

/** Merge overrides; `core` cannot be disabled. */
export function withModules(
  overrides: Partial<ModuleFlags> = {},
  base: ModuleFlags = DEFAULT_MODULES,
): ModuleFlags {
  return { ...base, ...overrides, core: true };
}

export function isModuleEnabled(
  id: ModuleId,
  flags: ModuleFlags = DEFAULT_MODULES,
): boolean {
  if (id === "core") return true;
  return flags[id] === true;
}

/** Map admin path prefix → module (null = always allowed when admin). */
export function moduleForAdminPath(pathname: string): ModuleId | null {
  if (pathname.startsWith("/admin/inbox")) return "inbox";
  if (pathname.startsWith("/admin/outbound")) return "outbound";
  if (pathname.startsWith("/admin/clients")) return "clients";
  if (pathname.startsWith("/admin/billing")) return "billing";
  if (pathname.startsWith("/admin/work")) return "work";
  if (pathname.startsWith("/admin/newsletter")) return "newsletter";
  if (pathname.startsWith("/admin/health")) return "health";
  if (pathname.startsWith("/admin/docs")) return "docs";
  return null;
}
```

```ts
// src/brand/index.ts
export { brandConfig, type BrandConfig, type BrandAssets } from "./config";
export {
  DEFAULT_MODULES,
  MODULE_IDS,
  isModuleEnabled,
  moduleForAdminPath,
  withModules,
  type ModuleFlags,
  type ModuleId,
} from "./modules";
```

```ts
// src/lib/site.ts
import { brandConfig } from "@/brand";

export const siteConfig = {
  name: brandConfig.name,
  tagline: brandConfig.tagline,
  description: brandConfig.description,
  url: brandConfig.url,
  email: brandConfig.email,
  contactEmail: brandConfig.contactEmail,
  phone: brandConfig.phone,
} as const;

export interface SocialLink {
  label: string;
  href: string;
}

/** Populate only with verified accounts. Empty = no footer icons, empty sameAs. */
export const socialLinks: SocialLink[] = [];

export const sameAs = socialLinks.map((link) => link.href);
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `pnpm exec vitest run src/brand/`  
Expected: PASS

- [ ] **Step 5: Do not commit** (user commits on request)

---

### Task 2: Gate admin nav + routes by modules

**Files:**

- Modify: `src/components/admin/admin-nav.tsx`
- Create: `src/lib/brand/get-modules.ts` (or keep reading `DEFAULT_MODULES` from `@/brand` until env overrides exist)
- Create: `src/components/admin/module-gate.tsx`
- Modify: `src/app/admin/layout.tsx` (read existing first; wrap children or add gate in page layouts)
- Create: `src/brand/module-for-admin-path.test.ts` (if not covered in Task 1)
- Modify: `src/components/admin/admin-nav.tsx` — add `module` field per link

- [ ] **Step 1: Extend path mapping tests**

Add to `src/brand/modules.test.ts`:

```ts
import { moduleForAdminPath } from "./modules";

it("maps admin paths to modules", () => {
  expect(moduleForAdminPath("/admin/outbound")).toBe("outbound");
  expect(moduleForAdminPath("/admin/outbound/foo")).toBe("outbound");
  expect(moduleForAdminPath("/admin")).toBeNull();
  expect(moduleForAdminPath("/admin/settings")).toBeNull();
});
```

- [ ] **Step 2: Update AdminNav to filter by module**

```tsx
// src/components/admin/admin-nav.tsx — replace links const
import { isModuleEnabled, type ModuleId } from "@/brand";

const links: {
  href: string;
  label: string;
  exact?: boolean;
  module?: ModuleId;
}[] = [
  { href: "/admin", label: "Home", exact: true },
  { href: "/admin/inbox", label: "Inbox", module: "inbox" },
  { href: "/admin/outbound", label: "Outbound", module: "outbound" },
  { href: "/admin/clients", label: "Clients", module: "clients" },
  { href: "/admin/billing", label: "Billing", module: "billing" },
  { href: "/admin/work", label: "Work", module: "work" },
  { href: "/admin/newsletter", label: "Newsletter", module: "newsletter" },
  { href: "/admin/health", label: "Health", module: "health" },
  { href: "/admin/docs", label: "Docs", module: "docs" },
  { href: "/admin/system-map", label: "System map" },
  { href: "/admin/settings", label: "Settings" },
];

// In map: filter first
links
  .filter((link) => !link.module || isModuleEnabled(link.module))
  .map(...)
```

- [ ] **Step 3: Add ModuleGate for admin segment**

Read `src/app/admin/layout.tsx`. If it is a server layout, add a client or server gate:

```tsx
// src/components/admin/module-gate.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DEFAULT_MODULES, isModuleEnabled, moduleForAdminPath } from "@/brand";

export function ModuleGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const moduleId = moduleForAdminPath(pathname);
  if (moduleId && !isModuleEnabled(moduleId, DEFAULT_MODULES)) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-sm text-muted-foreground">
          This module is disabled for this deployment.
        </p>
        <Link href="/admin" className="text-sm font-medium underline">
          Back to admin home
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
```

Wrap `{children}` in admin layout with `<ModuleGate>`.

- [ ] **Step 4: Smoke-check**

Run: `pnpm exec vitest run src/brand/`  
Run: `pnpm exec tsc --noEmit` (or project’s typecheck script)  
Expected: pass

- [ ] **Step 5: Do not commit**

---

### Task 3: Brand fromEmail helper for mail sends

**Files:**

- Create: `src/brand/email.ts` with `getFromEmail()`
- Grep and replace hardcoded `Nothing.Digital <hello@` in API routes / email sends to use `brandConfig.fromEmail` or `getFromEmail()`
- Touch only clear string literals for FROM — do not rewrite all copy

- [ ] **Step 1: Find FROM literals**

Run: `rg -n 'Nothing\\.Digital <' src`

- [ ] **Step 2: Centralize**

```ts
// src/brand/email.ts
import { brandConfig } from "./config";

export function getFromEmail(): string {
  return brandConfig.fromEmail;
}
```

Export from `src/brand/index.ts`. Replace each FROM literal with `getFromEmail()`.

- [ ] **Step 3: Run related tests**

Run: `pnpm exec vitest run src/app/api/contact src/lib/email`  
Expected: pass (update mocks if they assert old string — still `"Nothing.Digital <hello@nothing.digital>"`)

- [ ] **Step 4: Do not commit**

---

### Task 4: Agent docs + client-kit guide

**Files:**

- Create: `docs/client-kit.md`
- Create: `AGENTS.md` (repo root)
- Modify: `docs/README.md` — shorten; point to AGENTS + client-kit + SYSTEM-MAP
- Modify: `docs/SYSTEM-MAP.md` — add short § on brand/modules; trim agent spin-up to point at `AGENTS.md`
- Create: `docs/runbooks/create-client-checklist.md` (stub for future script)

- [ ] **Step 1: Write `AGENTS.md`** (keep under ~40 lines)

Must include: read order (SCRATCHPAD → AGENTS → SYSTEM-MAP → topic docs), brand at `src/brand/`, no invent roadmap, commit only when asked, archives are historical.

- [ ] **Step 2: Write `docs/client-kit.md`**

Cover: Approach 1 summary, how to change brand, how to disable a module, later phases (template, create-client, wizard, packages), link to spec.

- [ ] **Step 3: Tighten `docs/README.md`**

One table: purpose → path. Link client-kit. Drop duplication with SYSTEM-MAP.

- [ ] **Step 4: Patch SYSTEM-MAP §1**

Replace long paste prompt with: “See `/AGENTS.md`”. Add 5-line “Brand & modules” under big picture pointing at `src/brand/` + `docs/client-kit.md`.

- [ ] **Step 5: Checklist stub**

`docs/runbooks/create-client-checklist.md`: domain, Vercel, Supabase, Resend, brand file, modules, assets, CSP — checkboxes only.

- [ ] **Step 6: Do not commit**

---

### Task 5: Verify + self-review

- [ ] **Step 1:** `pnpm exec vitest run src/brand src/lib/admin/config.test.ts src/components/organisms/footer.test.tsx`
- [ ] **Step 2:** `pnpm lint` and `pnpm typecheck` (use scripts from `package.json`)
- [ ] **Step 3:** Confirm disabling outbound in `DEFAULT_MODULES` would hide nav (manual read of code path)
- [ ] **Step 4:** Spec coverage check against design doc
- [ ] **Step 5:** Do not commit — report summary to user

---

## Out of scope (later plans)

- `pnpm create-client` scaffolder
- Lorem content pack / template repo
- Admin UI for brand editing
- Monorepo packages
- Multi-tenant by domain
