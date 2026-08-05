# Deploy Fix — Scratchpad

## Current state

- Goal: Redeploy the latest `main` to `https://nothing.digital`.
- Status: ✅ Site redeployed successfully via Vercel Git integration after making the repo public.
- Current step: Remove the now-redundant and failing GitHub Actions deploy workflows.
- Next action: Delete `.github/workflows/deploy-production.yml` and `.github/workflows/deploy-preview.yml`, keep PR validation.
- Updated: 2026-08-05

## Plan

1. ✅ Make GitHub repo public.
2. ✅ Push empty commit to trigger redeploy.
3. ✅ Confirm Vercel Git integration auto-deploys (`/css/ef14d8485819bf07.css`, hero shows “Built on time”).
4. ⬜ Remove failing CLI-based `deploy-production.yml` and `deploy-preview.yml` workflows.
5. ⬜ Commit and push cleanup.
6. ⬜ Verify no failing workflow noise on future pushes.

## Decisions

- Use Vercel Git integration for deploys; it is already working and avoids token/org-ID issues.
- Keep `pr-validation.yml` for type-check/lint/tests.

## Dead ends

- GitHub Actions CLI deploy will keep failing because the stored Vercel token/IDs are mismatched; removing it is cleaner than debugging credentials for a path we do not need.

## Progress log

- 2026-08-05: Repo changed to public; Vercel Git integration unblocked.
- 2026-08-05: Site redeployed with clock theme and cream text.
- 2026-08-05: Live `https://nothing.digital` confirmed updated.
