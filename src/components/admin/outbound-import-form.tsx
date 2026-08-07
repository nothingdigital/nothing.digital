"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { importLeadsCsvAction } from "@/app/admin/outbound/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OutboundImportForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setMessage(null);
        setError(null);
        startTransition(async () => {
          const result = await importLeadsCsvAction(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setMessage(`Imported ${result.imported} leads.`);
          event.currentTarget.reset();
          router.refresh();
        });
      }}
    >
      <Input
        id="csv"
        name="csv"
        type="file"
        accept=".csv,text/csv"
        required
        disabled={pending}
      />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Importing…" : "Import CSV"}
      </Button>
      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
