import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

it("renders a button with accessible name", () => {
  render(<Button>Click me</Button>);

  expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
});

it("calls the click handler when activated", async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Submit</Button>);

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

it("applies the disabled state correctly", () => {
  render(<Button disabled>Disabled</Button>);

  expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled();
});
