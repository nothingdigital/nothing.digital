"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { calcPrice } from "@/lib/pricing";
import { routes } from "@/lib/routes";

export function PricingCalculator() {
  const [scope, setScope] = useState<"small" | "medium" | "large">("medium");
  const [timeline, setTimeline] = useState(6);

  const result = calcPrice(scope, timeline);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-display text-2xl">Get a ballpark</h3>
      <p className="text-sm text-muted-foreground">
        Scope and timeline only. Fixed quote after call.
      </p>
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="pricing-scope" className="mb-1 block text-sm">
            Scope
          </label>
          <select
            id="pricing-scope"
            value={scope}
            onChange={(e) =>
              setScope(e.target.value as "small" | "medium" | "large")
            }
            className="w-full rounded border border-border bg-background p-2 text-sm"
          >
            <option value="small">Small (landing, basic site)</option>
            <option value="medium">Medium (full site, tools)</option>
            <option value="large">Large (app, AI, complex)</option>
          </select>
        </div>
        <div>
          <label htmlFor="pricing-timeline" className="mb-1 block text-sm">
            Timeline (months)
          </label>
          <input
            id="pricing-timeline"
            type="range"
            min="1"
            max="12"
            value={timeline}
            onChange={(e) => setTimeline(+e.target.value)}
            className="w-full accent-primary"
          />
          <p className="mt-1 text-center font-mono text-sm">{timeline}</p>
        </div>
        <div className="rounded bg-muted p-6 text-center">
          <p className="text-4xl font-mono text-primary">
            ${result.min.toLocaleString()} – ${result.max.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{result.note}</p>
        </div>
        <Button asChild className="w-full">
          <Link href={routes.contact}>Book scoping call for fixed quote</Link>
        </Button>
      </div>
    </div>
  );
}
