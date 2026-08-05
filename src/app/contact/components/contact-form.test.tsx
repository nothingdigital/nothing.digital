import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ContactForm } from "./contact-form";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderForm() {
  return render(<ContactForm />);
}

it("shows validation errors and focuses the first invalid field", async () => {
  renderForm();

  await userEvent.click(screen.getByRole("button", { name: /send message/i }));

  expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
  expect(
    screen.getByText(/message must be at least 10 characters/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/you must agree to the privacy policy/i),
  ).toBeInTheDocument();

  expect(screen.getByLabelText(/name/i)).toHaveFocus();
});

it("submits the form and shows a success message", async () => {
  const fetchMock = vi.mocked(fetch);
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true }),
  } as Response);

  renderForm();

  await userEvent.type(screen.getByLabelText(/name/i), "Jane Doe");
  await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
  await userEvent.type(
    screen.getByLabelText(/message/i),
    "I need a new website for my business.",
  );
  await userEvent.click(
    screen.getByLabelText(/i agree to the privacy policy/i),
  );

  await userEvent.click(screen.getByRole("button", { name: /send message/i }));

  await waitFor(() => {
    expect(
      screen.getByText(/thanks — we will be in touch soon/i),
    ).toBeInTheDocument();
  });

  expect(fetchMock).toHaveBeenCalledTimes(1);
  const request = fetchMock.mock.calls[0];
  expect(request[0]).toBe("/api/contact");
  const body = JSON.parse(request[1]?.body as string);
  expect(body).toMatchObject({
    name: "Jane Doe",
    email: "jane@example.com",
    message: "I need a new website for my business.",
  });
  expect(body).not.toHaveProperty("phone");
  expect(body).not.toHaveProperty("privacyAccepted");
});

it("shows an error message when submission fails", async () => {
  const fetchMock = vi.mocked(fetch);
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 429,
    json: async () => ({ error: "Rate limit exceeded" }),
  } as Response);

  renderForm();

  await userEvent.type(screen.getByLabelText(/name/i), "Jane Doe");
  await userEvent.type(screen.getByLabelText(/email/i), "jane@example.com");
  await userEvent.type(
    screen.getByLabelText(/message/i),
    "I need help with a project.",
  );
  await userEvent.click(
    screen.getByLabelText(/i agree to the privacy policy/i),
  );

  await userEvent.click(screen.getByRole("button", { name: /send message/i }));

  expect(await screen.findByText(/rate limit exceeded/i)).toBeInTheDocument();
});
