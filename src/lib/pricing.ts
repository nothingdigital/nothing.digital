import { routes, type ServiceSlug } from "@/lib/routes";

export interface PricingService {
  slug: ServiceSlug;
  title: string;
  /** Short fit cue — who/what the service is for. No dollar amounts. */
  fit: string;
  summary: string;
  href: string;
}

/** Service cards for the pricing page — fixed quote after scoping. */
export const pricingServices: PricingService[] = [
  {
    slug: "website-development",
    title: "Websites",
    fit: "Marketing sites & brand launches",
    summary: "Marketing sites, landing pages, and content-driven builds.",
    href: routes.services.websiteDevelopment,
  },
  {
    slug: "software-solutions",
    title: "Software",
    fit: "Custom tools & workflow systems",
    summary: "Custom tools, dashboards, and workflow automation.",
    href: routes.services.softwareSolutions,
  },
  {
    slug: "applications",
    title: "Apps",
    fit: "Products built to scale",
    summary: "Web and mobile products designed for scale.",
    href: routes.services.applications,
  },
  {
    slug: "email-marketing",
    title: "Email marketing",
    fit: "Campaigns & ongoing nurture",
    summary: "Campaign strategy, automation, and ongoing nurture.",
    href: routes.services.emailMarketing,
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    fit: "Scoped AI for products & ops",
    summary: "Scoped AI implementation for products, sites, and ops.",
    href: routes.services.aiSolutions,
  },
  {
    slug: "tech-literacy",
    title: "Tech Literacy",
    fit: "1:1 or small-group coaching",
    summary: "Private or small-group sessions for everyday tech confidence.",
    href: routes.services.techLiteracy,
  },
  {
    slug: "coding-sql",
    title: "Coding & SQL",
    fit: "Kids, youth & beginners",
    summary: "Project-based coding and SQL for kids, youth, and beginners.",
    href: routes.services.codingSql,
  },
];
