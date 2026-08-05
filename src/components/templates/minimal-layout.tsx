import * as React from "react";
import Link from "next/link";

export interface MinimalLayoutProps {
  children: React.ReactNode;
  showBackLink?: boolean;
}

export function MinimalLayout({
  children,
  showBackLink = true,
}: MinimalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-4 py-4 md:px-6 lg:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Nothing.Digital
          </Link>
          {showBackLink && (
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to home
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
