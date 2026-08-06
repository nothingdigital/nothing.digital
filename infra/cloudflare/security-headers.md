# Cloudflare Security Headers

## Current headers

Application-level security headers are set in `next.config.mjs` and served by Next.js for every route. Cloudflare Transform Rules are the source of truth once the domain is proxied.

| Header                   | Value                                      | Notes                        |
| ------------------------ | ------------------------------------------ | ---------------------------- |
| `X-Frame-Options`        | `DENY`                                     | Prevents clickjacking        |
| `X-Content-Type-Options` | `nosniff`                                  | Blocks MIME sniffing         |
| `Referrer-Policy`        | `strict-origin-when-cross-origin`          | Limits referrer leakage      |
| `Permissions-Policy`     | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |

## Cloudflare-level headers

Domain `nothing.digital` resolves directly to Vercel (`76.76.21.21`) with Sav DNS; there is no Cloudflare proxy. Cloudflare Transform Rules cannot apply. Production headers are served by Next.js from `next.config.mjs` (above).

If you ever proxy through Cloudflare, mirror this policy in a Transform Rule:

| Header                      | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload`                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `Content-Security-Policy`   | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://analytics.nothing.digital https://*.vercel-scripts.com https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co https://*.sentry.io https://analytics.nothing.digital https://*.vercel-scripts.com https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';` |
| `X-Frame-Options`           | `DENY`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `X-Content-Type-Options`    | `nosniff`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Why CSP is not in `middleware.ts`

`src/middleware.ts` is scoped to `/admin/:path*` and enforces admin auth. Expanding the matcher to all routes would force the auth redirect on public pages, so the site-wide CSP lives in `next.config.mjs` headers instead. `middleware.ts` unchanged.

## WAF

- Enable Cloudflare OWASP Core Ruleset
- Rate limit: 100 requests/minute per IP
- Bot Fight Mode: ON

## Notes

- `next.config.mjs` ships the same CSP as a fallback for non-Cloudflare builds / preview deployments.
- Keep `unsafe-inline` only because Next.js/Vercel inject inline styles/scripts in some paths; tighten to nonces/hashes if you ever need stricter CSP.
- HSTS preload requires Cloudflare + registrar coordination.
