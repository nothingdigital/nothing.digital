"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// ponytail: tiny self-contained analog clock; no external chart/animation deps.
export function HeroClock() {
  const [time, setTime] = useState<Date | null>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // ponytail: direct style mutation, no state churn per mousemove
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  };

  const resetTilt = () => {
    tiltRef.current?.style.removeProperty("transform");
  };

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    // ponytail: render static placeholder to avoid hydration mismatch.
    return (
      <div className="relative mx-auto aspect-square w-64 md:w-80 lg:w-96">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
      </div>
    );
  }

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
      className="relative mx-auto aspect-square w-64 transition-transform duration-200 ease-out md:w-80 lg:w-96"
      role="img"
      aria-label={`Current time ${time.toLocaleTimeString()}`}
    >
      {/* rotating seal text */}
      <svg
        viewBox="0 0 100 100"
        className="animate-sweep absolute -left-6 -top-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] text-accent/70"
        aria-hidden="true"
      >
        <defs>
          <path
            id="seal-circle"
            d="M 50,50 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
            fill="none"
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="5.2"
          letterSpacing="2.5"
          className="font-mono uppercase"
        >
          <textPath href="#seal-circle">
            Nothing.Digital · Time Well Built · Nothing.Digital · Time Well
            Built ·
          </textPath>
        </text>
      </svg>

      {/* halo */}
      <div className="absolute -inset-3 rounded-full bg-primary/10 blur-xl" />

      {/* dial */}
      <div className="absolute inset-0 rounded-full border-4 border-primary/25 bg-card shadow-2xl" />
      <div className="absolute inset-3 rounded-full border border-border" />

      {/* hour markers */}
      {Array.from({ length: 12 }).map((_, index) => {
        const rotation = index * 30;
        const isQuarter = index % 3 === 0;
        return (
          <div
            key={index}
            className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div
              className={`mx-auto mt-3 rounded-full ${
                isQuarter
                  ? "h-3 w-1 bg-primary"
                  : "h-2 w-0.5 bg-muted-foreground/40"
              }`}
            />
          </div>
        );
      })}

      {/* hands */}
      <Hand length={26} width={4} degrees={hourDeg} color="bg-foreground" />
      <Hand
        length={38}
        width={2.5}
        degrees={minuteDeg}
        color="bg-foreground/80"
      />
      <Hand length={44} width={1.5} degrees={secondDeg} color="bg-primary" />

      {/* center cap */}
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary" />
    </div>
  );
}

interface HandProps {
  length: number;
  width: number;
  degrees: number;
  color: string;
}

function Hand({ length, width, degrees, color }: HandProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
      style={{
        width,
        height: `${length}%`,
        transform: `translateX(-50%) translateY(-100%) rotate(${degrees}deg)`,
      }}
    >
      <div className={`h-full w-full rounded-full ${color}`} />
    </div>
  );
}
