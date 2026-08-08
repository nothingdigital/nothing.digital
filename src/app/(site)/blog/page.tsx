import type { Metadata } from "next";

import { SectionContainer } from "@/components/atoms/section-container";
import { BlogCard } from "@/components/molecules/blog-card";
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

export default async function BlogPage() {
  const items = await getAllFrontmatter<BlogFrontmatter>("blog");
  const sorted = items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

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
