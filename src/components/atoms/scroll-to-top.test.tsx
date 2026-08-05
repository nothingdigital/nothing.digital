import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ScrollToTop } from "./scroll-to-top";

const scrollTo = vi.fn();

beforeEach(() => {
  scrollTo.mockClear();
  Object.defineProperty(window, "scrollTo", {
    value: scrollTo,
    writable: true,
  });
  Object.defineProperty(window, "scrollY", {
    value: 0,
    writable: true,
    configurable: true,
  });
});

function fireScroll(y: number) {
  window.scrollY = y;
  window.dispatchEvent(new Event("scroll"));
}

it("is hidden when near the top", () => {
  render(<ScrollToTop />);

  expect(
    screen.queryByRole("button", { name: /scroll to top/i }),
  ).not.toBeInTheDocument();
});

it("appears after scrolling past the threshold", async () => {
  render(<ScrollToTop />);
  fireScroll(500);

  expect(
    await screen.findByRole("button", { name: /scroll to top/i }),
  ).toBeInTheDocument();
});

it("smoothly scrolls to the top when clicked", async () => {
  render(<ScrollToTop />);
  fireScroll(500);
  const button = await screen.findByRole("button", { name: /scroll to top/i });

  await userEvent.click(button);

  expect(scrollTo).toHaveBeenCalledTimes(1);
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
});
