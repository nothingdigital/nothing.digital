import { newsletterSchema } from "./newsletter";

it("accepts a valid email", () => {
  const result = newsletterSchema.safeParse({ email: "jane@example.com" });
  expect(result.success).toBe(true);
});

it("rejects an invalid email", () => {
  const result = newsletterSchema.safeParse({ email: "not-an-email" });
  expect(result.success).toBe(false);
});

it("rejects missing email", () => {
  const result = newsletterSchema.safeParse({});
  expect(result.success).toBe(false);
});
