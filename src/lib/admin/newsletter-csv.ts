export type NewsletterCsvRow = {
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
};

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function buildNewsletterCsv(rows: NewsletterCsvRow[]): string {
  const header = "email,subscribed_at,status,unsubscribed_at";
  const lines = rows.map((row) => {
    const status = row.unsubscribed_at ? "unsubscribed" : "active";
    return [
      escapeCsvField(row.email),
      escapeCsvField(row.subscribed_at),
      escapeCsvField(status),
      escapeCsvField(row.unsubscribed_at ?? ""),
    ].join(",");
  });
  return [header, ...lines].join("\n");
}
