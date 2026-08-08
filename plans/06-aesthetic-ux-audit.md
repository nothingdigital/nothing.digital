# 06 — Aesthetic & UX Audit Implementation Plan

Source audit: `current-strengths.txt` (external reviewer, 10 items). This plan
triages each item against the actual code — **trust the code, not the audit**.
This is a refinement pass, not a redesign. Keep the existing clock-themed brand
(antique-brass primary, teal accent, DM Serif Display + Inter + JetBrains Mono).

## 1. Triage: reality vs. audit

| #   | Audit item                | Verdict                                           | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | ------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Visual hierarchy & layout | ALREADY DONE                                      | Alternating `SectionContainer` variants (`muted`/`primary`): `src/components/atoms/section-container.tsx:19-23`, used in `src/app/(site)/page.tsx:111,130,153`. Hero = headline + subhead + `HeroClock` visual + two CTAs above the fold: `src/app/(site)/page.tsx:71-109`. `.section-divider` hairline exists (`src/app/globals.css:97-108`) and is used on the services page (`src/app/(site)/services/page.tsx:53`).                                                                                                                                                                     |
| 2   | Typography                | ALREADY DONE (brand-adapted); line-height PARTIAL | Font pairing exists, inverted vs. audit: DM Serif Display (headings) + Inter (body) + JetBrains Mono (kickers) via `next/font`: `src/app/layout.tsx:18-36`, wired in `tailwind.config.ts:12-16`. Keep — this is the brand. h1 scale `text-5xl md:text-7xl lg:text-8xl` (up to 96px) exceeds the audit's 48-64px ask: `page.tsx:81`. PARTIAL: body line-height is not universal — most prose uses `leading-relaxed` (1.625) but the blog MDX body uses `leading-7` (`src/app/(site)/blog/[slug]/page.tsx:124`) and incidental text (footer tagline, badges-adjacent copy) falls back to 1.5. |
| 3   | Color palette             | ALREADY DONE                                      | Brand accent exists: antique-brass `--primary` + teal `--accent`: `globals.css:6-29`. Gradient washes on `body` + `.hero-glow`: `globals.css:63-92`. Dark mode with toggle: `globals.css:31-52`, `src/components/atoms/theme-toggle.tsx`. Audit's blue `#2563EB` conflicts with the brand — SKIP.                                                                                                                                                                                                                                                                                           |
| 4   | Whitespace & spacing      | ALREADY DONE                                      | Section padding `py-16 md:py-24` = 64/96px, matching the audit's 60-100px: `section-container.tsx:20`. Max-width constraints (`max-w-xl/2xl/3xl/6xl`) throughout. Card layouts for services and differentiators.                                                                                                                                                                                                                                                                                                                                                                            |
| 5   | Imagery & graphics        | PARTIAL — infrastructure done, assets missing     | Portfolio grid + card + `next/image` + graceful empty state: `src/app/(site)/portfolio/page.tsx`, `src/components/molecules/portfolio-card.tsx`. `public/` contains only `og/default.png`, `og/default.svg`, `images/placeholder.svg` — no case-study covers, no team photo. Blocked on real assets; stock imagery conflicts with the minimal brand — SKIP (see §3).                                                                                                                                                                                                                        |
| 6   | CTA button styling        | ALREADY DONE                                      | `rounded-md` (8px via `--radius: 0.5rem`), hover scale 1.03 + darken, active 0.98, transitions, focus ring: `src/components/ui/button.tsx:7-28`. Above-fold dual CTAs: `page.tsx:90-103`.                                                                                                                                                                                                                                                                                                                                                                                                   |
| 7   | Micro-interactions        | PARTIAL                                           | Hover interactions exist: button scale, `ServiceCard` `whileHover` lift via framer-motion (`src/components/molecules/service-card.tsx:23-26`), cursor-glow, hero-clock tilt. NOT DONE: scroll-triggered reveals — no `whileInView`/`useInView`/`IntersectionObserver` anywhere in `src/`. NOT DONE: no `prefers-reduced-motion` handling anywhere — accessibility gap.                                                                                                                                                                                                                      |
| 8   | Footer & navigation       | ALREADY DONE (socials blocked)                    | Sticky nav with backdrop-blur: `src/components/organisms/navigation.tsx:43`. Expanded 4-col footer with tagline bio, services/company links, newsletter form, legal row: `src/components/organisms/footer.tsx`. Social links render conditionally (footer.tsx:46-61) but `socialLinks` is intentionally empty pending verified accounts: `src/lib/site.ts:15-16`. Not a design task — SKIP until real accounts exist.                                                                                                                                                                       |
| 9   | Mobile responsiveness     | PARTIAL                                           | Headings scale down via responsive classes throughout. Touch targets undersized: `size:icon` buttons are `h-9 w-9` (36px) < 44px WCAG target: `button.tsx:26`. Mobile menu links have no vertical padding beyond `space-y-3`: `navigation.tsx:92-104`.                                                                                                                                                                                                                                                                                                                                      |
| 10  | Loading performance       | ALREADY DONE                                      | `next/image` in all image components (portfolio-card, blog-card, service-page template). `NewsletterForm` dynamically imported below the fold: `page.tsx:13-18`. `next/font` with `display: "swap"`. No heavy assets exist to compress. PurgeCSS/Terser suggestion is obsolete — Tailwind + Next handle this.                                                                                                                                                                                                                                                                               |

## 2. Scoped work items (priority order)

### P1 — Scroll-triggered reveals + reduced-motion guard (audit #7)

framer-motion v12 is already installed (`package.json:50`) — no new dependency.

**a) New file `src/components/atoms/reveal.tsx`** (client component):

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// ponytail: one shared scroll-reveal; framer-motion is already a dep.
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

**b) New test `src/components/atoms/reveal.test.tsx`**: render children
(jsdom has no IntersectionObserver — mock it minimally or assert the
reduced-motion path via `vi.mock("framer-motion")` returning
`useReducedMotion: () => true`); keep it to 2 tests matching the style of
`section-container.test.tsx`.

**c) Apply on the homepage `src/app/(site)/page.tsx`** — wrap, without changing
any classes: the `SectionHeading` blocks, the services grid (line 117), the
differentiators grid (line 135), the newsletter inner div (line 154), and the
"Ready to build" inner div (line 171). Use `delay={index * 0.08}` only on card
grids if trivially available; otherwise no stagger. Do NOT wrap the hero — it
is above the fold and must paint instantly.

**d) Global reduced-motion guard in `src/app/globals.css`**, append to the
base layer after `::selection`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### P2 — Touch targets (audit #9)

- `src/components/ui/button.tsx:26` — change `icon: "h-9 w-9"` to
  `icon: "h-10 w-10"` (40px; 44px would distort the 64px nav bar — 40px is the
  pragmatic floor inside `h-16` header). This automatically fixes
  `ThemeToggle` and the mobile hamburger.
- `src/components/organisms/navigation.tsx:97` — mobile menu link: add
  `py-2` to the existing class string so each link is ≥32px tall with
  comfortable spacing.
- Check any test asserting `h-9` on icon buttons (`grep -rn "h-9" src/**/*.test.*`)
  and update if found.

### P3 — Line-height normalization sweep (audit #2, the one remaining sub-item)

Goal: all body/prose copy sits in the 1.6-1.8 band. Small, class-only edits:

- `src/app/(site)/blog/[slug]/page.tsx:124` — article body `leading-7` →
  `leading-relaxed` for consistency with the rest of the site.
- `src/components/organisms/footer.tsx:43` — tagline `text-sm text-muted-foreground`
  → add `leading-relaxed`.
- Sweep check: `grep -rn "text-muted-foreground" src --include=*.tsx` and add
  `leading-relaxed` to any multi-sentence paragraph missing it (skip
  single-line labels, kickers, and meta rows). Do not touch `leading-[0.95]`
  display headings.

### Explicitly NOT planned

No changes to: color tokens, fonts, section padding, hero, footer structure,
nav stickiness, image pipeline — all verified ALREADY DONE above.

## 3. Skip list (with reasons)

- **Blue `#2563EB` accent / purple gradient (audit #3)** — conflicts with the
  established antique-brass/teal clock brand; existing palette already has an
  accent, gradients, and dark mode.
- **Unsplash hero image / app mockup (audit #1, Quick Wins)** — the animated
  `HeroClock` IS the brand's hero visual; stock imagery would dilute it.
- **Stock team photo (audit #5)** — no real photo exists in `public/`;
  a stock photo contradicts the "senior-only studio" honesty of the brand.
- **Stock portfolio mockups (audit #5)** — `public/` has only
  `images/placeholder.svg`; the portfolio empty state already handles zero
  case studies gracefully. Real covers arrive with real MDX case studies —
  content task, not design.
- **Footer social links (audit #8)** — `socialLinks` is deliberately empty
  pending verified accounts (`src/lib/site.ts:15-16`); needs real accounts,
  not code.
- **AOS / new animation library (audit #7)** — framer-motion is already
  installed; adding AOS duplicates capability.
- **PurgeCSS / Terser (audit #10)** — Tailwind purges and Next minifies by
  default; no-op.
- **Testimonials section** — not requested and no testimonial content exists.

## 4. Verification

Run from repo root:

```bash
pnpm lint
pnpm test        # vitest unit tests, incl. new reveal.test.tsx
pnpm build       # next build — catches type/SSR errors in Reveal
```

Eyeball (`pnpm dev`, Chrome DevTools):

1. Homepage: scroll slowly — services, differentiators, newsletter, and
   "Ready to build" sections fade/slide in once; hero does NOT animate.
2. DevTools → Rendering → emulate `prefers-reduced-motion: reduce` — no
   reveal animation, no hover scale, content fully visible immediately.
3. Toggle dark mode — reveals and dividers look correct in both themes.
4. Mobile viewport (375px): hamburger and theme toggle are comfortably
   tappable; mobile menu links have vertical breathing room.
5. Blog post body and footer tagline read with the looser line-height.
6. `pnpm build` output: no new client-bundle size regression beyond the
   framer-motion chunk that ServiceCard already pulls in.
