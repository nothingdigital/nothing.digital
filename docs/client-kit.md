# Client Kit

Redeploy this app for other clients later without a rewrite. **Approach 1:** separate Vercel + Supabase per client; brand/modules in-repo. Full template pack / scaffolder / multi-tenant come later.

**Spec:** [`superpowers/specs/2026-08-07-client-kit-design.md`](./superpowers/specs/2026-08-07-client-kit-design.md)  
**Checklist:** [`runbooks/create-client-checklist.md`](./runbooks/create-client-checklist.md)

## Change brand

Edit [`src/brand/config.ts`](../src/brand/config.ts):

| Field                            | Notes                                       |
| -------------------------------- | ------------------------------------------- |
| `name`, `tagline`, `description` | Site identity                               |
| `url`                            | Defaults from `NEXT_PUBLIC_SITE_URL`        |
| `email`, `contactEmail`, `phone` | Contact surfaces                            |
| `fromEmail`                      | Resend `Name <addr>`                        |
| `assets.*`                       | Paths under `public/` (wordmarks, seal, OG) |

`src/lib/site.ts` re-exports brand for existing callers.

## Disable modules

Edit `DEFAULT_MODULES` in [`src/brand/modules.ts`](../src/brand/modules.ts). `core` stays on.

Disabled modules drop from admin nav and soft-block their `/admin/*` pages (server `ModuleGate`). **APIs/actions are not fully gated yet** — treat module flags as deploy-time product shape; harden API guards in a later pass.

| ID           | Covers                                       |
| ------------ | -------------------------------------------- |
| `core`       | Public site, contact, auth shell (always on) |
| `inbox`      | `/admin/inbox`                               |
| `clients`    | `/admin/clients`                             |
| `billing`    | `/admin/billing`                             |
| `work`       | `/admin/work`                                |
| `newsletter` | `/admin/newsletter` + Listmonk APIs          |
| `outbound`   | `/admin/outbound`                            |
| `health`     | `/admin/health`                              |
| `docs`       | `/admin/docs`                                |
| `ai`         | AI master switch (env flags still required)  |

## Later phases

1. Template pack (lorem content + placeholder assets)
2. `pnpm create-client` scaffolder
3. Admin brand settings UI
4. Onboarding wizard
5. Package extraction (`@nd/brand-kit`)
6. Multi-tenant by domain
