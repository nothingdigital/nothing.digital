import { z } from "zod";

import { serviceSlugs } from "@/lib/routes";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required").max(254),
  company: z.string().max(100).optional(),
  service: z.enum(serviceSlugs).optional(),
  budget: z.enum(["<5k", "5k-15k", "15k-50k", "50k+"]).optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
  website: z.string().max(100).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
