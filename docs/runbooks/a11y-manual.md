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

- [ ] Keyboard navigation passes on all unique page layouts.
- [ ] Screen reader headings and landmarks are logical.
- [ ] All images have meaningful `alt` text or are hidden from assistive tech.
- [ ] Focus is managed for dialogs, menus, and form success states.
- [ ] `prefers-reduced-motion` removes non-essential motion.
- [ ] Color contrast is ≥ 4.5:1 for normal text and ≥ 3:1 for UI components.
- [ ] Automated axe-core scan has zero violations.
