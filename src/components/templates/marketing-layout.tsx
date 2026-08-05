import * as React from "react";

import { Navigation } from "@/components/organisms/navigation";
import { Footer } from "@/components/organisms/footer";
import { ScrollToTop } from "@/components/atoms/scroll-to-top";

export interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
