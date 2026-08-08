"use client";

import { Footer } from "@/components/organisms/footer";
import { Navigation } from "@/components/organisms/navigation";
import { ScrollToTop } from "@/components/atoms/scroll-to-top";

export function ErrorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
