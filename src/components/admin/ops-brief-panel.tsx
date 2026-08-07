"use client";

import * as React from "react";

import { draftOpsBriefAction } from "@/app/admin/ops-brief-actions";
import { adminControlClass } from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";
import type { LoopCollection } from "@/lib/admin/loops/types";
type Props = {
  collection: LoopCollection;
};

export function OpsBriefPanel({ collection }: Props) {
  const [open, setOpen] = React.useState(false);
  const [headline, setHeadline] = React.useState("");
  const [bulletsText, setBulletsText] = React.useState("");
  const [focusHint, setFocusHint] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "drafting" | "error">(
    "idle",
  );
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  async function onDraft() {
    setOpen(true);
    setStatus("drafting");
    setError(null);
    setCopied(false);
    const result = await draftOpsBriefAction(collection);
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
      {!open ? (
        <Button type="button" size="sm" variant="outline" onClick={onDraft}>
          Draft today brief
        </Button>
      ) : null}

      {open ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium">Today brief</h3>
            {status === "drafting" ? (
              <span className="text-xs text-muted-foreground">Drafting…</span>
            ) : null}
            {copied ? (
              <span className="text-xs text-muted-foreground">Copied.</span>
            ) : null}
          </div>
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
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onCopy}
              disabled={status === "drafting" || !headline.trim()}
            >
              Copy
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setHeadline("");
                setBulletsText("");
                setFocusHint("");
                setError(null);
                setCopied(false);
                setStatus("idle");
              }}
              disabled={status === "drafting"}
            >
              Discard
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onDraft}
              disabled={status === "drafting"}
            >
              Redraft
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
