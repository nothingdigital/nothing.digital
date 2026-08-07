import type { Metadata } from "next";
import Link from "next/link";

import { AdminField, adminControlClass } from "@/components/admin/admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/admin/auth";
import {
  listNodesForSpace,
  listPagesNeedingAckForUser,
  listSpaces,
} from "@/lib/kb/queries";

import {
  createFolderAction,
  createPageAction,
  importPageAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Docs",
  robots: { index: false, follow: false },
};

export default async function AdminDocsHomePage() {
  const user = await requireAdmin();
  const [spacesRes, needsAckRes] = await Promise.all([
    listSpaces(),
    listPagesNeedingAckForUser(user.id),
  ]);

  const spaces = spacesRes.rows;
  const defaultSpace = spaces[0]?.id ?? "";

  // ponytail: flat folder list with space prefix; no live space→folder filter
  const folders: { id: string; space_id: string; label: string }[] = [];
  for (const space of spaces) {
    const nodesRes = await listNodesForSpace(space.id);
    for (const node of nodesRes.rows) {
      if (node.type !== "folder") continue;
      folders.push({
        id: node.id,
        space_id: space.id,
        label: `${space.title} / ${node.title}`,
      });
    }
  }

  const parentSelect = (id: string) => (
    <AdminField label="Parent folder (optional)" htmlFor={id}>
      <select
        id={id}
        name="parent_id"
        defaultValue=""
        className={adminControlClass}
      >
        <option value="">Space root</option>
        {folders.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
    </AdminField>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Docs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Handbook, policies, templates, and business logic.
        </p>
      </div>

      {needsAckRes.error ? (
        <p className="text-sm text-destructive">{needsAckRes.error}</p>
      ) : needsAckRes.rows.length > 0 ? (
        <section className="space-y-2 rounded-md border border-border p-4">
          <h3 className="text-sm font-semibold">Needs your acknowledgment</h3>
          <ul className="space-y-1">
            {needsAckRes.rows.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/admin/docs/${page.id}`}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  {page.node.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {spacesRes.error ? (
        <p className="text-sm text-destructive">{spacesRes.error}</p>
      ) : null}

      <section className="grid gap-6 sm:grid-cols-2">
        <form action={createPageAction} className="space-y-3">
          <h3 className="text-sm font-semibold">New page</h3>
          <AdminField label="Title" htmlFor="page-title">
            <Input id="page-title" name="title" required />
          </AdminField>
          <AdminField label="Space" htmlFor="page-space">
            <select
              id="page-space"
              name="space_id"
              defaultValue={defaultSpace}
              className={adminControlClass}
              required
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </AdminField>
          {parentSelect("page-parent")}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="requires_ack" />
            Requires acknowledgment when approved
          </label>
          <Button type="submit">Create page</Button>
        </form>

        <form action={createFolderAction} className="space-y-3">
          <h3 className="text-sm font-semibold">New folder</h3>
          <AdminField label="Title" htmlFor="folder-title">
            <Input id="folder-title" name="title" required />
          </AdminField>
          <AdminField label="Space" htmlFor="folder-space">
            <select
              id="folder-space"
              name="space_id"
              defaultValue={defaultSpace}
              className={adminControlClass}
              required
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </AdminField>
          {parentSelect("folder-parent")}
          <Button type="submit" variant="secondary">
            Create folder
          </Button>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Import file</h3>
        <p className="text-xs text-muted-foreground">
          .docx / .xlsx extract to draft markdown; .numbers stores file only.
        </p>
        <form action={importPageAction} className="space-y-3">
          <AdminField label="Title (optional)" htmlFor="import-title">
            <Input id="import-title" name="title" />
          </AdminField>
          <AdminField label="Space" htmlFor="import-space">
            <select
              id="import-space"
              name="space_id"
              defaultValue={defaultSpace}
              className={adminControlClass}
              required
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </AdminField>
          {parentSelect("import-parent")}
          <AdminField label="File" htmlFor="import-file">
            <Input
              id="import-file"
              name="file"
              type="file"
              accept=".docx,.xlsx,.xls,.numbers,.pdf"
              required
            />
          </AdminField>
          <Button type="submit" variant="secondary">
            Import
          </Button>
        </form>
      </section>
    </div>
  );
}
