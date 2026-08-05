# Deploy Fix — Scratchpad

## Current state

- Goal: Redeploy the latest `main` to `https://nothing.digital`.
- Status: Repo is now public, but live site still serves old CSS hash; GitHub Actions still fails with Vercel credentials.
- Current step: Determine whether Vercel Git integration is connected and why it did not auto-deploy.
- Next action: Check Vercel project Git settings; if disconnected, connect it. If connected, fix the token/ID secrets for GitHub Actions.
- Updated: 2026-08-05

## Plan

1. ✅ Make GitHub repo public.
2. ✅ Push empty commit to trigger redeploy.
3. ⬜ Verify Vercel project Git integration is connected to `nothingdigital/nothing.digital`.
4. ⬜ If connected: inspect Vercel deployment status for the latest commit.
5. ⬜ If not connected: connect repo in Vercel dashboard.
6. ⬜ If Git integration still fails: regenerate Vercel token with full account/team scope and update GitHub secrets.
7. ⬜ Verify live site shows clock theme and new CSS hash.

## Decisions

- Prefer Vercel Git integration over GitHub Actions if it is available — less credential management.
- GitHub Actions can be removed later once Git integration is confirmed working.

## Dead ends

- Changing repo visibility alone did not trigger a new deployment.

## Progress log

- 2026-08-05: Repo changed to public via GitHub settings.
- 2026-08-05: Empty commit `2f185dc` pushed; live site still on old build (`b2d6394a168d128a.css`).
- 2026-08-05: GitHub Actions still failing with Vercel `Project not found`.
