"use client";

import * as React from "react";

import { motion } from "framer-motion";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
}

export function ServiceCard({
  title,
  description,
  icon,
  href,
  className,
}: ServiceCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary/50 hover:shadow-md"
      >
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </motion.div>
    </Link>
  );
}
