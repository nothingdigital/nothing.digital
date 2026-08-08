import { brandConfig } from "./config";

export {
  brandConfig,
  resolveSiteUrl,
  type BrandConfig,
  type BrandAssets,
} from "./config";
// ponytail: thin wrapper so other call sites keep compiling after email.ts delete.
export const getFromEmail = () => brandConfig.fromEmail;
export {
  DEFAULT_MODULES,
  MODULE_IDS,
  isModuleEnabled,
  moduleForAdminPath,
  withModules,
  type ModuleFlags,
  type ModuleId,
} from "./modules";
