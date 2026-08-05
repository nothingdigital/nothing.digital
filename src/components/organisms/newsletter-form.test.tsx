import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NewsletterForm } from "./newsletter-form";

const fetchMock = vi.fn();

defineFetchMock();

function defineFetchMock() {
  Object.defineProperty(globalThis, "fetch", {
    value: fetchMock,
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  fetchMock.mockReset();
});

async function fillAndSubmit(email: string) {
  await userEvent.type(screen.getByLabelText(/email/i), email);
  await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));
}

it("subscribes successfully and shows a success message", async () => {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true }),
  });
  render(<NewsletterForm />);

  await fillAndSubmit("hello@example.com");

  expect(fetchMock).toHaveBeenCalledWith(
    "/api/newsletter",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "hello@example.com" }),
    }),
  );
  await waitFor(() =>
    expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument(),
  );
});

it("shows an error message when subscription fails", async () => {
  fetchMock.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: "Oops" }),
  });
  render(<NewsletterForm />);

  await fillAndSubmit("hello@example.com");

  await waitFor(() =>
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(),
  );
});

it("does not submit an invalid email", async () => {
  render(<NewsletterForm />);

  await userEvent.type(screen.getByLabelText(/email/i), "not-an-email");
  await userEvent.click(screen.getByRole("button", { name: /subscribe/i }));

  expect(fetchMock).not.toHaveBeenCalled();
});
