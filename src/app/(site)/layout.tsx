import { CursorGlow } from "@/components/atoms/cursor-glow";
import { SkipLink } from "@/components/atoms/skip-link";
import { ScrollToTop } from "@/components/atoms/scroll-to-top";
import { Footer } from "@/components/organisms/footer";
import { Navigation } from "@/components/organisms/navigation";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CursorGlow />
      <div className="flex min-h-screen flex-col">
        <SkipLink />
        <Navigation />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
