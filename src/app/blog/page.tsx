import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLayout } from "@/components/templates/marketing-layout";
import { SectionContainer } from "@/components/atoms/section-container";
import { BlogCard } from "@/components/molecules/blog-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllFrontmatter, type BlogFrontmatter } from "@/lib/mdx";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Insights & Articles",
  description:
    "Articles on performance, design systems, email automation, and digital strategy.",
  alternates: { canonical: "/blog" },
};

const PAGE_SIZE = 6;

function parsePage(value: string | undefined): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 1) return 1;
  return parsed;
}

function collectTags(items: BlogFrontmatter[]): string[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams;
  const items = await getAllFrontmatter<BlogFrontmatter>("blog");
  const sorted = items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const page = parsePage(pageParam);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(offset, offset + PAGE_SIZE);
  const tags = collectTags(items);

  return (
    <MarketingLayout>
      <SectionContainer>
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Insights & Articles
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Thoughts on building fast, usable, and scalable digital products.
          </p>
        </div>

        {tags.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {pageItems.length === 0 ? (
          <div className="rounded-lg border border-dashed py-16 text-center">
            <p className="text-muted-foreground">No articles yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item) => (
              <BlogCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                excerpt={item.description}
                date={item.date}
                author={item.author}
                tags={item.tags}
                coverImage={item.coverImage}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Pagination"
          >
            {safePage > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`${routes.blog.index}?page=${safePage - 1}`}>
                  Previous
                </Link>
              </Button>
            )}

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => {
                const isActive = pageNumber === safePage;
                return (
                  <Button
                    key={pageNumber}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link href={`${routes.blog.index}?page=${pageNumber}`}>
                      {pageNumber}
                    </Link>
                  </Button>
                );
              },
            )}

            {safePage < totalPages && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`${routes.blog.index}?page=${safePage + 1}`}>
                  Next
                </Link>
              </Button>
            )}
          </nav>
        )}
      </SectionContainer>
    </MarketingLayout>
  );
}
