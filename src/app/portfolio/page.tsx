import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLayout } from "@/components/templates/marketing-layout";
import { SectionContainer } from "@/components/atoms/section-container";
import { PortfolioFilter } from "@/components/molecules/portfolio-filter";
import { Button } from "@/components/ui/button";
import { getAllFrontmatter, type PortfolioFrontmatter } from "@/lib/mdx";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Selected client work from Nothing.Digital — websites, software, and campaigns.",
};

export default async function PortfolioPage() {
  const items = await getAllFrontmatter<PortfolioFrontmatter>("portfolio");

  return (
    <MarketingLayout>
      <SectionContainer>
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
            Selected work
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            Our Work
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Projects we are proud to put our name on.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-xl border-2 border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">
              No published case studies right now. If you have a project in
              mind, we would rather talk about yours.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href={routes.contact}>Book a free scoping call</Link>
              </Button>
            </div>
          </div>
        ) : (
          <PortfolioFilter items={items} />
        )}
      </SectionContainer>
    </MarketingLayout>
  );
}
