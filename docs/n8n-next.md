# n8n Next Steps (Pod is up)

**Pod up:** Use the dashboard URL to create workflows. Env in Vercel for the webhook.

**How the contact form triggers the webhook with the path /webhook/contact:**

- Contact form submits to `/api/contact` (POST with JSON name, email, message, service, budget, timeline).
- The route validates, inserts to Supabase, sends emails, then calls `notifyN8n("contact", payload)` (the void means fire-and-forget, never blocks the 201 success response to the user).
- notifyN8n checks if N8N_WEBHOOK_URL set, then fetch POST to that URL (the full production URL ending with /webhook/contact) with body { "event": "contact", "name": ..., "email": ..., "message": ..., "service": ... } + optional X-N8N-Secret header.
- n8n webhook node with path `/webhook/contact` receives the POST, triggers the workflow with $json.event = "contact" and the payload in $json.
- The workflow runs the nodes (Code to format, Email to send to team, optional Supabase for booking).
- If the URL in Vercel env matches the n8n production webhook URL exactly, and the workflow is active, it triggers.

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

## Env for Production URL (to fix "env missing")

1. Vercel dashboard > project > Settings > Environment Variables.
2. Add for **both Production and Preview** (select the environments):
   - Key: `N8N_WEBHOOK_URL`, Value: exact Production URL from n8n webhook node (full https://.../webhook/contact from your picture, no /test).
   - Key: `N8N_DASHBOARD_URL`, Value: your n8n dashboard.
   - Key: `N8N_WEBHOOK_SECRET`, Value: random 32-char if auth in node.
3. Save. Trigger new deployment (Deployments > your branch preview > Redeploy).
4. Open the new preview URL + `/api/health`. Refresh. Must show `"n8n": true`. If still missing, the preview env not picked — add the variable again for Preview specifically and redeploy.

Updated: 2026-08-06. Env set, redeploy triggered with this commit (and this one again to force another deploy after env).

Link in master. Commit after test.

**What should happen from n8n when you submit a contact form on the website:**

- Form submits to /api/contact → Supabase insert + confirmation/team emails + rate limit.
- Then `notifyN8n("contact", {name, email, message, service, budget, timeline...})` fires async (fire-and-forget, never blocks or fails the user flow or the 201 response).
- If N8N_WEBHOOK_URL set and valid, POST to the URL with { "event": "contact", ...the form data }.
- n8n webhook node triggers the workflow, Code node formats the message, Email node sends the notification to your real email with the details + admin inbox link, optional Supabase for booking.
- n8n Executions shows the run with success for each node.
- Your email receives the formatted notification.
- Vercel logs no [n8n] error.
- Health shows n8n: true.

If nothing: env not set for the deployment (Preview for branch, Production for live), URL typo, workflow not active, path in node not matching the URL end, credential error in Email node (test the credential first), redeploy not done after env change.

#ponytail: n8n is glue only. Resend primary. Measure before scaling. 1 workflow per event. No RAG or agents.

## Troubleshooting "env missing" in /api/health

1. The health checks `Boolean(env.private.N8N_WEBHOOK_URL)` — if the variable is not set or empty in the runtime env, it shows missing.
2. In Vercel, the preview deployments (your branch) use **Preview** env variables. Production uses Production. Add the variable for **both**.
3. Key must be exactly `N8N_WEBHOOK_URL` (copy paste, no extra space or capital wrong).
4. Value = the full Production URL from the n8n webhook node (copy the Production tab URL exactly).
5. Save, then Redeploy the specific deployment for your branch (Deployments tab > your branch deployment > ... > Redeploy).
6. Open the new preview URL (the one with your-branch--nothing-digital.vercel.app) + `/api/health`. Hard refresh (Ctrl+Shift+R).
7. If still missing, delete the variable and re-add it for Preview specifically, redeploy again.
8. Check the deployment build log for "N8N_WEBHOOK_URL" to confirm it's loaded.
9. Once true, the notifyN8n will send to the URL.

**this fixes 90% of "env missing".** The pod is up, the webhook node is set, the env in Vercel is the missing link for the runtime.

Updated: 2026-08-06.

Link in master. Commit after test.

## No Slack Alternative (Email Node)

1. After Code node (format with to/subject/message), add Email > Send Email node.
2. Credential: SMTP, host `smtp.resend.com`, port `587`, user `resend`, password = exact RESEND_API_KEY from Vercel/Resend dashboard (starts with re_ , the one used for site emails).
3. SSL/TLS = on (STARTTLS).
4. Client Host Name = `n8n bot` or leave blank.
5. Test credential in n8n (the "Test" button in credential edit) - if "Couldn't connect" error:
   - Confirm API key is valid and has SMTP permission in Resend dashboard (API Keys > the key > permissions).
   - Domain verified in Resend (Domains tab).
   - No firewall/VPN blocking outbound 587.
   - Try without Client Host Name.
   - Alternative: use n8n Resend node (search "Resend" in nodes) with API key instead of SMTP.
6. From: n8n <hello@nothing.digital>
7. To: your real email (create team@nothing.digital as alias in Resend if preferred, or use hello@ for to also).
8. Subject: {{ $json.subject }}
9. Text: {{ $json.message }}
10. Test with Listen + sample JSON - email arrives.

This reuses existing Resend key. No new credential if using Resend node. Retry the credential after fixes.

Update md with your credential screenshot (redacted key) + test email result.

Update this md with your Email node screenshot + test email. Commit after successful test with real form.

**full test command (replace URL)**: curl -X POST -H "Content-Type: application/json" -d '{"event":"contact","name":"Test","email":"test@example.com","message":"test","service":"website-development"}' YOUR_TEST_URL

Run after each change: pnpm lint && pnpm type-check && pnpm test. Commit docs only. Push. Create PR for review.

Updated: 2026-08-06.
