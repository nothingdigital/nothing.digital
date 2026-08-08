import { serviceSlugs, type ServiceSlug } from "@/lib/routes";
import { serviceDetails } from "@/lib/services";

export interface PricingService {
  slug: ServiceSlug;
  title: string;
  /** Short fit cue — who/what the service is for. No dollar amounts. */
  fit: string;
  summary: string;
  href: string;
}

const fitBySlug: Record<ServiceSlug, string> = {
  "website-development": "Marketing sites & brand launches",
  "software-solutions": "Custom tools & workflow systems",
  applications: "Products built to scale",
  "email-marketing": "Campaigns & ongoing nurture",
  "ai-solutions": "Scoped AI for products & ops",
  "tech-literacy": "1:1 or small-group coaching",
  "coding-sql": "Kids, youth & beginners",
};

/** Service cards for the pricing page — fixed quote after scoping. */
export const pricingServices: PricingService[] = serviceSlugs.map((slug) => {
  const detail = serviceDetails[slug];
  return {
    slug: detail.slug,
    title: detail.title,
    fit: fitBySlug[slug],
    summary: detail.description,
    href: detail.href,
  };
});

// ponytail: map + math. YAGNI full quote engine.
export function mapServiceToScope(
  service: ServiceSlug | undefined,
): "small" | "medium" | "large" {
  if (!service) return "medium";
  if (
    [
      "website-development",
      "email-marketing",
      "tech-literacy",
      "coding-sql",
    ].includes(service)
  )
    return "small";
  if (service === "software-solutions") return "medium";
  return "large";
}

export function calcPrice(
  scope: "small" | "medium" | "large",
  timelineMonths: number,
): { min: number; max: number; note: string } {
  const bases = { small: 5000, medium: 15000, large: 35000 };
  const base = bases[scope];
  const urgency = timelineMonths < 3 ? 1.5 : timelineMonths < 6 ? 1.2 : 1;
  const min = Math.round(base * urgency * 0.8);
  const max = Math.round(base * urgency * 1.2);
  const note = timelineMonths < 3 ? "Rush pricing" : "Standard scoping";
  return { min, max, note };
}
