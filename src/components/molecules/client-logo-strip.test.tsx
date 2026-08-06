import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClientLogoStrip } from "./client-logo-strip";

describe("ClientLogoStrip", () => {
  it("renders placeholder initials without fabricating client names", () => {
    render(<ClientLogoStrip />);

    expect(
      screen.getByLabelText(
        /trusted by teams across fintech, retail, saas, healthcare, and media/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/^[A-Z]{2}$/)).toHaveLength(5);
  });
});
