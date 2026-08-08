import Link from "next/link";

import { DEFAULT_MODULES, isModuleEnabled, moduleForAdminPath } from "@/brand";

type ModuleGateProps = {
  pathname: string | null;
  children: React.ReactNode;
};

/** Server-side soft gate: skip rendering disabled module pages. */
export function ModuleGate({ pathname, children }: ModuleGateProps) {
  const moduleId = pathname ? moduleForAdminPath(pathname) : null;
  if (moduleId && !isModuleEnabled(moduleId, DEFAULT_MODULES)) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-sm text-muted-foreground">
          This module is disabled for this deployment.
        </p>
        <Link href="/admin" className="text-sm font-medium underline">
          Back to admin home
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
