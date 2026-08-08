import { describe, expect, it } from "vitest";
import {
  DEFAULT_MODULES,
  isModuleEnabled,
  moduleForAdminPath,
  type ModuleId,
  withModules,
} from "./modules";

describe("modules", () => {
  it("enables all default ND modules", () => {
    expect(isModuleEnabled("outbound")).toBe(true);
    expect(isModuleEnabled("inbox")).toBe(true);
  });

  it("disables a module when overridden", () => {
    const flags = withModules({ outbound: false });
    expect(isModuleEnabled("outbound", flags)).toBe(false);
    expect(isModuleEnabled("inbox", flags)).toBe(true);
  });

  it("treats core as always on", () => {
    const flags = withModules({
      core: false,
    } as Partial<Record<ModuleId, boolean>>);
    expect(isModuleEnabled("core", flags)).toBe(true);
  });

  it("DEFAULT_MODULES matches expected keys", () => {
    expect(DEFAULT_MODULES).toMatchObject({
      core: true,
      inbox: true,
      clients: true,
      billing: true,
      work: true,
      newsletter: true,
      outbound: true,
      health: true,
      docs: true,
      ai: true,
    });
  });

  it("maps admin paths to modules", () => {
    expect(moduleForAdminPath("/admin/outbound")).toBe("outbound");
    expect(moduleForAdminPath("/admin/outbound/foo")).toBe("outbound");
    expect(moduleForAdminPath("/admin")).toBeNull();
    expect(moduleForAdminPath("/admin/settings")).toBeNull();
    expect(moduleForAdminPath("/admin/login")).toBeNull();
  });
});
