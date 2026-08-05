import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CookieConsent } from "./cookie-consent";

const STORAGE_KEY = "cookie-consent";

beforeEach(() => localStorage.removeItem(STORAGE_KEY));
afterEach(() => localStorage.removeItem(STORAGE_KEY));

it("renders the cookie banner after mount", async () => {
  render(<CookieConsent />);

  expect(
    await screen.findByRole("region", { name: /cookie consent/i }),
  ).toBeInTheDocument();
});

it("accepts all cookies and hides the banner", async () => {
  render(<CookieConsent />);
  const accept = await screen.findByRole("button", { name: /accept/i });

  await userEvent.click(accept);

  await waitFor(() =>
    expect(screen.queryByRole("region")).not.toBeInTheDocument(),
  );
  expect(localStorage.getItem(STORAGE_KEY)).toBe("all");
});

it("stores essential-only choice and hides the banner", async () => {
  render(<CookieConsent />);
  const essential = await screen.findByRole("button", {
    name: /essential only/i,
  });

  await userEvent.click(essential);

  await waitFor(() =>
    expect(screen.queryByRole("region")).not.toBeInTheDocument(),
  );
  expect(localStorage.getItem(STORAGE_KEY)).toBe("essential");
});

it("rejects cookies and hides the banner", async () => {
  render(<CookieConsent />);
  const reject = await screen.findByRole("button", { name: /reject/i });

  await userEvent.click(reject);

  await waitFor(() =>
    expect(screen.queryByRole("region")).not.toBeInTheDocument(),
  );
  expect(localStorage.getItem(STORAGE_KEY)).toBe("rejected");
});

it("does not render when a choice is already stored", () => {
  localStorage.setItem(STORAGE_KEY, "essential");
  render(<CookieConsent />);

  expect(screen.queryByRole("region")).not.toBeInTheDocument();
});
