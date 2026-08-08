# Security smoke — 2026-08-07

> **ARCHIVED evidence.** Live board: [`../../../SCRATCHPAD.md`](../../../SCRATCHPAD.md). Headers SoT: `next.config.mjs` + `infra/cloudflare/security-headers.md`.

Agent-run post-launch checks (no dashboard credentials). No production env changes.

## 1. Dependency audit

```text
pnpm audit --audit-level moderate
→ No known vulnerabilities found (exit 0)
```

| Severity         | Count |
| ---------------- | ----- |
| Critical         | 0     |
| High             | 0     |
| Moderate+ (gate) | 0     |

**Notable packages:** none. No lockfile / dependency fixes applied.

## 2. Security headers

Probed with `curl -sI`:

- `https://nothing.digital` (and `/`) — HTTP/2 200
- `https://nothing.digital/api/health` — HTTP/2 200
- `https://www.nothing.digital` — HTTP/2 308 → `https://nothing.digital/`

Compared to `next.config.mjs` `headers()` and `infra/cloudflare/security-headers.md`. Domain resolves to Vercel (no Cloudflare proxy); app headers are the production source of truth.

### Apex `/` (matches `next.config.mjs`)

| Header                      | Present | Value snippet                                                                         |
| --------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `Content-Security-Policy`   | present | `default-src 'self'; … frame-ancestors 'none'; … object-src 'none';` (matches config) |
| `Strict-Transport-Security` | present | `max-age=63072000; includeSubDomains; preload`                                        |
| `X-Frame-Options`           | present | `DENY`                                                                                |
| CSP `frame-ancestors`       | present | `'none'` (in CSP)                                                                     |
| `X-Content-Type-Options`    | present | `nosniff`                                                                             |
| `Referrer-Policy`           | present | `strict-origin-when-cross-origin`                                                     |
| `Permissions-Policy`        | present | `camera=(), microphone=(), geolocation=()`                                            |

`/api/health` returns the same security header set (no gaps vs apex).

### Notes vs docs

- Live HSTS matches `next.config.mjs` (`max-age=63072000`). Cloudflare sample table in `security-headers.md` still lists `31536000` — doc drift only; production is stronger/longer.
- `www` 308 response includes HSTS `max-age=63072000` but **without** `includeSubDomains; preload` (Vercel redirect surface). Full policy applies after redirect to apex.
- Observed `access-control-allow-origin: *` on apex HTML responses — not in the security-headers checklist; flag for human review if unintended on static HTML.

No in-repo header bug found; **no code changes**.

## 3. SSL certificate

```text
openssl s_client -servername nothing.digital -connect nothing.digital:443
```

| Field      | Value                                                  |
| ---------- | ------------------------------------------------------ |
| Subject    | `CN=nothing.digital`                                   |
| Issuer     | Let's Encrypt `YR1`                                    |
| Valid from | 2026-08-05 04:41:47 GMT                                |
| Expires    | **2026-11-03 04:41:46 GMT** (~88 days from check date) |

Auto-renewal expected via Vercel/Let's Encrypt; see `docs/runbooks/ssl.md` if monitoring is separate.

## 4. Recommended follow-ups

| Item                                                                                      | Owner                   |
| ----------------------------------------------------------------------------------------- | ----------------------- |
| Re-run `pnpm audit` on a schedule / in CI                                                 | agent or CI             |
| Align `security-headers.md` HSTS example (`31536000`) with `next.config.mjs` (`63072000`) | agent (docs-only)       |
| Confirm whether `Access-Control-Allow-Origin: *` on HTML is intentional                   | human                   |
| Cloudflare WAF / Bot Fight / rate limits (doc lists them; domain not proxied today)       | human (DNS/CF decision) |
| HSTS preload submission / registrar coordination                                          | human                   |
| Dashboard checks (Vercel firewall, Sentry, Supabase RLS, auth)                            | human                   |
| Renew/monitor cert before **2026-11-03** if auto-renew alerts are not wired               | human                   |

## Verdict

Pass for agent-scoped smoke: clean audit, expected headers on apex + health, cert valid until early November 2026.
