# Manual Accessibility Runbook

> Companion to automated axe-core scans. Run these checks before any production release.

## Keyboard navigation

1. Disconnect mouse / trackpad.
2. Press `Tab` from the browser address bar through the page.
3. Verify:
   - Every interactive element (links, buttons, form fields, modals, menus) receives focus.
   - Focus order matches the visual reading order (left-to-right, top-to-bottom).
   - No focus traps; `Shift+Tab` moves backward.
   - Focus indicators are visible (`:focus-visible` ring or equivalent).
4. Activate buttons and links with `Enter`; activate native buttons with `Space`.
5. Test the contact form and newsletter form without a mouse.
6. Open and close the mobile menu with keyboard only; focus returns to the trigger.

## Screen reader

1. Use VoiceOver (macOS) or NVDA (Windows).
2. Navigate by headings (`Ctrl+Option+Cmd+H` / `H`).
   - Verify page has exactly one `<h1>` and logical heading hierarchy.
3. Navigate by landmarks (`Ctrl+Option+U` rotor / `D`).
   - Verify `header`, `main`, `nav`, `footer`, and `aside` are announced.
4. Focus the contact form fields.
   - Verify each input has an associated `<label>` or `aria-label`.
   - Verify error messages are linked via `aria-describedby` or `aria-errormessage`.
5. Activate links and buttons.
   - Verify purpose is announced (no "click here" or "read more" alone).
6. Review dynamic content.
   - Newsletter success/error messages are announced via `aria-live="polite"`.

## `prefers-reduced-motion`

1. Enable reduced motion:
   - macOS: System Settings → Accessibility → Display → Reduce motion.
   - Windows: Settings → Accessibility → Visual effects → Animation effects → Off.
2. Reload the page.
3. Verify:
   - No auto-playing motion, parallax, or large entrance animations run.
   - Accordions and modals still open/close instantly or use simple opacity fades only.
   - No layout shifts caused by suppressed animations.
4. If using Chrome DevTools, emulate `prefers-reduced-motion: reduce` in the Rendering tab as a smoke test.

## Checklist

- [x] Automated axe-core scan has zero violations — 11 public pages, chromium-desktop, 2026-08-06.
- [x] Color contrast fixes applied (primary text on muted backgrounds, opacity on primary-foreground).
- [x] ARIA prohibited attribute fixed on hero clock (`role="img"`).
- [ ] Keyboard navigation passes on all unique page layouts — smoke test only; full pass needs human verification.
- [ ] Screen reader headings and landmarks are logical — requires VoiceOver/NVDA check.
- [ ] All images have meaningful `alt` text or are hidden from assistive tech — verified in code, needs spot-check on new assets.
- [ ] Focus is managed for dialogs, menus, and form success states — form success state is a full-page reload; verify in browser.
- [ ] `prefers-reduced-motion` removes non-essential motion — unit test covers `Reveal`; verify manually in OS settings.

## Automated run details

Command run locally:

```bash
NEXT_PUBLIC_SITE_URL=https://nothing.digital pnpm exec playwright test e2e/a11y.spec.ts --project=chromium-desktop
```

Pages scanned: `/`, `/services`, `/services/website-development`, `/pricing`, `/about`, `/blog`, `/blog/why-performance-matters`, `/contact`, `/privacy`, `/terms`, `/accessibility`.

Result: 11 passed, 0 axe-core violations (wcag2a, wcag2aa, wcag21aa tags).

Note: `/admin` routes were not scanned because they require authentication.
