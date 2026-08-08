# Ponytail full review — 2026-08-08

coverage: 278/278 files (manifest OK)
shards: 17 (+ mop-up 0, spot-check 2)
skill: ponytail-review
run_dir: `/tmp/ponytail-review-20260808-001954`

Findings only — no edits applied. Correctness/security/perf out of scope.

## Ranked findings

src/lib/supabase/database.ts:L9-641: native: hand-rolled Row/Insert/Update per table. `supabase gen types typescript`.

src/lib/services.ts:L23-78: yagni: serviceSummaries duplicates details (slug/title/description/href). Derive summaries from details + an icon map.

src/lib/pricing.ts:L13-63: yagni: pricingServices duplicates slug/title/href/copy already in serviceDetails. Derive pricing cards from details + a thin `fit` map.

supabase/migrations/001_initial.sql:L76: delete anon `SELECT USING (false)` policies — RLS default-deny already. Nothing.

supabase/migrations/001_initial.sql:L112: delete `service_role` policies — role bypasses RLS. Nothing.

supabase/migrations/002_client_ops.sql:L85: delete anon `SELECT USING (false)` policies — RLS default-deny already. Nothing.

supabase/migrations/002_client_ops.sql:L113: delete `service_role` policies — role bypasses RLS. Nothing.

supabase/migrations/005_admin_loops.sql:L68: delete anon `SELECT USING (false)` policies — RLS default-deny already. Nothing.

supabase/migrations/005_admin_loops.sql:L96: delete `service_role` policies — role bypasses RLS. Nothing.

supabase/migrations/006_pdf_documents.sql:L36: delete anon `SELECT USING (false)` policy — RLS default-deny already. Nothing.

supabase/migrations/006_pdf_documents.sql:L43: delete `service_role` policy — role bypasses RLS. Nothing.

supabase/migrations/008_kb_docs.sql:L92: delete anon `SELECT USING (false)` policies — RLS default-deny already. Nothing.

supabase/migrations/008_kb_docs.sql:L134: delete `service_role` policies — role bypasses RLS. Nothing.

src/app/(site)/contact/page.tsx:L113-167: shrink three copy-paste contact rows. `[{icon,label,href,text}].map(...)`.

src/app/admin/loops/actions.ts:L24-78: shrink: close/reopen/snooze/mute copy the same requireAdmin→loopKey→insert→revalidate block. One `recordLoop(action, extras?)` helper.

src/lib/kb/queries.ts:L513-565: shrink: approved-ack pages then separate `kb_nodes` round-trip + Map. `select("*, node:kb_nodes(*)")` up front, drop L550-565, keep filter + node guard.

src/components/molecules/cookie-consent.tsx:L7,L27-39: native: hand-rolled `trapTabKey` + keydown listener on `role="dialog"`. `<dialog>` + `showModal()` / unmount `close()`; drop `trapTabKey` + `firstActionRef`.

src/lib/admin/client-ops.ts:L61-95: shrink nine identical `includes` guards. one `isOneOf(allowed)(value)`, export the nine as thin aliases.

src/lib/rate-limit.ts:L8-41: yagni: RateLimiter interface + factory + getRateLimiter for one shared Map. Export `limit(id)` (or the shared limiter) directly.

src/lib/services.ts:L91: shrink: stored `jsonLd` repeats title+description on every service. Drop field; call `serviceJsonLd(title, description)` at serialize site.

src/app/api/contact/route.ts:L51-80: yagni three single-caller `send*` wrappers (+ Resend type import). Inline the three `resend.emails.send` calls in the try.

src/app/(site)/contact/page.tsx:L37-64: shrink answer and answerText identical on 4 FAQs. One string; JSX override only for pricing.

src/lib/env.ts:L38-62: delete `raw` object only forwards `process.env` once. Inline `process.env.X` into each `parseField` call.

src/app/admin/system-map/page.tsx:L100-123: shrink: 23-line `[&_h*]` markdown style wall. `prose prose-sm` (or a handful of shared element classes).

src/lib/invoices/render-pdf.tsx:L100-123: shrink five identical label/value row blocks. Local `Row({label,value})` (~5 calls).

src/app/admin/inbox/page.tsx:L152-173: delete local FilterChip duplicates AdminFilterChip (same href/label/active API as clients page). Import AdminFilterChip.

src/lib/admin/loops/collect.ts:L33-54: yagni `collectCandidateLoops` exported with one in-file caller. inline into `collectLoops` until a second caller.

supabase/migrations/004_profiles.sql:L31: shrink `app_role IN ('owner','staff')` — enum is only those two. `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())`.

supabase/migrations/004_profiles.sql:L38: delete re-`ENABLE ROW LEVEL SECURITY` + duplicate anon insert policies already in 001/002. Keep staff policies only.

supabase/migrations/005_admin_loops.sql:L59: delete `do_not_contact_value_idx` — `UNIQUE (email_or_domain)` already indexes. Nothing.

supabase/migrations/005_founding_client.sql:L12: delete commented example policy + UPDATE stubs. Nothing.

supabase/migrations/008_kb_docs.sql:L31: yagni nullable `body_text` beside `body`. Drop until search needs denorm.

src/lib/ai/format-prompt-input.ts:L8-25: shrink triplicated open/later/closed section builders. One `section(label, loops, line?)` helper.

src/app/(site)/contact/components/calendly-embed.tsx:L33-49: shrink useMemo+useCallback around cheap URL/mount. `const embedUrl = buildEmbedUrl(url)` + one useEffect/onLoad.

src/lib/kb/import.ts:L97-113: shrink sync paths wrapped in Promise.resolve. Make extractByFilename async; return plain objects.

src/app/admin/docs/page.tsx:L106-120: shrink space `<select>` copied thrice (also L134-148, L165-179). `spaceSelect(id)` helper like `parentSelect`.

src/lib/env.ts:L9-22: shrink five identical `z.preprocess(emptyToUndefined, …)` wrappers. `const opt = <T extends z.ZodTypeAny>(s: T) => z.preprocess(emptyToUndefined, s.optional())`, then `opt(z.string().url())` etc.

scripts/lead-finder/scorer.ts:L2-14: shrink SOCIAL_HOSTS lists www./m. twins. Strip www. (and treat m.facebook via endsWith) then Set.has.

src/app/(site)/blog/page.tsx:L22-34: yagni collectTags frequency-sorts for non-clickable Topics badges. Delete Topics UI + helper, or unique Set without counts.

src/app/admin/outbound/page.tsx:L48-60: shrink: 12-line Instantly-shaped map just to count ready rows. `approved.rows.filter(r => r.email).length` (or count helper that takes rows).

src/app/admin/outbound/export/route.ts:L15-27: shrink: same field pick as the page count map. Pass `rows` into `buildInstantlyCsv` if the shape already matches.

src/lib/admin/client-ops-queries.ts:L286-297: shrink `UpdateInvoiceInput` mirrors `CreateInvoiceInput`. `Omit<CreateInvoiceInput, "client_id">`.

src/app/admin/outbound/actions.ts:L36-46: yagni: STATUSES + isStatus duplicates page STATUS_FILTERS. One shared allowlist, both import it.

src/lib/a11y.ts:L10-20: native hand-rolled ancestor getComputedStyle walk. `el.checkVisibility()`, drop `isVisible`.

src/lib/admin/client-ops-queries.ts:L403-413: shrink `UpdateAssetInput` mirrors create. `Omit<CreateAssetInput, "client_id"> & { id: string }`.

src/lib/kb/import.ts:L87-95: yagni extractNumbers stub export. Inline the error object in extractByFilename; drop the named function.

src/lib/site.ts:L3-11: yagni: siteConfig re-lists brandConfig fields 1:1. Alias/pick `brandConfig`.

src/lib/kb/queries.ts:L258-266: shrink: page-by-id fetch + not-found copied in save/transition/restore/ack (4×). `loadPage(supabase, id)` → `{ page, error }`, 2-line call sites.

src/lib/admin/client-ops-queries.ts:L570-577: shrink `UpdateWorkItemInput` mirrors create. `Omit<CreateWorkItemInput, "client_id">`.

e2e/a11y.spec.ts:L18-24: shrink: scanPage only wraps goto+AxeBuilder.analyze. Inline those calls in the test body.

scripts/lead-finder/cli.ts:L56-62: shrink: skipFetch enrich ternary with casts. Always await enrichLead(...); null snapshot already returns before Hunter.

src/lib/admin/loops/queries.ts:L28-34: shrink identity field map. `(data ?? []) as LoopEvent[]` (select already projects).

src/lib/admin/ops-glance.ts:L11-16: yagni `countOverdueInvoices` is `select….length` with one production caller. Inline `.length` at call site.

scripts/lead-finder/places.ts:L39-43: yagni parseVerticals is a pure passthrough. Re-export shared parseVerticals; drop the wrapper.

src/lib/admin/health.ts:L61-65: yagni `chipToneForConfigured` / `ChipTone` wrap a ternary. `configured ? "ok" : "missing"` inline.

scripts/dns-check.ts:L1-4: native: promisify(execFile). import { execFile } from "node:child_process/promises".

src/lib/admin/outbound/instantly-csv.ts:L13-16: shrink `escapeCsv` duplicates `newsletter-csv.escapeCsvField`. Import one; delete the other.

e2e/home.spec.ts:L13-15: yagni: openHome only wraps page.goto("/"). Inline page.goto("/") in each test.

e2e/navigation.spec.ts:L9-11: yagni: openHome only wraps page.goto("/"). Inline page.goto("/") in each test.

src/app/auth/callback/route.ts:L36-38: shrink inside `isPortal`, `next` already starts with `/portal`. `return NextResponse.redirect(\`${origin}${next}\`)`.

src/lib/a11y.ts:L25-27: shrink selector already drops disabled/`tabindex=-1`. `.filter(isVisible)` (or `.filter((el) => el.checkVisibility())`).

src/lib/admin/health.ts:L57-59: yagni `labelForIntegration` is `LABELS[key]`. export `LABELS`, index at call sites.

src/lib/ai.ts:L37-39: yagni three aliases of `isAiEnabled`. Call `isAiEnabled` until a real per-feature flag exists.

src/lib/admin/outbound/queries.ts:L12-14: delete `notConfigured` helper used twice with same one-liner shape. Inline `{ rows: [], error: "Supabase is not configured." }`.

src/lib/pdf/resolve-view.ts:L21-23: yagni newViewToken one-liner wrapper. Inline `randomBytes(24).toString("hex")`.

src/lib/utils.test.ts:L3-5: shrink: `merge` wrapper around `cn`. Call `cn` in the tests.

src/app/admin/docs/attachments/[attachmentId]/route.ts:L22-23: native Buffer.from(arrayBuffer()) only to feed Response. Pass `downloaded.data` as BodyInit.

src/components/atoms/umami-script.tsx:L17-18: delete: `async` + `defer` on `next/script` with `strategy="afterInteractive"`. Strategy alone.

src/app/(site)/contact/components/contact-form.tsx:L20: delete phone on schema then stripped in toApiPayload. Drop phone schema/default/FormField until API stores it.

src/app/(site)/contact/components/contact-form.tsx:L303: shrink identical select className thrice. One `selectClassName` const.

src/app/admin/clients/actions.ts:214: shrink triplicated cover-off auto-send gates + maybeSendInvoiceEmail reimplements sendPendingInvoiceEmailAction. One `autoSendIfNewlySent(id, status, prev?)` that calls `sendPendingInvoiceEmailAction` and warns on `!ok`.

src/app/admin/clients/actions.ts:174: shrink createInvoiceAction/updateInvoiceAction copy-pasted field reads, paid_at, status/amount guards. `parseInvoiceForm(formData)`.

src/app/admin/clients/actions.ts:509: shrink createAssetAction/updateAssetAction copy-pasted field reads+type/env/status guards. `parseAssetForm(formData)`.

src/app/admin/clients/actions.ts:598: shrink createWorkItemAction/updateWorkItemAction copy-pasted field reads+status/priority guards. `parseWorkForm(formData)`.

src/brand/email.ts:L3: yagni getFromEmail one-liner over brandConfig.fromEmail. Use brandConfig.fromEmail; drop email.ts + re-export.

src/app/robots.ts:L3: yagni SITE_URL redeclares brandConfig.url. Import brandConfig.url.

src/app/sitemap.ts:L6: yagni SITE_URL redeclares brandConfig.url. Import brandConfig.url.

src/brand/modules.ts:L34: yagni withModules `base` param unused (always DEFAULT). Drop param; spread DEFAULT_MODULES only.

src/app/v/[token]/file/route.ts:L39: shrink Content-Disposition if/else. One `headers.set` with `download ? "attachment" : "inline"`.

src/app/portal/page.tsx:L97: shrink dual if for view_token/external_url. One ternary like documents L149–167.

src/components/admin/admin-login-form.tsx:L51: shrink onMagicLink/onGoogle duplicate supabase null-check. Shared `withSupabase` helper.

src/components/admin/client-ops-selects.tsx:L26: shrink three near-identical StatusSelects. One generic + three thin wrappers.

src/components/admin/loop-list.tsx:L15: delete identity `SOURCE_LABEL` map. Use `loop.source`.

src/components/admin/loop-list.tsx:L32: shrink `cn()` with no conditionals. One `className` string; drop `cn` import.

src/components/admin/loop-list.tsx:L48: shrink three snooze forms. Map `[["tomorrow","Snooze tomorrow"],…]` → one form.

src/components/admin/loop-list.tsx:L25: yagni `handoff` prop always `source === "outbound"`. Check `loop.source` only; drop prop.

src/components/admin/invoice-cover-draft-panel.tsx:L37: shrink `onFlush`/`onSend` twin success paths. One `finishEmail(payload?)` calling `sendPendingInvoiceEmailAction`.

src/components/admin/outbound-map.tsx:L193: shrink drop-pin + `searchArea` busy/fetch/`withGeo` scaffolding. Shared `runPlacesQuery(body, onOk)`.

src/components/atoms/cursor-glow.tsx:L4: native framer-motion `useReducedMotion` for one check. `matchMedia("(prefers-reduced-motion: reduce)")` inside the existing effect.

src/components/atoms/hero-clock.tsx:L4: native framer-motion `useReducedMotion` for tilt gate. `matchMedia` check in `handleTilt`; drop framer import.

src/components/molecules/form-field.tsx:L12,L33-38: native: `@radix-ui/react-label` Root for plain `htmlFor` label. `<label>`.

src/components/molecules/blog-card.tsx:L1: delete: unused `import * as React`. Nothing.

src/components/molecules/portfolio-card.tsx:L1: delete unused `import * as React`. Nothing.

src/components/molecules/service-card.tsx:L1-L26: native framer-motion + `useReducedMotion` for hover `y: -6`. CSS `hover:-translate-y-1.5` (same as portfolio-card); drop `"use client"`.

src/components/organisms/footer.tsx:L1: delete `"use client"`. Footer is static markup; `NewsletterForm` is already the client island.

src/components/organisms/footer.tsx:L71-L105: shrink duplicate Services/Company link columns. `FooterColumn({ title, links })` once.

src/components/organisms/newsletter-form.tsx:L3-L72: yagni react-hook-form + zodResolver + FormField for one email. `<form>` + `type="email" required` + status state.

src/components/providers/theme-provider.tsx:L7-L17: yagni ThemeProvider passthrough. `NextThemesProvider` with those three props at the root.

src/components/ui/button.test.tsx:L7-L9: delete `renderButton` identity wrapper. Call `render` directly.

src/lib/admin/client-ops.ts:L120: delete unused `_now` on `compareWorkItems`. drop the param (and call-site args).

src/lib/admin/loops/rules/runbook-setup.ts:L41: yagni `checklist` param while key/title/href hardcode listmonk. Drop param; always use `LISTMONK_DRIP_ITEMS`.

src/lib/leads/places.ts:L23: yagni `vertical: … | string`. Use `VerticalPack | "map"` only.

src/lib/pricing.ts:L79: shrink: one-element `.includes`. `service === "software-solutions"`.

src/middleware.ts:L29: delete unreachable fallback `return response` (matcher is only `/admin` + `/portal`). Nothing.

src/middleware.ts:L77: delete unreachable final `return response` (both path branches already return). Nothing.

## Lean shards / spot-checks

- `shard-03` (15 files): Lean already. Ship. e.g. src/app/(site)/layout.tsx, src/app/(site)/page.tsx, src/app/(site)/portfolio/[slug]/page.tsx…
- `spot-clients-id-page` (1 files): Lean already. Ship. e.g. src/app/admin/clients/[id]/page.tsx

## net

net: -1090 lines possible (sum of shards + spot-checks; may overlap)

### Per-shard nets

- `shard-01`: -17
- `shard-02`: -91
- `shard-03`: -0
- `shard-04`: -65
- `shard-05`: -48
- `shard-06`: -55
- `shard-07`: -18
- `shard-08`: -65
- `shard-09`: -50
- `shard-10`: -12
- `shard-11`: -75
- `shard-12`: -65
- `shard-13`: -18
- `shard-14`: -42
- `shard-15`: -24
- `shard-16`: -130
- `shard-17`: -285
- `spot-clients-id-page`: -0
- `spot-kb-queries`: -30

## Re-run

Procedure: [`../ponytail-full-review.md`](../ponytail-full-review.md)
