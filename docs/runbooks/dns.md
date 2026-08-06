# DNS Runbook

## Propagation check

Run:

```bash
npx tsx scripts/dns-check.ts
```

Last run: 2026-08-06

| Record | Name                  | Expected                  | Result                                                            |
| ------ | --------------------- | ------------------------- | ----------------------------------------------------------------- |
| A      | `nothing.digital`     | Vercel edge IP            | `76.76.21.21` (consistent across Google/Cloudflare/Quad9/OpenDNS) |
| AAAA   | `nothing.digital`     | Vercel IPv6 or none       | No records (Vercel A-only for this domain)                        |
| CNAME  | `www.nothing.digital` | Vercel DNS                | `d86db1d940b37860.vercel-dns-017.com.`                            |
| NS     | `nothing.digital`     | Cloudflare nameservers    | `cheryl.ns.cloudflare.com.`, `logan.ns.cloudflare.com.`           |
| TXT    | `nothing.digital`     | SPF + Google verification | SPF + `google-site-verification=...`                              |
| MX     | `nothing.digital`     | Fastmail                  | `in1-smtp.messagingengine.com.`, `in2-smtp.messagingengine.com.`  |

## Notes

- `nothing.digital` resolves consistently from four public resolvers.
- `www` redirect is handled by Vercel CNAME.
- Google Search Console verification TXT is present.
