"use client";

import { useEffect, useRef } from "react";

// ponytail: one listener + transform mutation; no state, no deps
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (e: MouseEvent) => {
      ref.current?.style.setProperty(
        "transform",
        `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`,
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full bg-accent/10 blur-3xl"
    />
  );
}
