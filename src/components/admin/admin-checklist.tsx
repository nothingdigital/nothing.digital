import { toggleChecklistItemAction } from "@/app/admin/checklist/actions";
import type { ChecklistItemDef } from "@/lib/admin/loops/rules/runbook-setup";
import { cn } from "@/lib/utils";

export function AdminChecklist({
  checklistKey,
  items,
  checkedKeys,
  className,
}: {
  checklistKey: string;
  items: ChecklistItemDef[];
  checkedKeys: string[];
  className?: string;
}) {
  const checked = new Set(checkedKeys);

  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item) => {
        const isChecked = checked.has(item.key);
        return (
          <li key={item.key}>
            <form action={toggleChecklistItemAction} className="flex gap-2">
              <input type="hidden" name="checklist_key" value={checklistKey} />
              <input type="hidden" name="item_key" value={item.key} />
              <input
                type="hidden"
                name="checked"
                value={isChecked ? "false" : "true"}
              />
              <button
                type="submit"
                className="flex w-full items-start gap-3 rounded-md px-1 py-1.5 text-left text-sm hover:bg-muted/50"
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    isChecked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input",
                  )}
                >
                  {isChecked ? "✓" : null}
                </span>
                <span
                  className={
                    isChecked
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }
                >
                  {item.label}
                </span>
              </button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}
