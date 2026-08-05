import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { MarketingLayout } from "@/components/templates/marketing-layout";
import { SectionContainer } from "@/components/atoms/section-container";
import { JsonLd } from "@/components/atoms/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/molecules/blog-card";
import {
  readMdxFile,
  listMdxFiles,
  getAllFrontmatter,
  type BlogFrontmatter,
} from "@/lib/mdx";
import { routes } from "@/lib/routes";

export async function generateStaticParams() {
  const slugs = await listMdxFiles("blog");
  return slugs.map((slug) => ({ slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = await readMdxFile<BlogFrontmatter>("blog", slug);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: routes.blog.post(slug) },
  };
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function findRelatedPosts(
  current: BlogFrontmatter,
  all: BlogFrontmatter[],
  limit = 3,
): BlogFrontmatter[] {
  const others = all.filter((item) => item.slug !== current.slug);

  const scored = others.map((item) => {
    const shared = item.tags.filter((tag) => current.tags.includes(tag)).length;
    return { item, shared };
  });

  scored.sort((a, b) => {
    if (b.shared !== a.shared) return b.shared - a.shared;
    return new Date(b.item.date).getTime() - new Date(a.item.date).getTime();
  });

  return scored.slice(0, limit).map((entry) => entry.item);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let frontmatter: BlogFrontmatter;
  let content: React.ReactNode;

  try {
    const parsed = await readMdxFile<BlogFrontmatter>("blog", slug);
    frontmatter = parsed.frontmatter;
    content = parsed.content;
  } catch {
    notFound();
  }

  const allPosts = await getAllFrontmatter<BlogFrontmatter>("blog");
  const related = findRelatedPosts(frontmatter, allPosts);

  const jsonLd = {
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    url: `https://nothing.digital${routes.blog.post(frontmatter.slug)}`,
    datePublished: frontmatter.date,
    author: {
      "@type": "Person",
      name: frontmatter.author,
      ...(frontmatter.authorRole && { jobTitle: frontmatter.authorRole }),
    },
    keywords: frontmatter.tags.join(", "),
  };

  return (
    <MarketingLayout>
      <JsonLd data={jsonLd} />

      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href={routes.blog.index}>← Back to articles</Link>
          </Button>

          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            {frontmatter.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {frontmatter.description}
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            {formatDate(frontmatter.date)} · {frontmatter.author}
            {frontmatter.authorRole && `, ${frontmatter.authorRole}`}
          </p>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted">
        <article className="mx-auto max-w-3xl space-y-6 leading-7 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2">
          {content}
        </article>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">About the author</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {frontmatter.author}
              {frontmatter.authorRole && (
                <span className="ml-1 text-foreground">
                  — {frontmatter.authorRole}
                </span>
              )}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Writing about design, engineering, and growth at Nothing.Digital.
            </p>
          </div>
        </div>
      </SectionContainer>

      {related.length > 0 && (
        <SectionContainer variant="muted">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-2xl font-semibold">Related articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
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
          </div>
        </SectionContainer>
      )}

      <SectionContainer variant="primary">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Get insights in your inbox
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Join our newsletter for articles on performance, design, and growth.
          </p>
          <Button variant="secondary" size="lg" asChild className="mt-6">
            <Link href={routes.contact}>Subscribe</Link>
          </Button>
        </div>
      </SectionContainer>
    </MarketingLayout>
  );
}
