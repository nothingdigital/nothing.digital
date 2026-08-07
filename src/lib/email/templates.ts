import type { ContactInput } from "@/lib/validations/contact";

function baseTemplate(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="font-family: system-ui, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 24px;">
    <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px;">
      ${body}
    </div>
    <footer style="margin-top: 24px; font-size: 12px; color: #666; text-align: center;">
      Nothing.Digital — Premium Digital Services
    </footer>
  </body>
</html>`;
}

export function contactConfirmationEmailTemplate(data: ContactInput): string {
  const body = `
    <h1 style="font-size: 20px; margin: 0 0 16px;">We received your message</h1>
    <p>Hi ${data.name},</p>
    <p>Thanks for reaching out. We have received your message and will get back to you soon.</p>
    <p style="margin-top: 24px; font-size: 14px; color: #555;">
      <strong>Service:</strong> ${data.service ?? "Not specified"}<br />
      <strong>Message:</strong><br />
      ${data.message.replace(/\n/g, "<br />")}
    </p>
  `;

  return baseTemplate("We received your message — Nothing.Digital", body);
}

export function teamNotificationEmailTemplate(
  data: ContactInput,
  submissionId: string,
): string {
  const body = `
    <h1 style="font-size: 20px; margin: 0 0 16px;">New contact submission</h1>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Company:</strong> ${data.company ?? "—"}</p>
    <p><strong>Service:</strong> ${data.service ?? "—"}</p>
    <p><strong>Budget:</strong> ${data.budget ?? "—"}</p>
    <p><strong>Message:</strong><br />${data.message.replace(/\n/g, "<br />")}</p>
    <p style="margin-top: 24px; font-size: 12px; color: #666;">
      Submission ID: ${submissionId}
    </p>
  `;

  return baseTemplate(`New contact submission from ${data.name}`, body);
}

export function newsletterWelcomeEmailTemplate(): string {
  const body = `
    <h1 style="font-size: 20px; margin: 0 0 16px;">Welcome to Nothing.Digital</h1>
    <p>Thanks for subscribing. You will be the first to know about new work, insights, and company updates.</p>
    <p style="margin-top: 16px;"><a href="https://nothing.digital" style="color: #111; text-decoration: underline;">Visit nothing.digital</a></p>
  `;

  return baseTemplate("Welcome to Nothing.Digital", body);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Approved freeform inbox reply — body is escaped plain text. */
export function inboxReplyEmailTemplate(body: string): string {
  const safe = escapeHtml(body).replaceAll("\n", "<br />");
  return baseTemplate(
    "Message from Nothing.Digital",
    `<div style="font-size: 15px; line-height: 1.5;">${safe}</div>`,
  );
}

export function invoiceSentEmailTemplate(data: {
  clientName: string;
  number: string;
  title: string;
  amount: string;
  due: string | null;
  viewUrl: string;
  coverNote?: string | null;
}): string {
  const dueLine = data.due ? `<p><strong>Due:</strong> ${data.due}</p>` : "";
  const noteHtml = data.coverNote?.trim()
    ? `<div style="font-size:15px;line-height:1.5;margin:0 0 16px;">${escapeHtml(data.coverNote).replaceAll("\n", "<br />")}</div>`
    : `<p>Your invoice is ready.</p>`;
  const body = `
    <h1 style="font-size: 20px; margin: 0 0 16px;">Invoice ${data.number}</h1>
    <p>Hi ${data.clientName},</p>
    ${noteHtml}
    <p><strong>Title:</strong> ${data.title}</p>
    <p><strong>Amount:</strong> ${data.amount}</p>
    ${dueLine}
    <p style="margin-top: 24px;">
      <a href="${data.viewUrl}" style="display: inline-block; background: #111; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
        View invoice
      </a>
    </p>
    <p style="margin-top: 16px; font-size: 13px; color: #555;">
      Or open this link: <a href="${data.viewUrl}" style="color: #111;">${data.viewUrl}</a>
    </p>
  `;

  return baseTemplate(`Invoice ${data.number} — Nothing.Digital`, body);
}
