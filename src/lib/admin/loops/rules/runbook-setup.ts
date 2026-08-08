import { runbookLoop } from "../keys";
import type { Loop } from "../types";

export type ChecklistItemDef = {
  key: string;
  label: string;
};

/** Mirrors docs/runbooks/listmonk-drip.md checklist (unchecked setup steps). */
export const LISTMONK_DRIP_ITEMS: ChecklistItemDef[] = [
  {
    key: "templates",
    label: "Templates imported and previewed (Day 0 / 3 / 7)",
  },
  {
    key: "sequence",
    label: "Sequence scheduled (0 / 3 / 7)",
  },
  {
    key: "live-form",
    label: "Live form → Listmonk subscribe verified",
  },
  {
    key: "unsubscribe",
    label: "Unsubscribe link works (Listmonk SoT)",
  },
];

/** Advisory Instantly preflight — docs/runbooks/outbound-instantly.md */
export const INSTANTLY_PREFLIGHT_ITEMS: ChecklistItemDef[] = [
  { key: "dns", label: "Sending domain SPF/DKIM/DMARC pass in Instantly" },
  { key: "warmup", label: "Warmup running ≥14 days" },
  { key: "caps", label: "Daily cap set (20–40/inbox to start)" },
  { key: "canspam", label: "CAN-SPAM footer: identity, address, unsubscribe" },
  { key: "suppress", label: "Suppression list synced to Instantly blocklist" },
  { key: "no-listmonk", label: "Listmonk empty of any cold CSV imports" },
];

export function runbookSetupLoops(uncheckedItemKeys: string[]): Loop[] {
  const unchecked = new Set(uncheckedItemKeys);
  const remaining = LISTMONK_DRIP_ITEMS.filter((item) =>
    unchecked.has(item.key),
  );
  if (remaining.length === 0) return [];

  return [
    {
      key: runbookLoop("listmonk-drip", "open"),
      source: "setup",
      title: "Listmonk drip setup",
      detail: `${remaining.length} step${remaining.length === 1 ? "" : "s"} left`,
      href: "/admin/health#listmonk-drip",
      priority: 50,
    },
  ];
}

export function uncheckedChecklistKeys(
  allItems: ChecklistItemDef[],
  checkedKeys: Iterable<string>,
): string[] {
  const checked = new Set(checkedKeys);
  return allItems
    .filter((item) => !checked.has(item.key))
    .map((item) => item.key);
}
