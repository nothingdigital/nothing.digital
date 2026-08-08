import { describe, expect, it } from "vitest";
import { brandConfig, getFromEmail, resolveSiteUrl } from "./index";

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

describe("resolveSiteUrl", () => {
  it("falls back when env is missing or blank", () => {
    expect(resolveSiteUrl(undefined)).toBe("https://nothing.digital");
    expect(resolveSiteUrl("")).toBe("https://nothing.digital");
    expect(resolveSiteUrl("   ")).toBe("https://nothing.digital");
  });

  it("keeps a real URL", () => {
    expect(resolveSiteUrl("https://example.com")).toBe("https://example.com");
  });
});

describe("getFromEmail", () => {
  it("returns brandConfig.fromEmail", () => {
    expect(getFromEmail()).toBe(brandConfig.fromEmail);
  });
});
