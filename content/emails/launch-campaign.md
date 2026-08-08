: launch announcement

**Campaign type:** One-time broadcast
**Subject:** Nothing.Digital is live
**Preheader:** Websites, software, and campaigns — without the bloat.

```html
<p>Hi {{ .Subscriber.Name | default "there" }},</p>

<p>
  Nothing.Digital is now live at
  <a href="https://nothing.digital">nothing.digital</a>.
</p>

<p>
  We build websites, software, and email marketing for teams who want clean,
  fast work that lasts. No shelfware, no surprise invoices, no hand-wavy scope.
</p>

<h2>What is different here</h2>

<ul>
  <li>Fixed quotes after a free scoping call.</li>
  <li>Source-first analytics you actually own.</li>
  <li>Human-written content, machine-powered plumbing.</li>
</ul>

<p>
  <a href="https://nothing.digital/services">See what we do →</a>
</p>

<h2>Book a free scoping call</h2>

<p>
  If you are weighing a rebuild, a new application, or a campaign system, the
  fastest next step is a 30-minute call.
</p>

<p>
  <a href="https://calendly.com/nothing-digital/30min">Pick a time →</a>
</p>

<p>— Alexander & the Nothing.Digital team</p>

<hr />
<p style="font-size:12px;color:#666;">
  Nothing.Digital · <a href="https://nothing.digital">nothing.digital</a> ·
  <a href="https://nothing.digital/contact">Contact</a> ·
  <a href="{{ .UnsubscribeURL }}">Unsubscribe</a> ·
  <a href="https://nothing.digital/privacy">Privacy policy</a>
</p>
```

## Send checklist

- [ ] Import/copy HTML into Listmonk campaign.
- [ ] Set from address: `Nothing.Digital <hello@nothing.digital>`.
- [ ] Send to confirmed newsletter subscribers only.
- [ ] Schedule within 48 hours of site launch.
