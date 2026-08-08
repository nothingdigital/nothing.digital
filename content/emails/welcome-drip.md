# Listmonk Welcome Drip — Nothing.Digital

Copy-paste into Listmonk campaigns/templates. Uses Listmonk Go-template syntax:
`{{ .Subscriber.Name }}`, `{{ .Subscriber.Email }}`, `{{ .UnsubscribeURL }}`.

---

## 1. Double opt-in confirmation (transactional)

**Campaign type:** Transactional / Confirmation
**Subject:** Confirm your subscription to Nothing.Digital
**Preheader:** One click to join the list.

```html
<p>Hi {{ .Subscriber.Name | default "there" }},</p>

<p>Thanks for signing up for the Nothing.Digital newsletter.</p>

<p>Click the button below to confirm your email and join the list:</p>

<p>
  <a
    href="{{ .OptinURL }}"
    style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;"
  >
    Confirm subscription
  </a>
</p>

<p>Or paste this link into your browser:<br />{{ .OptinURL }}</p>

<p>If you did not sign up, ignore this email.</p>

<p>— The Nothing.Digital team</p>

<hr />
<p style="font-size:12px;color:#666;">
  Nothing.Digital · <a href="https://nothing.digital">nothing.digital</a><br />
  <a href="{{ .UnsubscribeURL }}">Unsubscribe</a>
</p>
```

---

## 2. Day 0 — Welcome + set expectation

**Campaign type:** Drip — trigger after confirmed
**Subject:** Welcome to Nothing.Digital
**Preheader:** What to expect + the post that started it.

```html
<p>Hi {{ .Subscriber.Name | default "there" }},</p>

<p>
  Welcome. You will get one short email a month on building fast, durable
  websites and software — plus a case study when we ship something worth
  sharing.
</p>

<p>While you wait, here is the best place to start:</p>

<ul>
  <li>
    <a href="https://nothing.digital/blog">Latest thinking on the blog</a>
  </li>
  <li><a href="https://nothing.digital/portfolio">Recent work</a></li>
</ul>

<p>Reply to any email if you have a question. We read every one.</p>

<p>— Alexander & the Nothing.Digital team</p>

<hr />
<p style="font-size:12px;color:#666;">
  <a href="{{ .UnsubscribeURL }}">Unsubscribe</a> ·
  <a href="https://nothing.digital/privacy">Privacy policy</a>
</p>
```

---

## 3. Day 3 — Case study / proof

**Campaign type:** Drip
**Subject:** How we cut a launch timeline in half
**Preheader:** One composite case study from a recent engagement.

```html
<p>Hi {{ .Subscriber.Name | default "there" }},</p>

<p>
  Most projects slip because scope grows quietly. In a composite example, a
  focused project shipped in about six weeks by locking scope in week one and
  validating every assumption with a working prototype.
</p>

<p>
  The stack: Next.js site + Supabase backend. The outcome: on-time and clean
  performance scores.
</p>

<p><a href="https://nothing.digital/portfolio">Read the case studies →</a></p>

<p>Key takeaways:</p>
<ul>
  <li>Fix the data model before the UI.</li>
  <li>Ship a staging URL by day three.</li>
  <li>Automate deploys, not debates.</li>
</ul>

<p>More next week.</p>

<p>— The Nothing.Digital team</p>

<hr />
<p style="font-size:12px;color:#666;">
  <a href="{{ .UnsubscribeURL }}">Unsubscribe</a> ·
  <a href="https://nothing.digital/privacy">Privacy policy</a>
</p>
```

---

## 4. Day 7 — Soft CTA

**Campaign type:** Drip
**Subject:** Book a free scoping call
**Preheader:** 30 minutes to map your project and a rough budget.

```html
<p>Hi {{ .Subscriber.Name | default "there" }},</p>

<p>
  If you have a website, app, or internal tool in mind, the next step is a free
  scoping call.
</p>

<p>
  We will spend 30 minutes mapping the problem, the must-haves, and a realistic
  budget range. No pitch deck. No obligation.
</p>

<p>
  <a
    href="https://calendly.com/nothing-digital/30min"
    style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;"
  >
    Book a call
  </a>
</p>

<p>
  Not ready? Reply and tell us what you are building. We will point you to the
  right resource.
</p>

<p>— Alexander & the Nothing.Digital team</p>

<hr />
<p style="font-size:12px;color:#666;">
  <a href="{{ .UnsubscribeURL }}">Unsubscribe</a> ·
  <a href="https://nothing.digital/privacy">Privacy policy</a>
</p>
```

---

## Listmonk setup notes

- List: create a public list with double opt-in enabled.
- Welcome drip: create three automated campaigns (Day 0, Day 3, Day 7) triggered on subscription confirmation.
- Confirmation email: set Listmonk’s built-in opt-in confirmation template or use the transactional copy above.
- From address: `Nothing.Digital <hello@nothing.digital>`.
- Unsubscribe and privacy links must stay in every campaign.
