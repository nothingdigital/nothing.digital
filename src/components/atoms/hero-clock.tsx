"use client";

import { useEffect, useState } from "react";

// ponytail: tiny self-contained analog clock; no external chart/animation deps.
export function HeroClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    // ponytail: render static placeholder to avoid hydration mismatch.
    return (
      <div className="relative mx-auto aspect-square w-48 md:w-64">
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
      className="relative mx-auto aspect-square w-48 md:w-64"
      aria-label={`Current time ${time.toLocaleTimeString()}`}
    >
      {/* dial */}
      <div className="absolute inset-0 rounded-full border-4 border-primary/20 bg-card shadow-xl" />

      {/* hour markers */}
      {Array.from({ length: 12 }).map((_, index) => {
        const rotation = index * 30;
        return (
          <div
            key={index}
            className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="mx-auto mt-2 h-2 w-0.5 rounded-full bg-muted-foreground/40" />
          </div>
        );
      })}

      {/* hands */}
      <Hand length={28} width={3} degrees={hourDeg} color="bg-foreground" />
      <Hand
        length={40}
        width={2}
        degrees={minuteDeg}
        color="bg-foreground/80"
      />
      <Hand length={46} width={1} degrees={secondDeg} color="bg-primary" />

      {/* center cap */}
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
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
