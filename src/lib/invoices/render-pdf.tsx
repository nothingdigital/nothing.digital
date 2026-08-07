import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { formatCents } from "@/lib/admin/client-ops";

export type InvoicePdfInput = {
  number: string;
  title: string;
  amount_cents: number;
  currency: string;
  status: string;
  issued_at: string | null;
  due_at: string | null;
  notes: string | null;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111111",
  },
  brand: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  muted: {
    color: "#555555",
    marginBottom: 24,
  },
  heading: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#555555",
    width: "35%",
  },
  value: {
    width: "65%",
  },
  amount: {
    marginTop: 24,
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  notes: {
    marginTop: 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    color: "#333333",
  },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 48,
    right: 48,
    fontSize: 9,
    color: "#777777",
  },
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function InvoicePdfDocument({ invoice }: { invoice: InvoicePdfInput }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Nothing.Digital</Text>
        <Text style={styles.muted}>Premium digital services</Text>
        <Text style={styles.heading}>Invoice {invoice.number}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Bill to</Text>
          <Text style={styles.value}>
            {invoice.clientName}
            {invoice.clientCompany ? `\n${invoice.clientCompany}` : ""}
            {`\n${invoice.clientEmail}`}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{invoice.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{invoice.status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Issued</Text>
          <Text style={styles.value}>{formatDate(invoice.issued_at)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Due</Text>
          <Text style={styles.value}>{formatDate(invoice.due_at)}</Text>
        </View>

        <Text style={styles.amount}>
          {formatCents(invoice.amount_cents, invoice.currency)}
        </Text>

        {invoice.notes ? (
          <View style={styles.notes}>
            <Text>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          nothing.digital · Questions? hello@nothing.digital
        </Text>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(
  invoice: InvoicePdfInput,
): Promise<Buffer> {
  return renderToBuffer(<InvoicePdfDocument invoice={invoice} />);
}
