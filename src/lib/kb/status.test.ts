import { describe, expect, it } from "vitest";

import { assertTransition, canTransition } from "./status";

describe("canTransition", () => {
  it("allows draft → in_review", () => {
    expect(canTransition("draft", "in_review")).toBe(true);
  });

  it("allows in_review → approved", () => {
    expect(canTransition("in_review", "approved")).toBe(true);
  });

  it("allows in_review → draft", () => {
    expect(canTransition("in_review", "draft")).toBe(true);
  });

  it("allows approved → draft", () => {
    expect(canTransition("approved", "draft")).toBe(true);
  });

  it("blocks draft → approved skip", () => {
    expect(canTransition("draft", "approved")).toBe(false);
  });

  it("blocks approved → in_review", () => {
    expect(canTransition("approved", "in_review")).toBe(false);
  });

  it("blocks same-status no-ops", () => {
    expect(canTransition("draft", "draft")).toBe(false);
    expect(canTransition("approved", "approved")).toBe(false);
  });
});

describe("assertTransition", () => {
  it("passes on legal transitions", () => {
    expect(() => assertTransition("draft", "in_review")).not.toThrow();
  });

  it("throws on illegal jumps", () => {
    expect(() => assertTransition("draft", "approved")).toThrow(
      /Illegal KB status transition/,
    );
  });
});
