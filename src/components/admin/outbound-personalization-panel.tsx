"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { saveOutboundPersonalizationAction } from "@/app/admin/outbound/actions";
import { adminControlClass } from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";

type Props = {
  leadId: string;
  initialLine: string | null;
};

export function OutboundPersonalizationPanel({ leadId, initialLine }: Props) {
  const router = useRouter();
  const [line, setLine] = React.useState(initialLine ?? "");
  const [status, setStatus] = React.useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLine(initialLine ?? "");
  }, [initialLine]);

  const unsavedDiffers =
    line.trim().length > 0 && line.trim() !== (initialLine ?? "").trim();

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
        {status === "saved" ? (
          <span className="text-xs text-muted-foreground">Saved.</span>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        From lead-finder <code className="font-mono">--ai-rank</code> or edit by
        hand. Optional for Instantly export.
      </p>
      {unsavedDiffers ? (
        <p className="text-xs text-muted-foreground">Unsaved — Save to keep</p>
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
          disabled={status === "saving"}
          maxLength={160}
        />
      </label>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        size="sm"
        onClick={onSave}
        disabled={status === "saving" || line.trim().length < 8}
      >
        {status === "saving" ? "Saving…" : "Save line"}
      </Button>
    </div>
  );
}
