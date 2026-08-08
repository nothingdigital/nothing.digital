"use client";

import { useRouter } from "next/navigation";
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

function StatusSelect({
  value,
  options,
  ariaLabel,
  onChange,
}: {
  value: string;
  options: readonly string[];
  ariaLabel: string;
  onChange: (next: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className={selectClass}
      value={value}
      disabled={pending}
      aria-label={ariaLabel}
      onChange={(event) => {
        startTransition(async () => {
          await onChange(event.target.value);
        });
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function InvoiceStatusSelect({
  id,
  status,
  clientId,
}: {
  id: string;
  status: string;
  clientId?: string;
}) {
  const router = useRouter();
  return (
    <StatusSelect
      value={isInvoiceStatus(status) ? status : "draft"}
      options={INVOICE_STATUSES}
      ariaLabel="Invoice status"
      onChange={async (next) => {
        await updateInvoiceStatusAction(id, next as InvoiceStatus, clientId);
        router.refresh();
      }}
    />
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
  return (
    <StatusSelect
      value={isAssetStatus(status) ? status : "active"}
      options={ASSET_STATUSES}
      ariaLabel="Asset status"
      onChange={async (next) => {
        await updateAssetStatusAction(id, next as AssetStatus, clientId);
      }}
    />
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
  return (
    <StatusSelect
      value={isWorkStatus(status) ? status : "backlog"}
      options={WORK_STATUSES}
      ariaLabel="Work status"
      onChange={async (next) => {
        await updateWorkItemStatusAction(id, next as WorkStatus, clientId);
      }}
    />
  );
}
