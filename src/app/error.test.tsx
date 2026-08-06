import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ErrorPage from "./error";

describe("ErrorPage", () => {
  it("renders 500 status and calls reset", () => {
    const reset = vi.fn();
    const testError = new Error("test error");

    render(<ErrorPage error={testError} reset={reset} />);

    expect(screen.getByRole("heading", { name: /500/i })).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    screen.getByRole("button", { name: /try again/i }).click();
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
