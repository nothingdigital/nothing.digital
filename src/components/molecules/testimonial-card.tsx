import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  className,
}: TestimonialCardProps) {
  return (
    <blockquote
      className={cn(
        "rounded-lg border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <p className="mb-4 text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      <footer>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </footer>
    </blockquote>
  );
}
