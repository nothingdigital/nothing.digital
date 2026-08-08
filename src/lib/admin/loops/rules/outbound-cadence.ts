import { cadenceLoop, isoWeekPeriod } from "../keys";
import type { Loop } from "../types";

export function outboundCadenceLoop(
  now: Date = new Date(),
  readyLeadCount = 0,
): Loop {
  const period = isoWeekPeriod(now);
  const readyHint =
    readyLeadCount > 0
      ? `${readyLeadCount} lead${readyLeadCount === 1 ? "" : "s"} ready in Outbound`
      : "Run lead-finder locally, then review in Outbound";

  return {
    key: cadenceLoop("outbound-weekly", period),
    source: "outbound",
    title: `Outbound batch · ${period}`,
    detail: readyHint,
    href: "/admin/outbound",
    priority: 40,
  };
}
