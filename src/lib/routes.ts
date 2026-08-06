export const routes = {
  home: "/",
  services: {
    index: "/services",
    websiteDevelopment: "/services/website-development",
    softwareSolutions: "/services/software-solutions",
    applications: "/services/applications",
    emailMarketing: "/services/email-marketing",
  },
  portfolio: {
    index: "/portfolio",
    detail: (slug: string) => `/portfolio/${slug}`,
  },
  about: "/about",
  pricing: "/pricing",
  blog: {
    index: "/blog",
    post: (slug: string) => `/blog/${slug}`,
  },
  contact: "/contact",
  api: {
    newsletter: "/api/newsletter",
  },
} as const;

export const serviceSlugs = [
  "website-development",
  "software-solutions",
  "applications",
  "email-marketing",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];
