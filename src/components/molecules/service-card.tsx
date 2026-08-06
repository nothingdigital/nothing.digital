"use client";

import * as React from "react";

import { motion } from "framer-motion";
import Link from "next/link";

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
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
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
        className="h-full rounded-xl border-2 border-border bg-card p-6 shadow-md transition-colors hover:border-primary hover:shadow-xl"
      >
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </div>
        <h3 className="mb-2 font-display text-xl group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </motion.div>
    </Link>
  );
}
