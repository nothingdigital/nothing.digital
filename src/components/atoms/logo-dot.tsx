"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const DOT_COLORS = [
  "text-amber-400",
  "text-sky-500",
  "text-red-500",
  "text-emerald-500",
] as const;

export function LogoDot() {
  const [colorClass, setColorClass] = useState<string>(DOT_COLORS[0]);

  useEffect(() => {
    setColorClass(DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)]);
  }, []);

  return <span className={cn("italic", colorClass)}>.</span>;
}
