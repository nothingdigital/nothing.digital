# DNS Runbook

## Propagation check

Run:

```bash
npx tsx scripts/dns-check.ts
```

Last run: 2026-08-06

| Record | Name                  | Expected                  | Result                                                                                                                 |
| ------ | --------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| A      | `nothing.digital`     | Vercel edge IP            | `76.76.21.21` (consistent across Google/Cloudflare/Quad9/OpenDNS)                                                      |
| AAAA   | `nothing.digital`     | Vercel IPv6 or none       | No records (Vercel A-only for this domain)                                                                             |
| CNAME  | `www.nothing.digital` | Vercel DNS                | `d86db1d940b37860.vercel-dns-017.com.`                                                                                 |
| NS     | `nothing.digital`     | Cloudflare nameservers    | `cheryl.ns.cloudflare.com.`, `logan.ns.cloudflare.com.`                                                                |
| TXT    | `nothing.digital`     | SPF + Google verification | `v=spf1 include:spf.messagingengine.com ?all` + `google-site-verification=HCvoYYwD9dDCDD8G1170_RhhsRb5SuGhFY6BTapwq5o` |
| MX     | `nothing.digital`     | Fastmail                  | `in1-smtp.messagingengine.com.`, `in2-smtp.messagingengine.com.`                                                       |

## Notes

- `nothing.digital` resolves consistently from four public resolvers.
- `www` redirect is handled by Vercel CNAME.
- Google Search Console verification TXT is present.
- Resend DKIM is present at `dkim._domainkey.nothing.digital`; SPF still needs `include:_spf.resend.com` before `?all` for full Resend alignment.

**Target SPF (apply at DNS provider):**

```text
v=spf1 include:spf.messagingengine.com include:_spf.resend.com ?all
```

See [ops-credentials.md](./ops-credentials.md) for the full post-launch credential queue.
