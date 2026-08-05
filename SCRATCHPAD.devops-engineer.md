# SCRATCHPAD — DevOps Engineer (Phase 1)

## Current state

- Goal: Repository setup, CI/CD, env templates, Sentry stubs, monitoring docs, pre-commit hooks.
- Status: Complete.
- Current step: Final summary.
- Next action: Report to user.
- Updated: 2026-08-04

## Plan

- [x] Create `.github/` templates (CODEOWNERS, PR template, issue templates, dependabot).
- [x] Create CI/CD workflows (PR validation, production deploy, preview deploy).
- [x] Create `lighthouserc.json` with QA budgets.
- [x] Create `.env.example` and `.env.local.example` with Section 3.2 vars.
- [x] Verify `lint-staged` in `package.json`; configure Husky pre-commit hook.
- [x] Create Sentry config stubs (client/server/edge) with conditional init.
- [x] Create `docs/runbooks/monitoring.md` placeholder.
- [x] Create `infra/cloudflare/security-headers.md` summarizing current headers.
- [x] Update `plans/phase-1-checklist.md`: mark DevOps-owned items done; note external-only blockers.
- [x] Run `pnpm type-check` and `pnpm lint`; fix introduced errors.

## Decisions

- Keep existing `next.config.mjs` headers; document them rather than duplicate in Cloudflare docs.
- Use `vercel/action-deploy@v1` per DevOps plan (production + preview workflows).
- Lighthouse CI uses `startServerCommand: pnpm start` after build; budgets copied from QA plan.
- Sentry init only when `SENTRY_DSN` is present to keep local dev clean without DSN.
- `.env.local.example` is for local secrets; `.env.example` is for shared/non-secret vars per plan convention.

## Dead ends

- None yet.

## Progress log

- 2026-08-04: Read plans and base project files; scratchpad created.
- 2026-08-04: Created all GitHub templates, workflows, dependabot config, lighthouserc, env templates, Sentry stubs, monitoring docs, security headers doc, Husky hook.
- 2026-08-04: Added `test:ci` script to `package.json` and a minimal `src/lib/utils.test.ts` so the PR validation test job has a green target.
- 2026-08-04: Ran `pnpm type-check`, `pnpm lint`, `pnpm test:ci`, and `pnpm prepare` — all passed.
- 2026-08-04: Updated `plans/phase-1-checklist.md` with DevOps-owned items marked done and external-only blockers noted.
