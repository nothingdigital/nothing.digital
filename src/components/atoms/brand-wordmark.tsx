import Image from "next/image";

import { cn } from "@/lib/utils";

interface BrandWordmarkProps {
  className?: string;
  priority?: boolean;
}

/** Theme-aware wordmark from brand lockup assets. */
export function BrandWordmark({ className, priority }: BrandWordmarkProps) {
  return (
    <span
      className={cn("relative inline-flex h-10 items-center", className)}
      aria-label="Nothing.Digital"
    >
      <Image
        src="/images/brand/wordmark-light.png"
        alt=""
        width={140}
        height={48}
        className="h-10 w-auto dark:hidden"
        priority={priority}
      />
      <Image
        src="/images/brand/wordmark-dark.png"
        alt=""
        width={140}
        height={48}
        className="hidden h-10 w-auto dark:block"
        priority={priority}
      />
    </span>
  );
}
