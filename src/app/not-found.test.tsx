import { render, screen } from "@testing-library/react";

import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders 404 status and navigation links", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: /404/i })).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back home/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
