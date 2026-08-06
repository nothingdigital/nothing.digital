import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "framer-motion";

import { Reveal } from "./reveal";

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

describe("Reveal", () => {
  it("renders children on the default animation path", () => {
    render(<Reveal>content</Reveal>);

    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders a plain div when reduced motion is preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(<Reveal className="plain-reveal">reduced</Reveal>);

    const wrapper = screen.getByText("reduced").parentElement;
    expect(wrapper).toHaveClass("plain-reveal");
    expect(wrapper).not.toHaveAttribute("style");
  });
});
