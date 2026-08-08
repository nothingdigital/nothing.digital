import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { routes } from "@/lib/routes";

export interface PortfolioCardProps {
  slug: string;
  title: string;
  client: string;
  industry: string;
  services: string[];
  coverImage?: string;
}

export function PortfolioCard({
  slug,
  title,
  client,
  industry,
  services,
  coverImage,
}: PortfolioCardProps) {
  return (
    <Link
      href={routes.portfolio.detail(slug)}
      className="group block overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={coverImage ?? "/images/placeholder.svg"}
          alt={`${title} cover`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {client} — {industry}
        </p>
        <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">
          {title}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.slice(0, 3).map((service) => (
            <Badge key={service} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
