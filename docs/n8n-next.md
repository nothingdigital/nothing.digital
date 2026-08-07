# n8n Next Steps (Pod is up)

**Pod up:** Use the dashboard URL to create workflows. Env in Vercel for the webhook.

**What to do:**

1. In n8n dashboard, create workflow for contact:
   - Webhook trigger (POST, path `/webhook/contact`)
   - Function or Set node to format message: `New lead from ${payload.name} (${payload.email}): ${payload.message} (service: ${payload.service})`
   - Slack node to #ops channel with the formatted text + link to /admin/inbox
   - Optional: Supabase node to insert into bookings with status 'lead', client from name/email.
   - Respond with 200 to the webhook.
2. Similar for newsletter: webhook /webhook/newsletter, add to Listmonk, Slack for new subscriber.
3. Activate both workflows.
4. Copy the production webhook URLs (the ones with the execution id or the production one) to Vercel project env:
   - N8N_WEBHOOK_URL = the contact one or a single with event type.
   - N8N_WEBHOOK_SECRET = the secret from n8n webhook auth if enabled.
   - N8N_DASHBOARD_URL = the n8n dashboard url.
5. Redeploy the site.
6. Test: submit the contact form on the site, check n8n executions for success, see the Slack message, check if booking row created.
7. Check /api/health for n8n: true.
8. Check /admin/settings for the n8n Open link.
9. Update this md with the workflow JSON export (copy from n8n), the test results, any errors.
10. Update `docs/runbooks/monitoring.md` with n8n monitoring steps (executions, kill switch unset url).
11. Update `plans/05-pikapods-integrations.md` with [x] for n8n pod + workflow.
12. Run `pnpm lint && pnpm type-check && pnpm test` .
13. Commit the docs and .env.example if updated.
14. Push and create PR.
15. Monitor for 30d: if executions >10/day and saves time, keep; else delete pod and use manual.

**Kill switch:** unset N8N_WEBHOOK_URL in Vercel, redeploy. The notifyN8n logs error but always returns 201.

**Cost:** pod $4-5/mo. Delete if not used.

**Measurement:** Umami event 'n8n_trigger', track Slack messages vs manual, time saved in ops.

**Risks:** n8n down = log only. Spam in Slack = filter in workflow. Data in n8n = same as DB (PII in contact).

**Pitch Deck Slide:** "n8n for ops fan-out: code ready, pod on demand when volume hurts ($4/mo). Zero impact on critical path. Measure executions vs manual effort."

**Next after this:** Kuma if UptimeRobot insufficient, full secretary CRM with profiles test on hire, Lighthouse CI verification with the new rc.

ponytail: pod only on volume. Workflow with existing nodes, no custom. Delete if no time save after 30d. This doc is the plan.

## Test the Test URL

1. In n8n, click "Listen for test event" on the webhook node.
2. In terminal or Postman, POST to the Test URL with JSON:
   ```json
   {
     "event": "contact",
     "name": "Test User",
     "email": "test@example.com",
     "message": "Test message for n8n webhook.",
     "service": "website-development"
   }
   ```
3. See the test event in n8n output with the payload.
4. Add nodes, test with real form after setting production URL in Vercel env + redeploy.
5. If no event, check URL exact match, workflow active, no auth mismatch.

Tested with sample payload - workflow triggers on POST to test URL. Production next after Vercel env + redeploy.

Updated: 2026-08-06.

Link in master. Commit after test.

#ponytail: n8n is glue only. Resend primary. Measure before scaling. 1 workflow per event. No RAG or agents.
