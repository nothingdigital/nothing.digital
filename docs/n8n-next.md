# n8n Setup and Fan-Out Implementation

**Date:** 2026-08-06  
**Status:** Code ready (notifyN8n in lib/n8n.ts, env-gated, never blocks). Pod + workflow pending.
**Goal:** n8n for fan-out from contact/newsletter to Slack, optional bookings table, without blocking the critical path (201 always).

**YAGNI:** only if Slack/Listmonk fan-out volume >10/day or secretary needs automation. Otherwise, Resend + manual is sufficient. Pod ~$4-5/mo.

## Steps for Pod (PikaPods)

1. Login to PikaPods, create n8n pod (0.5 CPU/0.5GB RAM sufficient for low volume).
2. Set custom domain `automation.nothing.digital` (CNAME to the pod IP or the PikaPods domain).
3. Set env in pod: WEBHOOK_SECRET (random 32 char), other for Supabase if used for bookings.
4. Open the n8n dashboard, set the webhook URL in Vercel as `https://automation.nothing.digital/webhook/contact` or the workflow URL.
5. Set `N8N_WEBHOOK_SECRET` in Vercel for the X-N8N-Secret header.
6. Set `N8N_DASHBOARD_URL` in Vercel for the admin link in /admin/settings and health.
7. Update `.env.example` and ops-credentials.md with the vars.
8. Test: submit contact form, see the webhook in n8n executions.

## Workflow Examples in n8n

- **Contact Fan-Out:** Webhook trigger → parse payload (name, email, message, service) → Slack node to #ops with formatted message + link to /admin/inbox → optional Supabase node to insert in bookings with status 'lead' → email confirmation if needed.
- **Newsletter Fan-Out:** Webhook from /api/newsletter → add to Listmonk list if not, Slack notification for new subscriber.
- Guard: if n8n down, the notifyN8n catches error, logs, continues (ponytail: never blocks 201).
- Use n8n nodes for Supabase, Slack, Resend. No custom code in n8n if possible.

## Code Changes (already ready or min)

- lib/n8n.ts: the notifyN8n with fetch, secret, error only (done).
- api/contact/route.ts and newsletter/route.ts: the void notifyN8n call after success (done).
- admin/settings/page.tsx and health/page.tsx: add the n8n dashboard link if env set (add to getAdminToolLinks in config.ts).
- env.ts: isN8nConfigured = !!env.private.N8N_WEBHOOK_URL
- Health: add n8n to the integrations if key present.
- Test: extend api/contact/route.test.ts and newsletter with n8n mock.

## Runbook Updates

- Update `docs/runbooks/monitoring.md` with n8n dashboard link, execution monitoring, kill switch (unset webhook url).
- Update `docs/runbooks/client-ops.md` with n8n fan-out for leads to Slack.
- Update `plans/05-pikapods-integrations.md` with [x] for n8n code, pod pending volume.
- Update master with n8n in phase 6 status.

## Measurement

- Umami event on n8n trigger.
- Monitor n8n executions for success rate >95%.
- If >10/day, keep pod; else delete and use manual.

## Risks

- n8n down: logs error, no blocking.
- Spam in Slack: filter in workflow.
- Cost: $4-5/mo, delete pod if not used.

**Pitch Deck Slide:** "Automation without bloat: n8n for fan-out only when volume justifies ($4/mo). Code ready, pod on demand. Zero blocking on critical path."

**Next after n8n:** Kuma if UptimeRobot insufficient, full secretary CRM on hire, Lighthouse CI verification in PR.

**Execute:** 1. Pod in PikaPods. 2. Workflow for contact to Slack. 3. Env in Vercel. 4. Test form. 5. Update docs + health link. 6. Commit. Run `pnpm lint && pnpm type-check && pnpm test` before push.

ponytail: code is no-op if no env. Pod only on volume. Min workflow with existing nodes. Delete if no lift after 30d. This doc is the plan - no diagrams.

Updated: 2026-08-06. Link in master + growth-tactics. Commit after pod/test.

#ponytail: n8n only if fan-out pain. Otherwise Resend + manual. Measure executions vs manual effort.
