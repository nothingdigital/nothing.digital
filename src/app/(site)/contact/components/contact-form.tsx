"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import * as LabelPrimitive from "@radix-ui/react-label";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/form-field";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { routes, serviceSlugs } from "@/lib/routes";
import { serviceSummaries } from "@/lib/services";
import { mapServiceToScope, calcPrice } from "@/lib/pricing";

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
    timeline: data.timeline,
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
    watch,
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
      timeline: undefined,
      message: "",
      website: "",
      privacyAccepted: false,
    },
  });

  const watchedService = watch("service");
  const watchedTimeline = watch("timeline");
  const estimate =
    watchedService && watchedTimeline
      ? calcPrice(mapServiceToScope(watchedService), parseInt(watchedTimeline))
      : null;

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
        name="timeline"
        label="Timeline (months) (optional)"
        control={control}
        error={errors.timeline}
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
            <option value="">Select timeline</option>
            <option value="1">1 (rush)</option>
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="12">12+</option>
          </select>
        )}
      />

      {estimate && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="text-sm text-primary">Estimated range (ballpark)</p>
          <p className="text-2xl font-mono text-primary">
            ${estimate.min.toLocaleString()} – ${estimate.max.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {estimate.note}. Fixed quote after call.
          </p>
        </div>
      )}

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

      {/* ponytail: FormField stacks label then control; inline label puts checkbox after "Policy". */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Controller
            name="privacyAccepted"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                {...field}
                id={field.name}
                checked={(field.value as boolean) ?? false}
                onChange={(event) => field.onChange(event.target.checked)}
                value="true"
                aria-invalid={errors.privacyAccepted ? true : undefined}
                aria-describedby={
                  errors.privacyAccepted ? "privacyAccepted-error" : undefined
                }
                className="h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-ring"
              />
            )}
          />
          <LabelPrimitive.Root
            htmlFor="privacyAccepted"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <a
              href="/privacy"
              target="_blank"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Privacy Policy
            </a>
          </LabelPrimitive.Root>
        </div>
        {errors.privacyAccepted?.message && (
          <p
            id="privacyAccepted-error"
            className="text-sm font-medium text-destructive"
          >
            {errors.privacyAccepted.message}
          </p>
        )}
      </div>

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
