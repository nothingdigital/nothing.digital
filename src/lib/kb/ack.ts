export function needsAck({
  status,
  requiresAck,
  approvedVersion,
  userAckVersion,
}: {
  status: string;
  requiresAck: boolean;
  approvedVersion: number | null;
  userAckVersion: number | null | undefined;
}): boolean {
  return (
    status === "approved" &&
    requiresAck &&
    approvedVersion != null &&
    userAckVersion !== approvedVersion
  );
}
