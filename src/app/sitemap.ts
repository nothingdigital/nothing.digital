import { MetadataRoute } from "next";

import { brandConfig } from "@/brand";
import { listMdxFiles } from "@/lib/mdx";
import { routes } from "@/lib/routes";

function url(path: string): string {
  return `${brandConfig.url}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [portfolioSlugs, blogSlugs] = await Promise.all([
    listMdxFiles("portfolio"),
    listMdxFiles("blog"),
  ]);

  const staticPages = [
    routes.home,
    routes.services.index,
    routes.services.websiteDevelopment,
    routes.services.softwareSolutions,
    routes.services.applications,
    routes.services.emailMarketing,
    routes.services.aiSolutions,
    routes.services.techLiteracy,
    routes.services.codingSql,
    ...(portfolioSlugs.length > 0 ? [routes.portfolio.index] : []),
    routes.blog.index,
    routes.about,
    routes.pricing,
    routes.contact,
    "/privacy",
    "/terms",
    "/accessibility",
  ];

  return [
    ...staticPages.map((path) => ({
      url: url(path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === routes.home ? 1 : 0.7,
    })),
    ...blogSlugs.map((slug) => ({
      url: url(routes.blog.post(slug)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...portfolioSlugs.map((slug) => ({
      url: url(routes.portfolio.detail(slug)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
