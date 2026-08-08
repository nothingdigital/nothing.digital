import Image from "next/image";

import { brandConfig } from "@/brand";
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
      aria-label={brandConfig.name}
    >
      <Image
        src={brandConfig.assets.wordmarkLight}
        alt=""
        width={140}
        height={48}
        className="h-10 w-auto dark:hidden"
        priority={priority}
      />
      <Image
        src={brandConfig.assets.wordmarkDark}
        alt=""
        width={140}
        height={48}
        className="hidden h-10 w-auto dark:block"
        priority={priority}
      />
    </span>
  );
}
