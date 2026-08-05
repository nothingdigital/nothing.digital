import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";

// ponytail: minimal MDX helper for local content/ folder; no remote fetching.

const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface BaseFrontmatter {
  title: string;
  description: string;
  slug: string;
}

export interface BlogFrontmatter extends BaseFrontmatter {
  date: string;
  author: string;
  authorRole?: string;
  tags: string[];
  coverImage?: string;
}

export interface PortfolioFrontmatter extends BaseFrontmatter {
  client: string;
  industry: string;
  services: string[];
  duration: string;
  coverImage?: string;
  results: Array<{ label: string; value: string }>;
  testimonial?: { quote: string; author: string; role: string };
}

export interface ParsedMdx<T> {
  frontmatter: T;
  content: React.ReactNode;
}

function contentDir(kind: "blog" | "portfolio"): string {
  return path.join(CONTENT_ROOT, kind);
}

export async function readMdxFile<T>(
  kind: "blog" | "portfolio",
  slug: string,
): Promise<ParsedMdx<T>> {
  const filePath = path.join(contentDir(kind), `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");
  const { content, data } = matter(source);

  const mdx = await compileMDX<Record<string, unknown>>({
    source: content,
    options: { parseFrontmatter: false },
  });

  return {
    frontmatter: data as T,
    content: mdx.content,
  };
}

export async function listMdxFiles(
  kind: "blog" | "portfolio",
): Promise<string[]> {
  const dir = contentDir(kind);

  try {
    const entries = await fs.readdir(dir);
    return entries
      .filter((entry) => entry.endsWith(".mdx"))
      .map((entry) => entry.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export async function getAllFrontmatter<T>(
  kind: "blog" | "portfolio",
): Promise<T[]> {
  const slugs = await listMdxFiles(kind);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = path.join(contentDir(kind), `${slug}.mdx`);
      const source = await fs.readFile(filePath, "utf-8");
      const { data } = matter(source);
      return { ...(data as T), slug };
    }),
  );

  return posts;
}
