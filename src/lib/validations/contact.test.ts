import { contactSchema } from "./contact";

function validate(payload: unknown) {
  return contactSchema.safeParse(payload);
}

it("accepts a valid contact payload", () => {
  const result = validate({
    name: "Jane Doe",
    email: "jane@example.com",
    service: "website-development",
    budget: "5k-15k",
    message: "I need a new website for my business.",
  });

  expect(result.success).toBe(true);
});

it("rejects missing name", () => {
  const result = validate({ email: "jane@example.com", message: "Hello" });
  expect(result.success).toBe(false);
});

it("rejects invalid email", () => {
  const result = validate({
    name: "Jane",
    email: "not-an-email",
    message: "Hello there",
  });
  expect(result.success).toBe(false);
});

it("rejects short message", () => {
  const result = validate({
    name: "Jane",
    email: "jane@example.com",
    message: "Hi",
  });
  expect(result.success).toBe(false);
});

it("rejects unknown service", () => {
  const result = validate({
    name: "Jane",
    email: "jane@example.com",
    message: "I need help.",
    service: "magic",
  });
  expect(result.success).toBe(false);
});

it("allows honeypot field to be empty", () => {
  const result = validate({
    name: "Jane",
    email: "jane@example.com",
    message: "I need a new website.",
    website: "",
  });

  expect(result.success).toBe(true);
});
