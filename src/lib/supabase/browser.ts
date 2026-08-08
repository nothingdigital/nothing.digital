import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";
import type { Database } from "./database";

export function createBrowserSupabaseClient() {
  const url = env.public.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.public.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createBrowserClient<Database>(url, key);
}
