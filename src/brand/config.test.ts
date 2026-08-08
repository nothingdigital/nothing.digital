import { describe, expect, it } from "vitest";
import { brandConfig } from "./config";
import { getFromEmail } from "./email";

describe("brandConfig", () => {
  it("exposes Nothing.Digital defaults", () => {
    expect(brandConfig.name).toBe("Nothing.Digital");
    expect(brandConfig.email).toContain("@");
    expect(brandConfig.fromEmail).toContain(brandConfig.name);
    expect(brandConfig.assets.wordmarkLight).toMatch(/^\/images\//);
  });
});

describe("getFromEmail", () => {
  it("returns brandConfig.fromEmail", () => {
    expect(getFromEmail()).toBe(brandConfig.fromEmail);
  });
});
