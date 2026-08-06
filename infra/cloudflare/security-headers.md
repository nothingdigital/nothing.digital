# Cloudflare Security Headers

## Current headers

Application-level security headers are set in `next.config.mjs` and served by Next.js.

| Header                   | Value                                      | Notes                        |
| ------------------------ | ------------------------------------------ | ---------------------------- |
| `X-Frame-Options`        | `DENY`                                     | Prevents clickjacking        |
| `X-Content-Type-Options` | `nosniff`                                  | Blocks MIME sniffing         |
| `Referrer-Policy`        | `strict-origin-when-cross-origin`          | Limits referrer leakage      |
| `Permissions-Policy`     | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |

## Cloudflare-level headers (manual setup)

Apply via Cloudflare Transform Rules once domain is live:

| Header                      | Value                                                                                                                                                                                                                                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload`                                                                                                                                                                                                                                                                               |
| `Content-Security-Policy`   | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live https://analytics.nothing.digital; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co https://*.sentry.io https://analytics.nothing.digital; frame-ancestors 'none';` |
| `X-Frame-Options`           | `DENY`                                                                                                                                                                                                                                                                                                                       |
| `X-Content-Type-Options`    | `nosniff`                                                                                                                                                                                                                                                                                                                    |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                                                                                                                                                                                                                                                                            |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`                                                                                                                                                                                                                                                                                   |

## WAF

- Enable Cloudflare OWASP Core Ruleset
- Rate limit: 100 requests/minute per IP
- Bot Fight Mode: ON

## Notes

- CSP is intentionally permissive during Phase 1; tighten before launch.
- HSTS preload requires Cloudflare + registrar coordination.
