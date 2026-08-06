"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// ponytail: one listener + transform mutation; no state, no deps
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const move = (e: MouseEvent) => {
      ref.current?.style.setProperty(
        "transform",
        `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`,
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full bg-accent/10 blur-3xl"
    />
  );
}
