"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  draftOutboundPersonalizationAction,
  saveOutboundPersonalizationAction,
} from "@/app/admin/outbound/actions";
import { adminControlClass } from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";

type Props = {
  leadId: string;
  initialLine: string | null;
  showMissingWarning: boolean;
};

export function OutboundPersonalizationPanel({
  leadId,
  initialLine,
  showMissingWarning,
}: Props) {
  const router = useRouter();
  const [line, setLine] = React.useState(initialLine ?? "");
  const [status, setStatus] = React.useState<
    "idle" | "drafting" | "saving" | "saved" | "error"
  >("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLine(initialLine ?? "");
  }, [initialLine]);

  const savedMissing = !initialLine?.trim();
  const unsavedDiffers =
    line.trim().length > 0 && line.trim() !== (initialLine ?? "").trim();

  async function onDraft() {
    setStatus("drafting");
    setError(null);
    const result = await draftOutboundPersonalizationAction(leadId);
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setLine(result.draft.line);
    setStatus("idle");
  }

  async function onSave() {
    setStatus("saving");
    setError(null);
    const result = await saveOutboundPersonalizationAction(leadId, line);
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("saved");
    router.refresh();
  }

  return (
    <div className="mt-3 w-full space-y-2 border-t border-border pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium">Personalization line</p>
        {status === "drafting" ? (
          <span className="text-xs text-muted-foreground">Drafting…</span>
        ) : null}
        {status === "saved" ? (
          <span className="text-xs text-muted-foreground">Saved.</span>
        ) : null}
      </div>
      {showMissingWarning && savedMissing ? (
        <p className="text-xs text-muted-foreground">
          Approved but missing personalization — excluded from Instantly export
          while AI personalization is on.
        </p>
      ) : null}
      {unsavedDiffers ? (
        <p className="text-xs text-muted-foreground">
          Unsaved — won’t export until Save
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        One-line Instantly variable
        <input
          className={adminControlClass}
          value={line}
          onChange={(event) => {
            setLine(event.target.value);
            setStatus("idle");
          }}
          disabled={status === "drafting" || status === "saving"}
          maxLength={160}
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
          variant="outline"
          onClick={onDraft}
          disabled={status === "drafting" || status === "saving"}
        >
          Draft line
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={
            status === "drafting" ||
            status === "saving" ||
            line.trim().length < 8
          }
        >
          {status === "saving" ? "Saving…" : "Save line"}
        </Button>
      </div>
    </div>
  );
}
