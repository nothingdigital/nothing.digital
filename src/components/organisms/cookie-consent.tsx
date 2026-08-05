"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent";
type ConsentChoice = "all" | "essential" | "rejected";

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const handleChoice = (choice: ConsentChoice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg"
    >
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          We use cookies to improve your experience and analyze traffic. Choose
          what you allow.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => handleChoice("all")}>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleChoice("essential")}
          >
            Essential Only
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleChoice("rejected")}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
