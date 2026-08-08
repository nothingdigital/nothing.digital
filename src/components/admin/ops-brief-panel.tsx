"use client";

import * as React from "react";

import { draftOpsBriefAction } from "@/app/admin/ops-brief-actions";
import { adminControlClass } from "@/components/admin/admin-form";
import { HitlDraftShell } from "@/components/admin/hitl-draft-shell";

export function OpsBriefPanel() {
  const [open, setOpen] = React.useState(false);
  const [headline, setHeadline] = React.useState("");
  const [bulletsText, setBulletsText] = React.useState("");
  const [focusHint, setFocusHint] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "drafting" | "sending" | "sent" | "error"
  >("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  async function onDraft() {
    setOpen(true);
    setStatus("drafting");
    setError(null);
    setCopied(false);
    const result = await draftOpsBriefAction();
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setHeadline(result.brief.headline);
    setBulletsText(result.brief.bullets.join("\n"));
    setFocusHint(result.brief.focusHint);
    setStatus("idle");
  }

  function plainText() {
    const bullets = bulletsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `- ${line}`)
      .join("\n");
    return [headline, bullets, focusHint].filter(Boolean).join("\n\n");
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(plainText());
      setCopied(true);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-4">
      <HitlDraftShell
        title="Today brief"
        closedLabel="Draft today brief"
        open={open}
        status={status}
        error={error}
        statusNote={
          copied ? (
            <span className="text-xs text-muted-foreground">Copied.</span>
          ) : null
        }
        onDraft={onDraft}
        onDiscard={() => {
          setOpen(false);
          setHeadline("");
          setBulletsText("");
          setFocusHint("");
          setError(null);
          setCopied(false);
          setStatus("idle");
        }}
        primary={{
          label: "Copy",
          busyLabel: "Copy",
          onClick: onCopy,
          disabled: !headline.trim(),
        }}
      >
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Headline
          <input
            className={adminControlClass}
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            disabled={status === "drafting"}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Bullets (one per line)
          <textarea
            className={`${adminControlClass} min-h-28`}
            value={bulletsText}
            onChange={(event) => setBulletsText(event.target.value)}
            disabled={status === "drafting"}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Focus hint
          <input
            className={adminControlClass}
            value={focusHint}
            onChange={(event) => setFocusHint(event.target.value)}
            disabled={status === "drafting"}
          />
        </label>
      </HitlDraftShell>
    </div>
  );
}
