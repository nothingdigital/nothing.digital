"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/form-field";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { serviceSlugs } from "@/lib/routes";

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
        label="I agree to the Privacy Policy"
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

      {status === "success" && (
        <p className="rounded-md bg-green-100 px-4 py-3 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
          Thanks — we will be in touch soon.
        </p>
      )}

      {status === "error" && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
