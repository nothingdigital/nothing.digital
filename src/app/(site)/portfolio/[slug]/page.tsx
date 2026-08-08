import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { JsonLd } from "@/components/atoms/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  readMdxFile,
  listMdxFiles,
  type PortfolioFrontmatter,
} from "@/lib/mdx";
import { routes } from "@/lib/routes";

export async function generateStaticParams() {
  const slugs = await listMdxFiles("portfolio");
  return slugs.map((slug) => ({ slug }));
}

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await readMdxFile<PortfolioFrontmatter>(
    "portfolio",
    slug,
  );

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: routes.portfolio.detail(slug) },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: routes.portfolio.detail(slug),
      type: "article",
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { slug } = await params;
  let frontmatter: PortfolioFrontmatter;
  let content: React.ReactNode;

  try {
    const parsed = await readMdxFile<PortfolioFrontmatter>("portfolio", slug);
    frontmatter = parsed.frontmatter;
    content = parsed.content;
  } catch {
    notFound();
  }

  const jsonLd = {
    "@type": "CreativeWork",
    name: frontmatter.title,
    description: frontmatter.description,
    url: `https://nothing.digital${routes.portfolio.detail(frontmatter.slug)}`,
    about: frontmatter.industry,
    audience: { "@type": "Audience", audienceType: frontmatter.industry },
    ...(frontmatter.client && {
      creator: { "@type": "Organization", name: frontmatter.client },
    }),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href={routes.portfolio.index}>← Back to portfolio</Link>
          </Button>

          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {frontmatter.client} — {frontmatter.industry}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            {frontmatter.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {frontmatter.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {frontmatter.services.map((service) => (
              <Badge key={service} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>

          {frontmatter.duration && (
            <p className="mt-4 text-sm text-muted-foreground">
              Duration: {frontmatter.duration}
            </p>
          )}
        </div>
      </SectionContainer>

      <SectionContainer variant="muted">
        <div className="mx-auto max-w-3xl space-y-6 leading-7 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2">
          {content}
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold">Results</h2>
          <dl className="grid gap-4 sm:grid-cols-3">
            {frontmatter.results.map((result) => (
              <div
                key={result.label}
                className="rounded-lg border bg-card p-4 text-center"
              >
                <dt className="text-sm text-muted-foreground">
                  {result.label}
                </dt>
                <dd className="mt-1 text-2xl font-bold">{result.value}</dd>
              </div>
            ))}
          </dl>

          {frontmatter.testimonial && (
            <blockquote className="mt-10 rounded-lg border-l-4 border-primary bg-card p-6 italic">
              <p className="text-lg">“{frontmatter.testimonial.quote}”</p>
              <footer className="mt-4 text-sm font-medium not-italic">
                {frontmatter.testimonial.author}
                {frontmatter.testimonial.role && (
                  <span className="text-muted-foreground">
                    , {frontmatter.testimonial.role}
                  </span>
                )}
              </footer>
            </blockquote>
          )}
        </div>
      </SectionContainer>
    </>
  );
}
