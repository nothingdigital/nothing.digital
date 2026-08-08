"use client";

import * as React from "react";

import {
  draftInboxReplyAction,
  sendInboxReplyAction,
} from "@/app/admin/inbox/actions";
import { adminControlClass } from "@/components/admin/admin-form";
import { HitlDraftShell } from "@/components/admin/hitl-draft-shell";
import { Badge } from "@/components/ui/badge";
import type { InboxDraft } from "@/lib/ai/types";

type Props = {
  submissionId: string;
};

export function InboxReplyDraftPanel({ submissionId }: Props) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<InboxDraft | null>(null);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "drafting" | "sending" | "sent" | "error"
  >("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onDraft() {
    setOpen(true);
    setStatus("drafting");
    setError(null);
    const result = await draftInboxReplyAction(submissionId);
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setDraft(result.draft);
    setSubject(result.draft.subject);
    setBody(result.draft.body);
    setStatus("idle");
  }

  async function onSend() {
    setStatus("sending");
    setError(null);
    const result = await sendInboxReplyAction({
      submissionId,
      subject,
      body,
    });
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <HitlDraftShell
        title="Reply draft"
        closedLabel="Draft reply"
        open={open}
        status={status}
        error={error}
        statusNote={
          <>
            {draft ? <Badge variant="secondary">{draft.triage}</Badge> : null}
            {status === "sent" ? (
              <span className="text-xs text-muted-foreground">Sent.</span>
            ) : null}
          </>
        }
        onDraft={onDraft}
        onDiscard={() => {
          setOpen(false);
          setDraft(null);
          setSubject("");
          setBody("");
          setError(null);
          setStatus("idle");
        }}
        primary={{
          label: "Approve & Send",
          busyLabel: "Sending…",
          onClick: onSend,
          disabled:
            status === "sending" ||
            status === "sent" ||
            !subject.trim() ||
            !body.trim(),
        }}
      >
        {draft?.triageReason ? (
          <p className="text-xs text-muted-foreground">{draft.triageReason}</p>
        ) : null}
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
          Body
          <textarea
            className={`${adminControlClass} min-h-40`}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            disabled={status === "drafting" || status === "sending"}
          />
        </label>
      </HitlDraftShell>
    </div>
  );
}
