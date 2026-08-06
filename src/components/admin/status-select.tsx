"use client";

import { useTransition } from "react";

import { updateInboxStatusAction } from "@/app/admin/inbox/actions";
import {
  INBOX_STATUSES,
  isInboxStatus,
  type InboxStatus,
} from "@/lib/admin/config";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const value = isInboxStatus(status) ? status : "new";

  function onChange(next: string) {
    startTransition(async () => {
      await updateInboxStatusAction(id, next as InboxStatus);
    });
  }

  return (
    <select
      className="rounded-md border border-input bg-background px-2 py-1 text-sm"
      value={value}
      disabled={pending}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Submission status"
    >
      {INBOX_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
