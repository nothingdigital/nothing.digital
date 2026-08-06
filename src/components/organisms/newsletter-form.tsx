"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/form-field";
import { routes } from "@/lib/routes";
import {
  newsletterSchema,
  type NewsletterInput,
} from "@/lib/validations/newsletter";

export function NewsletterForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [successMessage, setSuccessMessage] = useState(
    "Thanks for subscribing!",
  );

  const { control, handleSubmit, reset } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: NewsletterInput) => {
    setStatus("loading");

    try {
      const response = await fetch(routes.api.newsletter, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Subscribe failed");

      const body = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      if (body?.message) setSuccessMessage(body.message);

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <FormField
          name="email"
          label="Email"
          control={control}
          render={(field) => (
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="w-full min-w-0 sm:min-w-[16rem]"
              {...field}
            />
          )}
        />
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
