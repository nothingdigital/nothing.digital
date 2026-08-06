# Newsletter #1 — Nothing.Digital Monthly

**Campaign type:** Regular broadcast
**Subject:** Three questions before you rebuild your site
**Preheader:** The framework we use on every scoping call.

```html
<p>Hi {{ .Subscriber.Name | default "there" }},</p>

<p>
  Welcome to the first Nothing.Digital monthly. One short idea, one case-study
  note, and one thing we are thinking about.
</p>

<h2>Three questions before you rebuild your site</h2>

<p>
  Most rebuilds fail before the first line of code. Ask these three questions
  first:
</p>

<ol>
  <li>
    <strong>What job must the site do?</strong> Lead capture, self-serve sales,
    portfolio, or support? One primary job. Everything else is secondary.
  </li>
  <li>
    <strong>What is the one metric that proves success?</strong> Form
    submissions, demo bookings, page speed, or search rank. Pick one and
    instrument it.
  </li>
  <li>
    <strong>What can we cut?</strong> Rebuilds balloon when every old page
    becomes a requirement. Audit traffic and drop the bottom 80%.
  </li>
</ol>

<p>Get these right and the tech stack becomes easy.</p>

<h2>Case-study note</h2>

<p>
  On a recent composite engagement, a focused scope — answering #1 in the first
  meeting and refusing features that did not serve it — cut a planned timeline
  roughly in half. The stack was Next.js + Supabase, and the result launched
  clean and fast.
</p>

<p><a href="https://nothing.digital/portfolio">See the work →</a></p>

<h2>What we are thinking about</h2>

<p>
  AI-generated content is cheap. Maintained content is rare. We are building
  sites where humans own the narrative and the machine handles the plumbing. If
  your content strategy is "publish more," you will lose to someone who
  publishes better.
</p>

<p>That is it for this month.</p>

<p>— Alexander & the Nothing.Digital team</p>

<hr />
<p style="font-size:12px;color:#666;">
  Nothing.Digital · <a href="https://nothing.digital">nothing.digital</a> ·
  <a href="https://nothing.digital/contact">Contact</a> ·
  <a href="{{ .UnsubscribeURL }}">Unsubscribe</a> ·
  <a href="https://nothing.digital/privacy">Privacy policy</a>
</p>
```

---

## Send checklist

- [ ] Import/copy HTML into Listmonk campaign.
- [ ] Set from address: `Nothing.Digital <hello@nothing.digital>`.
- [ ] Send to confirmed subscribers only.
- [ ] Schedule for mid-week morning (Tuesday–Thursday, 9–11 AM recipient time).
- [ ] Review opens/clicks after 48 h; use data to tune subject line next month.
