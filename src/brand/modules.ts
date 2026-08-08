export const MODULE_IDS = [
  "core",
  "inbox",
  "clients",
  "billing",
  "work",
  "newsletter",
  "outbound",
  "health",
  "docs",
  "ai",
] as const;

export type ModuleId = (typeof MODULE_IDS)[number];

export type ModuleFlags = Record<ModuleId, boolean>;

export const DEFAULT_MODULES: ModuleFlags = {
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
};

/** Merge overrides; `core` cannot be disabled. */
export function withModules(overrides: Partial<ModuleFlags> = {}): ModuleFlags {
  return { ...DEFAULT_MODULES, ...overrides, core: true };
}

export function isModuleEnabled(
  id: ModuleId,
  flags: ModuleFlags = DEFAULT_MODULES,
): boolean {
  if (id === "core") return true;
  return flags[id] === true;
}

/** Map admin path prefix → module (null = always allowed when admin). */
export function moduleForAdminPath(pathname: string): ModuleId | null {
  if (pathname.startsWith("/admin/inbox")) return "inbox";
  if (pathname.startsWith("/admin/outbound")) return "outbound";
  if (pathname.startsWith("/admin/clients")) return "clients";
  if (pathname.startsWith("/admin/billing")) return "billing";
  if (pathname.startsWith("/admin/work")) return "work";
  if (pathname.startsWith("/admin/newsletter")) return "newsletter";
  if (pathname.startsWith("/admin/health")) return "health";
  if (pathname.startsWith("/admin/docs")) return "docs";
  return null;
}
