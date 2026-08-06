import { routes, type ServiceSlug } from "@/lib/routes";

export interface PricingBallpark {
  slug: ServiceSlug;
  title: string;
  range: string;
  summary: string;
  href: string;
}

/** Approved ballpark ranges — fixed quote after scoping. */
export const pricingBallparks: PricingBallpark[] = [
  {
    slug: "website-development",
    title: "Websites",
    range: "$5K–$15K",
    summary: "Marketing sites, landing pages, and content-driven builds.",
    href: routes.services.websiteDevelopment,
  },
  {
    slug: "software-solutions",
    title: "Software",
    range: "$15K–$60K",
    summary: "Custom tools, dashboards, and workflow automation.",
    href: routes.services.softwareSolutions,
  },
  {
    slug: "applications",
    title: "Apps",
    range: "$20K–$80K",
    summary: "Web and mobile products designed for scale.",
    href: routes.services.applications,
  },
  {
    slug: "email-marketing",
    title: "Email marketing",
    range: "$1.5K–$5K/mo",
    summary: "Campaign strategy, automation, and ongoing nurture.",
    href: routes.services.emailMarketing,
  },
];
