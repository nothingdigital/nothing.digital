"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { routes } from "@/lib/routes";

interface Slot {
  date: string;
  time: string;
  type: string;
  href: string;
}

export function AvailabilityWidget() {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    // ponytail: mock for now. Real Calendly slots if widget CTR >5%. Guard: empty fallback.
    setSlots([
      {
        date: "Aug 12",
        time: "10:00 am",
        type: "Scoping Call",
        href: routes.contact,
      },
      {
        date: "Aug 14",
        time: "2:00 pm",
        type: "Scoping Call",
        href: routes.contact,
      },
      {
        date: "Aug 19",
        time: "11:00 am",
        type: "Project Kickoff",
        href: routes.contact,
      },
    ]);
  }, []);

  if (slots.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
          Next available
        </p>
        <h2 className="mt-2 font-display text-3xl">Book a call this week</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Slots fill fast. All times local. More on Calendly.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {slots.map((slot, index) => (
          <Link
            key={index}
            href={slot.href}
            className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
          >
            <div className="font-mono text-sm text-primary">
              {slot.date} · {slot.time}
            </div>
            <div className="mt-3 text-lg font-medium group-hover:text-primary">
              {slot.type}
            </div>
            <Button variant="outline" size="sm" className="mt-6 w-full">
              Book this slot
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
