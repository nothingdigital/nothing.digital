import { afterEach, describe, expect, it, vi } from "vitest";

import { focusMainContent, getFocusableElements, trapTabKey } from "./a11y";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("getFocusableElements", () => {
  it("returns interactive elements in DOM order", () => {
    document.body.innerHTML = `
      <div id="root">
        <a href="/a">A</a>
        <button type="button">B</button>
        <button type="button" disabled>skip</button>
        <a href="/c" tabindex="-1">hidden</a>
        <input type="text" />
      </div>
    `;

    const root = document.getElementById("root")!;
    const focusables = getFocusableElements(root);

    expect(focusables.map((el) => el.textContent || el.tagName)).toEqual([
      "A",
      "B",
      "INPUT",
    ]);
  });

  it("skips display:none elements", () => {
    document.body.innerHTML = `
      <div id="root">
        <button type="button">Visible</button>
        <button type="button" style="display: none">Hidden</button>
      </div>
    `;

    const root = document.getElementById("root")!;
    const focusables = getFocusableElements(root);

    expect(focusables).toHaveLength(1);
    expect(focusables[0]?.textContent).toBe("Visible");
  });
});

describe("trapTabKey", () => {
  it("wraps forward Tab from last to first", () => {
    document.body.innerHTML = `
      <div id="root">
        <button type="button" id="first">First</button>
        <button type="button" id="last">Last</button>
      </div>
    `;
    const root = document.getElementById("root")!;
    const first = document.getElementById("first")!;
    const last = document.getElementById("last")!;
    last.focus();

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    const preventDefault = vi.spyOn(event, "preventDefault");

    trapTabKey(root, event);

    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab from first to last", () => {
    document.body.innerHTML = `
      <div id="root">
        <button type="button" id="first">First</button>
        <button type="button" id="last">Last</button>
      </div>
    `;
    const root = document.getElementById("root")!;
    const first = document.getElementById("first")!;
    const last = document.getElementById("last")!;
    first.focus();

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    const preventDefault = vi.spyOn(event, "preventDefault");

    trapTabKey(root, event);

    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(last);
  });
});

describe("focusMainContent", () => {
  it("focuses #main and ensures tabindex", () => {
    document.body.innerHTML = `<main id="main">content</main>`;
    const main = document.getElementById("main")!;

    focusMainContent();

    expect(main.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(main);
  });
});
