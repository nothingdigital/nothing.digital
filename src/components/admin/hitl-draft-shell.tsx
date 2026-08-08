"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

type HitlStatus = "idle" | "drafting" | "sending" | "sent" | "error";

type Props = {
  title: string;
  closedLabel: string;
  open: boolean;
  status: HitlStatus;
  error: string | null;
  warning?: string | null;
  statusNote?: React.ReactNode;
  onDraft: () => void;
  onDiscard: () => void;
  primary?: {
    label: string;
    busyLabel: string;
    onClick: () => void;
    disabled: boolean;
  };
  children: React.ReactNode;
};

/** Shared chrome for admin AI draft → edit → act panels. */
export function HitlDraftShell({
  title,
  closedLabel,
  open,
  status,
  error,
  warning,
  statusNote,
  onDraft,
  onDiscard,
  primary,
  children,
}: Props) {
  if (!open) {
    return (
      <Button type="button" size="sm" variant="outline" onClick={onDraft}>
        {closedLabel}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium">{title}</p>
        {status === "drafting" ? (
          <span className="text-xs text-muted-foreground">Drafting…</span>
        ) : null}
        {statusNote}
      </div>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {warning ? (
        <p className="text-sm text-muted-foreground" role="status">
          {warning}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {primary ? (
          <Button
            type="button"
            size="sm"
            onClick={primary.onClick}
            disabled={primary.disabled || status === "drafting"}
          >
            {status === "sending" ? primary.busyLabel : primary.label}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onDiscard}
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
  );
}
