# SSL / TLS Runbook

## Smoke check

Run:

```bash
npx tsx scripts/ssl-check.ts
```

Last run: 2026-08-06

| Check               | Result                     |
| ------------------- | -------------------------- |
| HSTS header         | `max-age=63072000`         |
| TLS protocol        | `TLSv1.3`                  |
| Cipher              | `TLS_AES_128_GCM_SHA256`   |
| Certificate subject | `nothing.digital`          |
| Certificate issuer  | `Let's Encrypt`            |
| Valid until         | `2026-11-03T04:41:46.000Z` |

## SSL Labs A+ verification

1. Open <https://www.ssllabs.com/ssltest/>.
2. Enter `nothing.digital` and click **Submit**.
3. Wait for the report.

### A+ requirements

- TLS 1.2+ only (no TLS 1.0/1.1, no SSLv3).
- Strong cipher suites + forward secrecy.
- Valid, trusted certificate matching the domain.
- HSTS with `max-age >= 31536000`, `includeSubDomains`, and `preload`.

### Current gaps

- HSTS currently only sends `max-age=63072000` from Vercel's default.
- Added `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` in `next.config.mjs`.
- After the next production deploy, re-run SSL Labs. If Vercel strips `includeSubDomains`/`preload`, A+ requires Cloudflare proxy or Vercel support.
