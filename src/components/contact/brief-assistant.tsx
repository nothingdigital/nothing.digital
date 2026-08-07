"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BriefAssistOutput } from "@/lib/ai/types";

type Props = {
  onApply: (result: BriefAssistOutput) => void;
};

const emptyAnswers = {
  goal: "",
  currentState: "",
  mustHaves: "",
  timelineFeel: "",
  constraints: "",
  website: "",
};

export function BriefAssistant({ onApply }: Props) {
  const [open, setOpen] = React.useState(false);
  const [answers, setAnswers] = React.useState(emptyAnswers);
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [error, setError] = React.useState<string | null>(null);

  function setField(key: keyof typeof emptyAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function onGenerate() {
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/ai/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const payload = (await response.json()) as BriefAssistOutput & {
        error?: string;
      };
      if (!response.ok) {
        setStatus("error");
        setError(payload.error ?? "Could not draft a brief.");
        return;
      }
      onApply(payload);
      setOpen(false);
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("Could not draft a brief.");
    }
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Help me write a brief
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-border p-3">
      <div>
        <p className="text-sm font-medium">Project brief assistant</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Draft for you to edit — not a quote or commitment.
        </p>
      </div>
      <Field
        label="What are you trying to achieve?"
        value={answers.goal}
        onChange={(value) => setField("goal", value)}
      />
      <Field
        label="What do you have today?"
        value={answers.currentState}
        onChange={(value) => setField("currentState", value)}
      />
      <Field
        label="Must-haves"
        value={answers.mustHaves}
        onChange={(value) => setField("mustHaves", value)}
      />
      <Field
        label="Timeline feel"
        value={answers.timelineFeel}
        onChange={(value) => setField("timelineFeel", value)}
      />
      <Field
        label="Constraints (optional)"
        value={answers.constraints}
        onChange={(value) => setField("constraints", value)}
      />
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={answers.website}
        onChange={(event) => setField("website", event.target.value)}
        aria-hidden
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={onGenerate}
          disabled={
            status === "loading" ||
            !answers.goal.trim() ||
            !answers.currentState.trim() ||
            !answers.mustHaves.trim() ||
            !answers.timelineFeel.trim()
          }
        >
          {status === "loading" ? "Drafting…" : "Draft message"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setError(null);
            setStatus("idle");
          }}
          disabled={status === "loading"}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      {label}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={500}
      />
    </label>
  );
}
