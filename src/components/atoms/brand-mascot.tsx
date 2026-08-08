import Image from "next/image";

import { brandConfig } from "@/brand";
import { cn } from "@/lib/utils";

type MascotVariant = "terminal" | "quiet" | "friendly";

interface BrandMascotProps {
  /** Site default is the pixel terminal. Anonymouse variants are opt-in. */
  variant?: MascotVariant;
  className?: string;
  /** Pixel width/height of the rendered image box */
  size?: number;
  priority?: boolean;
}

const SRC: Record<MascotVariant, string> = {
  terminal: brandConfig.assets.mascot,
  quiet: brandConfig.assets.mascotQuiet,
  friendly: brandConfig.assets.mascotFriendly,
};

/** Brand mascot. Default = pixel terminal. */
export function BrandMascot({
  variant = "terminal",
  className,
  size = 160,
  priority,
}: BrandMascotProps) {
  return (
    <Image
      src={SRC[variant]}
      alt=""
      width={size}
      height={size}
      className={cn("h-auto w-auto", className)}
      priority={priority}
    />
  );
}
