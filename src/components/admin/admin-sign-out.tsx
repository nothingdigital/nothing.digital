"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminSignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      router.replace("/admin/login");
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={signOut}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
