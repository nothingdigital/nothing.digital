import Link from "next/link";

import type { KbNode, KbSpace } from "@/lib/kb/queries";
import { listNodesForSpace, listSpaces } from "@/lib/kb/queries";
import { getServiceRoleClient } from "@/lib/supabase/server";

type TreeNode = KbNode & { pageId?: string };

async function pageIdByNodeId(nodeIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (nodeIds.length === 0) return map;

  const supabase = getServiceRoleClient();
  if (!supabase) return map;

  const { data } = await supabase
    .from("kb_pages")
    .select("id, node_id")
    .in("node_id", nodeIds);

  for (const row of data ?? []) {
    map.set(row.node_id, row.id);
  }
  return map;
}

async function buildTree(): Promise<{
  spaces: KbSpace[];
  bySpace: Map<string, TreeNode[]>;
  error: string | null;
}> {
  const spacesRes = await listSpaces();
  if (spacesRes.error) {
    return { spaces: [], bySpace: new Map(), error: spacesRes.error };
  }

  const bySpace = new Map<string, TreeNode[]>();
  for (const space of spacesRes.rows) {
    const nodesRes = await listNodesForSpace(space.id);
    if (nodesRes.error) {
      return { spaces: [], bySpace: new Map(), error: nodesRes.error };
    }

    const pageNodes = nodesRes.rows.filter((n) => n.type === "page");
    const ids = await pageIdByNodeId(pageNodes.map((n) => n.id));
    bySpace.set(
      space.id,
      nodesRes.rows.map((n) =>
        n.type === "page" ? { ...n, pageId: ids.get(n.id) } : n,
      ),
    );
  }

  return { spaces: spacesRes.rows, bySpace, error: null };
}

function renderChildren(
  nodes: TreeNode[],
  parentId: string | null,
  depth: number,
): React.ReactNode {
  const children = nodes.filter((n) => n.parent_id === parentId);
  if (children.length === 0) return null;

  return (
    <ul
      className={
        depth === 0 ? "space-y-1" : "ml-3 space-y-1 border-l border-border pl-2"
      }
    >
      {children.map((node) => (
        <li key={node.id}>
          {node.type === "page" && node.pageId ? (
            <Link
              href={`/admin/docs/${node.pageId}`}
              className="block truncate text-sm text-muted-foreground hover:text-foreground"
            >
              {node.title}
            </Link>
          ) : (
            <span className="block truncate text-sm font-medium">
              {node.title}
            </span>
          )}
          {renderChildren(nodes, node.id, depth + 1)}
        </li>
      ))}
    </ul>
  );
}

export default async function AdminDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { spaces, bySpace, error } = await buildTree();

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <aside className="w-full shrink-0 space-y-4 md:w-56">
        <div>
          <h2 className="font-display text-lg tracking-tight">Docs</h2>
          <p className="text-xs text-muted-foreground">
            Internal knowledge base
          </p>
        </div>
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : (
          <nav className="space-y-4">
            {spaces.map((space) => (
              <div key={space.id}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {space.title}
                </p>
                {renderChildren(bySpace.get(space.id) ?? [], null, 0) ?? (
                  <p className="text-xs text-muted-foreground">Empty</p>
                )}
              </div>
            ))}
          </nav>
        )}
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
