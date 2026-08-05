import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

function renderButton(ui: React.ReactElement) {
  return render(ui);
}

it("renders a button with accessible name", () => {
  renderButton(<Button>Click me</Button>);

  expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
});

it("calls the click handler when activated", async () => {
  const handleClick = vi.fn();
  renderButton(<Button onClick={handleClick}>Submit</Button>);

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

it("applies the disabled state correctly", () => {
  renderButton(<Button disabled>Disabled</Button>);

  expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled();
});
