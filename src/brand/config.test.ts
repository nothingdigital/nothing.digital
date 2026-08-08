import { describe, expect, it } from "vitest";
import { brandConfig, getFromEmail } from "./index";

describe("brandConfig", () => {
  it("exposes Nothing.Digital defaults", () => {
    expect(brandConfig.name).toBe("Nothing.Digital");
    expect(brandConfig.email).toContain("@");
    expect(brandConfig.fromEmail).toContain(brandConfig.name);
    expect(brandConfig.assets.wordmarkLight).toMatch(/^\/images\//);
    expect(brandConfig.assets.mascotQuiet).toBe(
      "/images/brand/anonymouse-quiet.png",
    );
    expect(brandConfig.assets.mascotFriendly).toBe(
      "/images/brand/anonymouse-friendly.png",
    );
  });
});

describe("getFromEmail", () => {
  it("returns brandConfig.fromEmail", () => {
    expect(getFromEmail()).toBe(brandConfig.fromEmail);
  });
});
