import type { Metadata } from "next";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { PageHero } from "@/components/molecules/page-hero";
import { PortfolioCard } from "@/components/molecules/portfolio-card";
import { Button } from "@/components/ui/button";
import { getAllFrontmatter, type PortfolioFrontmatter } from "@/lib/mdx";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Selected client work from Nothing.Digital — websites, software, and campaigns.",
  alternates: { canonical: routes.portfolio.index },
  openGraph: {
    title: "Our Work",
    description:
      "Selected client work from Nothing.Digital — websites, software, and campaigns.",
    url: routes.portfolio.index,
    type: "website",
  },
};

export default async function PortfolioPage() {
  const items = await getAllFrontmatter<PortfolioFrontmatter>("portfolio");

  return (
    <>
      <PageHero
        kicker="Selected work"
        title="Our Work"
        description="Projects we are proud to put our name on."
      />

      <SectionContainer>
        {items.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-xl border-2 border-dashed border-border py-16 text-center">
            <p className="leading-relaxed text-muted-foreground">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PortfolioCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                client={item.client}
                industry={item.industry}
                services={item.services}
                coverImage={item.coverImage}
              />
            ))}
          </div>
        )}
      </SectionContainer>
    </>
  );
}
