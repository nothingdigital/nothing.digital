# Create-client checklist

Manual deploy for a new client brand. Full `pnpm create-client` scaffolder comes later. Guide: [`../client-kit.md`](../client-kit.md).

- [ ] Domain + DNS pointed at Vercel
- [ ] Vercel project created / linked
- [ ] Supabase project created
- [ ] Supabase migrations applied (`supabase/migrations/`)
- [ ] Auth redirects set (site URL + `/admin`, `/portal` callbacks)
- [ ] Resend domain verified + FROM matches brand
- [ ] Brand config edited (`src/brand/config.ts`)
- [ ] Brand assets in `public/` (wordmarks, seal, OG)
- [ ] Module flags set (`src/brand/modules.ts` `DEFAULT_MODULES`)
- [ ] CSP / image hosts updated in `next.config.mjs` if needed
- [ ] Env filled from `.env.example` → Vercel + local
- [ ] Smoke: contact form send
- [ ] Smoke: admin login (`ADMIN_EMAILS`)
