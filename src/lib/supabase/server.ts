import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import type { Database } from "./database";

export function getServiceRoleClient(): SupabaseClient<Database> | null {
  const url = env.private.SUPABASE_SERVICE_ROLE_KEY
    ? env.public.NEXT_PUBLIC_SUPABASE_URL
    : null;
  const key = env.private.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(
      "[supabase] Service role key missing; Supabase client disabled.",
    );
    return null;
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
