const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.tabIndex >= 0 && el.checkVisibility());
}

/** Keep Tab / Shift+Tab cycling inside `container`. */
export function trapTabKey(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== "Tab") return;

  const focusables = getFocusableElements(container);
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (!first || !last) return;

  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/** Move focus to `#main` after a transient dialog/banner closes. */
export function focusMainContent(): void {
  const main = document.getElementById("main");
  if (!(main instanceof HTMLElement)) return;

  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
  }
  main.focus({ preventScroll: true });
}
