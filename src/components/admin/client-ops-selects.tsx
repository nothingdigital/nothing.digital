"use client";

import { useTransition } from "react";

import {
  updateAssetStatusAction,
  updateInvoiceStatusAction,
  updateWorkItemStatusAction,
} from "@/app/admin/clients/actions";
import {
  ASSET_STATUSES,
  INVOICE_STATUSES,
  WORK_STATUSES,
  isAssetStatus,
  isInvoiceStatus,
  isWorkStatus,
  type AssetStatus,
  type InvoiceStatus,
  type WorkStatus,
} from "@/lib/admin/client-ops";

const selectClass =
  "rounded-md border border-input bg-background px-2 py-1 text-sm";

export function InvoiceStatusSelect({
  id,
  status,
  clientId,
}: {
  id: string;
  status: string;
  clientId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const value = isInvoiceStatus(status) ? status : "draft";

  return (
    <select
      className={selectClass}
      value={value}
      disabled={pending}
      aria-label="Invoice status"
      onChange={(event) => {
        startTransition(async () => {
          await updateInvoiceStatusAction(
            id,
            event.target.value as InvoiceStatus,
            clientId,
          );
        });
      }}
    >
      {INVOICE_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function AssetStatusSelect({
  id,
  status,
  clientId,
}: {
  id: string;
  status: string;
  clientId: string;
}) {
  const [pending, startTransition] = useTransition();
  const value = isAssetStatus(status) ? status : "active";

  return (
    <select
      className={selectClass}
      value={value}
      disabled={pending}
      aria-label="Asset status"
      onChange={(event) => {
        startTransition(async () => {
          await updateAssetStatusAction(
            id,
            event.target.value as AssetStatus,
            clientId,
          );
        });
      }}
    >
      {ASSET_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function WorkStatusSelect({
  id,
  status,
  clientId,
}: {
  id: string;
  status: string;
  clientId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const value = isWorkStatus(status) ? status : "backlog";

  return (
    <select
      className={selectClass}
      value={value}
      disabled={pending}
      aria-label="Work status"
      onChange={(event) => {
        startTransition(async () => {
          await updateWorkItemStatusAction(
            id,
            event.target.value as WorkStatus,
            clientId,
          );
        });
      }}
    >
      {WORK_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
