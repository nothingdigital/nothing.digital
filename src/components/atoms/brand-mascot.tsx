import Image from "next/image";

import { brandConfig } from "@/brand";
import { cn } from "@/lib/utils";

type MascotExpression = "quiet" | "friendly";

interface BrandMascotProps {
  expression?: MascotExpression;
  className?: string;
  /** Pixel width/height of the rendered image box */
  size?: number;
  priority?: boolean;
}

const SRC: Record<MascotExpression, string> = {
  quiet: brandConfig.assets.mascotQuiet,
  friendly: brandConfig.assets.mascotFriendly,
};

/** Anonymouse brand mascot. Default = Quiet Clever (official). */
export function BrandMascot({
  expression = "quiet",
  className,
  size = 160,
  priority,
}: BrandMascotProps) {
  return (
    <Image
      src={SRC[expression]}
      alt=""
      width={size}
      height={size}
      className={cn("h-auto w-auto", className)}
      priority={priority}
    />
  );
}
