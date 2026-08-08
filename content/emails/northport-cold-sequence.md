# Northport Cold Sequence — Instantly (NOT Listmonk)

> **Channel:** Instantly / Smartlead only.  
> **Do not** paste into Listmonk or Resend broadcast.  
> **Audience:** Human-reviewed Northport, AL leads from `pnpm lead-finder`.  
> **CTA:** Free scoping call → https://nothing.digital/contact (or Calendly).

Variables (Instantly-style): `{{companyName}}`, `{{firstName}}` (optional), `{{website}}`, `{{reasons}}`.

CAN-SPAM footer on every step (adapt address):

```text
Nothing.Digital · Northport / Tuscaloosa area
https://nothing.digital
{{unsubscribeLink}}
```

---

## Step 1 — Day 0

**Subject options (A/B):**

1. Quick note about {{companyName}}’s online presence
2. {{companyName}} + a clearer website?

**Body:**

```text
Hi{{#if firstName}} {{firstName}}{{/if}},

I was looking at local Northport businesses and came across {{companyName}}.

{{#if reasons}}
From the outside, it looks like the web side could use a refresh ({{reasons}}).
{{else}}
A lot of strong local shops here still get overlooked online — usually a site issue, not the business.
{{/if}}

I help Northport / Tuscaloosa businesses ship simple, fast websites that actually bring calls. Happy to do a free 15-minute scoping call and tell you straight whether it’s worth changing anything.

If useful: https://nothing.digital/contact

If not a fit, reply “no thanks” and I won’t follow up.

— Nothing.Digital
```

---

## Step 2 — Day +3 (if no reply)

**Subject:** Re: {{companyName}} website

**Body:**

```text
Hi again{{#if firstName}} {{firstName}}{{/if}},

Quick follow-up on {{companyName}}.

No pitch deck — just offering a free look at what’s hurting (or helping) you online from a Northport customer’s point of view. If the site’s already doing its job, I’ll say so.

Book here if you want eyes on it: https://nothing.digital/contact

— Nothing.Digital
```

---

## Step 3 — Day +7 (breakup)

**Subject:** Closing the loop — {{companyName}}

**Body:**

```text
Last note from me on this.

I’ll assume timing’s off for {{companyName}}. If you ever want a second opinion on the website (or a rebuild quote), the door stays open: https://nothing.digital/contact

Either way, wishing you a busy season in Northport.

— Nothing.Digital
```

---

## Personalization notes

- Prefer one concrete observation from the lead CSV `reasons` column (e.g. “no website on your Google listing”, “Facebook-only”, “site timing out”).
- Never claim you already audited their books/revenue.
- Trades / pro / hospitality use the same skeleton; tweak one sentence for vertical if sending separate campaigns.
