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
  blog: {
    index: "/blog",
    post: (slug: string) => `/blog/${slug}`,
  },
  contact: "/contact",
  api: {
    contact: "/api/contact",
    newsletter: "/api/newsletter",
    health: "/api/health",
  },
} as const;

export type ServiceSlug =
  | "website-development"
  | "software-solutions"
  | "applications"
  | "email-marketing";

export const serviceSlugs: ServiceSlug[] = [
  "website-development",
  "software-solutions",
  "applications",
  "email-marketing",
];
