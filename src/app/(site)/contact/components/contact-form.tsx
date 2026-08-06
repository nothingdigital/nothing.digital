"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/form-field";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { routes, serviceSlugs } from "@/lib/routes";
import { serviceSummaries } from "@/lib/services";

// ponytail: extend server schema client-side for phone/privacy; strip before POST.
const contactFormSchema = contactSchema.extend({
  phone: z.string().max(20).optional(),
  privacyAccepted: z.boolean().refine((value) => value === true, {
    message: "You must agree to the Privacy Policy",
  }),
});

type FormValues = z.infer<typeof contactFormSchema>;

const budgetOptions = [
  { value: "<5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-50k", label: "$15,000 – $50,000" },
  { value: "50k+", label: "$50,000+" },
];

function slugToLabel(slug: string): string {
  const summary = serviceSummaries.find((service) => service.slug === slug);
  if (summary) return summary.title;

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toApiPayload(data: FormValues): ContactInput {
  return {
    name: data.name,
    email: data.email,
    company: data.company,
    service: data.service,
    budget: data.budget,
    message: data.message,
    website: data.website,
  };
}

export function ContactForm() {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [submittedService, setSubmittedService] = React.useState<
    string | undefined
  >();

  const {
    control,
    handleSubmit,
    register,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: undefined,
      budget: undefined,
      message: "",
      website: "",
      privacyAccepted: false,
    },
  });

  const onSubmit = React.useCallback(
    async (data: FormValues) => {
      setStatus("loading");
      setErrorMessage("");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toApiPayload(data)),
        });

        if (!response.ok) {
          const body = await response
            .json()
            .catch(() => ({ error: "Something went wrong." }));
          throw new Error(
            body.error ?? `Submission failed (${response.status})`,
          );
        }

        setSubmittedService(data.service);
        setStatus("success");
        reset();
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Submission failed.",
        );
      }
    },
    [reset],
  );

  const onError = React.useCallback(() => {
    const firstError = Object.keys(errors)[0] as keyof FormValues | undefined;
    if (firstError) setFocus(firstError);
  }, [errors, setFocus]);

  const relatedService = serviceSummaries.find(
    (item) => item.slug === submittedService,
  );

  if (status === "success") {
    return (
      <div
        className="space-y-4 rounded-xl border-2 border-border bg-card p-6"
        role="status"
        aria-live="polite"
        tabIndex={-1}
        ref={(node) => node?.focus()}
      >
        <p className="text-sm font-medium text-green-800 dark:text-green-100">
          Thanks — we will be in touch soon. We reply within one business day.
        </p>
        <p className="text-sm text-muted-foreground">While you wait:</p>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href={routes.pricing}
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              See how pricing works
            </a>
          </li>
          {relatedService ? (
            <li>
              <a
                href={relatedService.href}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Read more about {relatedService.title}
              </a>
            </li>
          ) : (
            <li>
              <a
                href={routes.services.index}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Browse our services
              </a>
            </li>
          )}
          <li>
            <a
              href={routes.blog.index}
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Browse recent articles
            </a>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-6"
      noValidate
    >
      <input
        {...register("website")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <FormField
        name="name"
        label="Name"
        control={control}
        error={errors.name}
        render={(field) => (
          <Input
            id={field.name}
            type="text"
            placeholder="Jane Doe"
            {...field}
            value={field.value as string}
          />
        )}
      />

      <FormField
        name="email"
        label="Email"
        control={control}
        error={errors.email}
        render={(field) => (
          <Input
            id={field.name}
            type="email"
            placeholder="jane@example.com"
            {...field}
            value={field.value as string}
          />
        )}
      />

      <FormField
        name="phone"
        label="Phone (optional)"
        control={control}
        error={errors.phone}
        render={(field) => (
          <Input
            id={field.name}
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...field}
            value={field.value as string}
          />
        )}
      />

      <FormField
        name="company"
        label="Company (optional)"
        control={control}
        error={errors.company}
        render={(field) => (
          <Input
            id={field.name}
            type="text"
            placeholder="Acme Inc."
            {...field}
            value={field.value as string}
          />
        )}
      />

      <FormField
        name="service"
        label="Service (optional)"
        control={control}
        error={errors.service}
        render={(field) => (
          <select
            {...field}
            id={field.name}
            value={(field.value as string) || ""}
            onChange={(event) =>
              field.onChange(event.target.value || undefined)
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a service</option>
            {serviceSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {slugToLabel(slug)}
              </option>
            ))}
          </select>
        )}
      />

      <FormField
        name="budget"
        label="Budget (optional)"
        control={control}
        error={errors.budget}
        render={(field) => (
          <select
            {...field}
            id={field.name}
            value={(field.value as string) || ""}
            onChange={(event) =>
              field.onChange(event.target.value || undefined)
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a budget range</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />

      <FormField
        name="message"
        label="Message"
        control={control}
        error={errors.message}
        render={(field) => (
          <textarea
            {...field}
            id={field.name}
            value={(field.value as string) || ""}
            rows={5}
            placeholder="Tell us about your project..."
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        )}
      />

      <FormField
        name="privacyAccepted"
        label={
          <>
            I agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Privacy Policy
            </a>
          </>
        }
        control={control}
        error={errors.privacyAccepted}
        render={(field) => (
          <input
            type="checkbox"
            {...field}
            id={field.name}
            checked={(field.value as boolean) ?? false}
            onChange={(event) => field.onChange(event.target.checked)}
            value="true"
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
        )}
      />

      {status === "error" && (
        <p
          className="rounded-md bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          role="alert"
          aria-live="polite"
        >
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="min-h-11 w-full sm:w-auto"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
