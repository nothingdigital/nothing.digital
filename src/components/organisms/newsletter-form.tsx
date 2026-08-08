"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/lib/routes";
import { newsletterSchema } from "@/lib/validations/newsletter";

export function NewsletterForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [successMessage, setSuccessMessage] = useState(
    "Thanks for subscribing!",
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!newsletterSchema.safeParse({ email }).success) return;

    setStatus("loading");
    try {
      const response = await fetch(routes.api.newsletter, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Subscribe failed");

      const body = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      if (body?.message) setSuccessMessage(body.message);

      (
        window as Window & { umami?: { track: (name: string) => void } }
      ).umami?.track("newsletter_subscribe");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="w-full min-w-0 sm:min-w-[16rem]"
          />
        </div>
        <Button
          type="submit"
          disabled={status === "loading"}
          className="min-h-11 w-full sm:w-auto sm:self-end"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
      {status === "success" && (
        <p className="text-sm text-green-600" role="status" aria-live="polite">
          {successMessage}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive" role="alert" aria-live="polite">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
