import { describe, expect, it } from "vitest";

import { isBlockedByDnc } from "./map-lead";

describe("map lead helpers", () => {
  it("blocks DNC by email or website host", () => {
    const block = new Set(["skip@x.com", "bad.com"]);
    expect(isBlockedByDnc(block, "skip@x.com", null)).toBe(true);
    expect(isBlockedByDnc(block, null, "https://bad.com/page")).toBe(true);
    expect(isBlockedByDnc(block, "ok@x.com", "https://ok.com")).toBe(false);
  });
});
