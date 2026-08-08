import fs from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "System map",
  robots: { index: false, follow: false },
};

const SYSTEM_MAP_PATH = path.join(process.cwd(), "docs", "SYSTEM-MAP.md");
const GITHUB_DOCS_BASE =
  "https://github.com/nothingdigital/nothing.digital/blob/main/docs";
const GITHUB_ROOT_BASE =
  "https://github.com/nothingdigital/nothing.digital/blob/main";

/** Point relative markdown links at the repo so they work outside the filesystem. */
function rewriteDocLinks(source: string): string {
  return source.replace(
    /\]\((?!https?:|#|\/)([^)]+\.md(?:#[^)]*)?)\)/g,
    (_match, target: string) => {
      const [file, hash = ""] = target.split("#");
      const hashSuffix = hash ? `#${hash}` : "";
      if (file.startsWith("../")) {
        const normalized = path.posix.normalize(`docs/${file}`);
        return `](${GITHUB_ROOT_BASE}/${normalized}${hashSuffix})`;
      }
      const cleaned = file.replace(/^\.\//, "");
      return `](${GITHUB_DOCS_BASE}/${cleaned}${hashSuffix})`;
    },
  );
}

const mdxComponents = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (!href) return <span>{children}</span>;
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="text-primary underline-offset-4 hover:underline"
      >
        {children}
      </Link>
    );
  },
};

export default async function AdminSystemMapPage() {
  let content: React.ReactNode;
  let error: string | null = null;

  try {
    const raw = await fs.readFile(SYSTEM_MAP_PATH, "utf-8");
    const mdx = await compileMDX({
      source: rewriteDocLinks(raw),
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    });
    content = mdx.content;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load system map.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">System map</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How Nothing.Digital works — client, admin, integrations, workflows.
          Source: <code className="text-xs">docs/SYSTEM-MAP.md</code>
        </p>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <article
          className={
            "space-y-4 text-sm leading-relaxed text-foreground " +
            "[&_h1]:font-display [&_h1]:text-3xl [&_h1]:tracking-tight " +
            "[&_h2]:mt-8 [&_h2]:border-t [&_h2]:border-border [&_h2]:pt-6 " +
            "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight " +
            "[&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold " +
            "[&_p]:text-muted-foreground [&_li]:text-muted-foreground " +
            "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 " +
            "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 " +
            "[&_blockquote]:border-l-2 [&_blockquote]:border-border " +
            "[&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground " +
            "[&_hr]:border-border " +
            "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 " +
            "[&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground " +
            "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border " +
            "[&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-3 " +
            "[&_pre_code]:bg-transparent [&_pre_code]:p-0 " +
            "[&_table]:w-full [&_table]:overflow-hidden [&_table]:text-left " +
            "[&_th]:border-b [&_th]:border-border [&_th]:px-2 [&_th]:py-2 " +
            "[&_th]:font-medium [&_th]:text-foreground " +
            "[&_td]:border-b [&_td]:border-border [&_td]:px-2 [&_td]:py-2 " +
            "[&_td]:align-top [&_td]:text-muted-foreground " +
            "[&_strong]:font-medium [&_strong]:text-foreground"
          }
        >
          {content}
        </article>
      )}
    </div>
  );
}
