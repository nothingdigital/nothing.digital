import type { Metadata } from "next";

import { SectionContainer } from "@/components/atoms/section-container";
import { BlogCard } from "@/components/molecules/blog-card";
import { Badge } from "@/components/ui/badge";
import { getAllFrontmatter, type BlogFrontmatter } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Insights & Articles",
  description:
    "Articles on performance, design systems, email automation, and digital strategy.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Insights & Articles",
    description:
      "Articles on performance, design systems, email automation, and digital strategy.",
    url: "/blog",
    type: "website",
  },
};

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

export default async function BlogPage() {
  const items = await getAllFrontmatter<BlogFrontmatter>("blog");
  const sorted = items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const tags = collectTags(items);

  return (
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

      {sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No articles yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((item) => (
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
    </SectionContainer>
  );
}
