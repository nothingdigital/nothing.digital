"use client";

import * as React from "react";

import {
  draftInboxReplyAction,
  sendInboxReplyAction,
} from "@/app/admin/inbox/actions";
import { adminControlClass } from "@/components/admin/admin-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      {!open ? (
        <Button type="button" size="sm" variant="outline" onClick={onDraft}>
          Draft reply
        </Button>
      ) : null}

      {open ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">Reply draft</p>
            {draft ? <Badge variant="secondary">{draft.triage}</Badge> : null}
            {status === "drafting" ? (
              <span className="text-xs text-muted-foreground">Drafting…</span>
            ) : null}
            {status === "sent" ? (
              <span className="text-xs text-muted-foreground">Sent.</span>
            ) : null}
          </div>
          {draft?.triageReason ? (
            <p className="text-xs text-muted-foreground">
              {draft.triageReason}
            </p>
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
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onSend}
              disabled={
                status === "drafting" ||
                status === "sending" ||
                status === "sent" ||
                !subject.trim() ||
                !body.trim()
              }
            >
              {status === "sending" ? "Sending…" : "Approve & Send"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setDraft(null);
                setSubject("");
                setBody("");
                setError(null);
                setStatus("idle");
              }}
              disabled={status === "sending"}
            >
              Discard
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onDraft}
              disabled={status === "drafting" || status === "sending"}
            >
              Redraft
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
