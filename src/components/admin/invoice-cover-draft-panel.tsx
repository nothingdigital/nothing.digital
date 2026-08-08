"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  draftInvoiceCoverAction,
  sendPendingInvoiceEmailAction,
} from "@/app/admin/clients/actions";
import { adminControlClass } from "@/components/admin/admin-form";
import { HitlDraftShell } from "@/components/admin/hitl-draft-shell";
import { Button } from "@/components/ui/button";

type Props = {
  invoiceId: string;
  enabled: boolean;
  needsCover: boolean;
};

export function InvoiceCoverDraftPanel({
  invoiceId,
  enabled,
  needsCover,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [coverNote, setCoverNote] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "drafting" | "sending" | "sent" | "error"
  >("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [warning, setWarning] = React.useState<string | null>(null);

  if (!needsCover) return null;

  async function sendCover(cover?: { subject: string; coverNote: string }) {
    setStatus("sending");
    setError(null);
    setWarning(null);
    const result = await sendPendingInvoiceEmailAction(invoiceId, cover);
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("sent");
    if (result.stampWarning) {
      setWarning(result.stampWarning);
    }
    router.refresh();
  }

  async function onDraft() {
    setOpen(true);
    setStatus("drafting");
    setError(null);
    setWarning(null);
    const result = await draftInvoiceCoverAction(invoiceId);
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setSubject(result.draft.subject);
    setCoverNote(result.draft.coverNote);
    setStatus("idle");
  }

  if (!enabled) {
    return (
      <div className="mt-2 w-full space-y-2 border-t border-border pt-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void sendCover()}
          disabled={status === "sending" || status === "sent"}
        >
          {status === "sending" ? "Sending…" : "Send invoice email"}
        </Button>
        {status === "sent" && !warning ? (
          <p className="text-xs text-muted-foreground">Sent.</p>
        ) : null}
        {warning ? (
          <p className="text-sm text-muted-foreground" role="status">
            {warning}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-2 w-full border-t border-border pt-2">
      <HitlDraftShell
        title="Invoice cover draft"
        closedLabel="Draft cover note"
        open={open}
        status={status}
        error={error}
        warning={warning}
        statusNote={
          status === "sent" && !warning ? (
            <span className="text-xs text-muted-foreground">Sent.</span>
          ) : null
        }
        onDraft={onDraft}
        onDiscard={() => {
          setOpen(false);
          setSubject("");
          setCoverNote("");
          setError(null);
          setWarning(null);
          setStatus("idle");
        }}
        primary={{
          label: "Approve & Send",
          busyLabel: "Sending…",
          onClick: () => void sendCover({ subject, coverNote }),
          disabled:
            status === "sending" ||
            status === "sent" ||
            !subject.trim() ||
            !coverNote.trim(),
        }}
      >
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Subject
          <input
            className={adminControlClass}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            disabled={status === "drafting" || status === "sending"}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Cover note
          <textarea
            className={`${adminControlClass} min-h-32`}
            value={coverNote}
            onChange={(event) => setCoverNote(event.target.value)}
            disabled={status === "drafting" || status === "sending"}
          />
        </label>
      </HitlDraftShell>
    </div>
  );
}
