"use client";

import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PortfolioCard } from "./portfolio-card";

export type PortfolioItem = {
  slug: string;
  title: string;
  description: string;
  client: string;
  industry: string;
  services: string[];
  coverImage?: string;
};

type SortOption = "az" | "za";

export interface PortfolioFilterProps {
  items: PortfolioItem[];
}

function buildSelectOptions(values: string[]): string[] {
  const seen = new Set<string>();
  const options: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    options.push(normalized);
  }

  return options.sort((a, b) => a.localeCompare(b));
}

function updateParam(
  params: URLSearchParams,
  key: string,
  value: string,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (!value) {
    next.delete(key);
  } else {
    next.set(key, value);
  }
  return next;
}

export function PortfolioFilter({ items }: PortfolioFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const industryParam = searchParams.get("industry") ?? "";
  const serviceParam = searchParams.get("service") ?? "";
  const sortParam = (searchParams.get("sort") as SortOption) || "az";

  const industries = buildSelectOptions(items.map((item) => item.industry));
  const services = buildSelectOptions(items.flatMap((item) => item.services));

  const filtered = items
    .filter((item) => (industryParam ? item.industry === industryParam : true))
    .filter((item) =>
      serviceParam ? item.services.includes(serviceParam) : true,
    )
    .sort((a, b) => {
      const order = sortParam === "za" ? -1 : 1;
      return order * a.title.localeCompare(b.title);
    });

  function setFilter(key: string, value: string) {
    const next = updateParam(searchParams, key, value);
    router.replace(`${window.location.pathname}?${next.toString()}`, {
      scroll: false,
    });
  }

  function clearFilters() {
    router.replace(window.location.pathname, { scroll: false });
  }

  const hasFilters = Boolean(
    industryParam || serviceParam || sortParam !== "az",
  );

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="industry" className="mb-1 block text-sm font-medium">
            Industry
          </label>
          <select
            id="industry"
            value={industryParam}
            onChange={(event) => setFilter("industry", event.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="service" className="mb-1 block text-sm font-medium">
            Service
          </label>
          <select
            id="service"
            value={serviceParam}
            onChange={(event) => setFilter("service", event.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All services</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="sort" className="mb-1 block text-sm font-medium">
            Sort
          </label>
          <select
            id="sort"
            value={sortParam}
            onChange={(event) => setFilter("sort", event.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="az">Title A–Z</option>
            <option value="za">Title Z–A</option>
          </select>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full sm:w-auto"
          >
            Clear
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">
            No projects match the selected filters.
          </p>
          {hasFilters && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard key={item.slug} {...item} />
          ))}
        </div>
      )}
    </>
  );
}
