import type { ContactInput } from "@/lib/validations/contact";

function baseTemplate(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; background: #f8f8f8; margin: 0; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <!-- Fancy header with logo/brand to show off email marketing -->
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 32px 24px; text-align: center;">
        <div style="font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 8px;">Nothing.Digital</div>
        <div style="font-size: 13px; opacity: 0.9; letter-spacing: 2px; text-transform: uppercase;">Premium Digital Services</div>
      </div>
      <div style="padding: 40px 32px; line-height: 1.6; color: #333;">
        ${body}
      </div>
      <div style="background: #f8f8f8; padding: 24px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee;">
        <p style="margin: 0 0 8px;">This email was sent by n8n fan-out from your contact form. Built to showcase our email marketing services.</p>
        <a href="https://nothing.digital" style="color: #4f46e5; text-decoration: none;">nothing.digital</a> • 
        <a href="https://nothing.digital/services/email-marketing" style="color: #4f46e5; text-decoration: none;">Email Marketing Services</a>
      </div>
    </div>
  </body>
</html>`;
}

export function contactConfirmationEmailTemplate(data: ContactInput): string {
  const estimateHtml =
    data.timeline || data.budget
      ? `
    <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="font-size: 13px; color: #0369a1; margin: 0 0 8px;">Ballpark estimate based on your submission</p>
      <p style="font-size: 28px; font-weight: 700; color: #0e7490; margin: 0;">${data.timeline ? "$5,000 – $35,000" : "Custom quote after call"}</p>
      <p style="font-size: 13px; color: #64748b; margin: 8px 0 0;">Timeline: ${data.timeline || "—"} months • Budget: ${data.budget || "—"}</p>
    </div>
  `
      : "";

  const body = `
    <h1 style="font-size: 28px; margin: 0 0 8px; color: #4f46e5;">Thank You, ${data.name}!</h1>
    <p style="font-size: 16px; color: #475569; margin: 0 0 32px;">We received your message and will reply within one business day.</p>
    ${estimateHtml}
    <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
      <p style="font-size: 15px; margin: 0 0 16px; color: #334155;"><strong>Your message:</strong></p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0; white-space: pre-wrap;">${data.message}</p>
    </div>
    <a href="https://nothing.digital" style="display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Visit nothing.digital</a>
    <p style="margin-top: 32px; font-size: 13px; color: #64748b;">This email was crafted to showcase our email marketing services. Expect a personal reply soon.</p>
  `;

  return baseTemplate("We received your message — Nothing.Digital", body);
}

export function teamNotificationEmailTemplate(
  data: ContactInput,
  submissionId: string,
): string {
  const body = `
    <h1 style="font-size: 24px; margin: 0 0 24px; color: #4f46e5;">New Contact Submission</h1>
    <div style="background: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <dl style="margin: 0; display: grid; grid-template-columns: 120px 1fr; gap: 12px 16px; font-size: 14px;">
        <dt style="font-weight: 600; color: #666;">Name</dt>
        <dd style="margin: 0; color: #111;">${data.name}</dd>
        <dt style="font-weight: 600; color: #666;">Email</dt>
        <dd style="margin: 0; color: #111;">${data.email}</dd>
        <dt style="font-weight: 600; color: #666;">Company</dt>
        <dd style="margin: 0; color: #111;">${data.company ?? "—"}</dd>
        <dt style="font-weight: 600; color: #666;">Service</dt>
        <dd style="margin: 0; color: #111;">${data.service ?? "—"}</dd>
        <dt style="font-weight: 600; color: #666;">Budget</dt>
        <dd style="margin: 0; color: #111;">${data.budget ?? "—"}</dd>
        <dt style="font-weight: 600; color: #666;">Timeline</dt>
        <dd style="margin: 0; color: #111;">${data.timeline ?? "—"}</dd>
      </dl>
    </div>
    <div style="background: #f8f9fa; border-left: 4px solid #4f46e5; padding: 16px 20px; margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
      <strong style="display: block; margin-bottom: 8px; color: #4f46e5;">Message</strong>
      ${data.message.replace(/\n/g, "<br />")}
    </div>
    <a href="https://nothing.digital/admin/inbox" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">View in Admin Inbox</a>
    <p style="font-size: 12px; color: #888; margin: 0;">Submission ID: ${submissionId} • Received via n8n fan-out to showcase our email marketing.</p>
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
