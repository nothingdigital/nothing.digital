import type { Metadata } from "next";

import { MarketingLayout } from "@/components/templates/marketing-layout";
import { SectionContainer } from "@/components/atoms/section-container";
import { PortfolioFilter } from "@/components/molecules/portfolio-filter";
import { getAllFrontmatter, type PortfolioFrontmatter } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Our Work — Nothing.Digital",
  description:
    "Explore our portfolio of websites, applications, and digital campaigns.",
};

export default async function PortfolioPage() {
  const items = await getAllFrontmatter<PortfolioFrontmatter>("portfolio");

  return (
    <MarketingLayout>
      <SectionContainer>
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Our Work
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Selected projects that show how we turn ideas into results.
          </p>
        </div>

        <PortfolioFilter items={items} />
      </SectionContainer>
    </MarketingLayout>
  );
}
