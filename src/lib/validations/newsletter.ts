import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Valid email required").max(254),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
