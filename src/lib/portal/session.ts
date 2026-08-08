import { getSessionUser } from "@/lib/admin/auth";
import { isAdminEmail } from "@/lib/admin/config";
import { findClientByEmail } from "@/lib/documents/queries";
import type { Database } from "@/lib/supabase/database";

export type PortalClient = Database["public"]["Tables"]["clients"]["Row"];

export async function getPortalClient(): Promise<{
  userEmail: string | null;
  client: PortalClient | null;
  isAdmin: boolean;
  error: string | null;
}> {
  const user = await getSessionUser();
  if (!user?.email) {
    return { userEmail: null, client: null, isAdmin: false, error: null };
  }

  const isAdmin = isAdminEmail(user.email);
  const { row, error } = await findClientByEmail(user.email);

  return {
    userEmail: user.email,
    client: row,
    isAdmin,
    error,
  };
}
