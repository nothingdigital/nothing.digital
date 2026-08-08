import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { routes } from "@/lib/routes";

export interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  coverImage?: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  date,
  author,
  tags,
  coverImage,
}: BlogCardProps) {
  return (
    <Link
      href={routes.blog.post(slug)}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <Image
          src={coverImage ?? "/images/placeholder.svg"}
          alt={`${title} cover`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="mt-3 text-lg font-semibold group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          {formatDate(date)} · {author}
        </p>
      </div>
    </Link>
  );
}
