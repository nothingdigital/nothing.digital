import { MetadataRoute } from "next";

import { brandConfig } from "@/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${brandConfig.url}/sitemap.xml`,
  };
}
