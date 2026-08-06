import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out";
import { getSessionUser } from "@/lib/admin/auth";
import { isAdminEmail } from "@/lib/admin/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const isAdmin = Boolean(user && isAdminEmail(user.email));
  const pathname = (await headers()).get("x-pathname");

  if (!isAdmin && pathname !== "/admin/login") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Nothing.Digital
            </p>
            <h1 className="font-display text-2xl tracking-tight">Admin</h1>
          </div>
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <p className="hidden text-sm text-muted-foreground sm:block">
                {user?.email}
              </p>
              <AdminSignOutButton />
            </div>
          ) : null}
        </div>
      </header>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {isAdmin ? <AdminNav /> : null}
        {children}
      </div>
    </div>
  );
}
