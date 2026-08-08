import type { ReactNode } from "react";
import Link from "next/link";

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export function ServiceCard({
  title,
  description,
  icon,
  href,
}: ServiceCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="h-full rounded-xl border-2 border-border bg-card p-6 shadow-md transition-[colors,transform,box-shadow] duration-200 hover:-translate-y-1.5 hover:border-primary hover:shadow-xl motion-reduce:hover:translate-y-0">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </div>
        <h3 className="mb-2 font-display text-xl group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}
