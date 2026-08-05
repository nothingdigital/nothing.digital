import { cn } from "./utils";

function merge(...inputs: Parameters<typeof cn>): string {
  return cn(...inputs);
}

it("joins plain class names", () => {
  expect(merge("foo", "bar")).toBe("foo bar");
});

it("flattens conditional classes from objects", () => {
  expect(merge("base", { active: true, disabled: false })).toBe("base active");
});

it("filters out falsy values", () => {
  expect(merge("a", null, undefined, false, "b")).toBe("a b");
});

it("resolves conflicting Tailwind utilities", () => {
  expect(merge("px-2", "px-4")).toBe("px-4");
  expect(merge("text-sm", "text-lg")).toBe("text-lg");
});
