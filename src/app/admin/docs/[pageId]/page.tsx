import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { AdminField, adminTextareaClass } from "@/components/admin/admin-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { needsAck } from "@/lib/kb/ack";
import {
  getPageById,
  listAcknowledgments,
  listAttachments,
  listVersions,
} from "@/lib/kb/queries";
import { canTransition, type KbStatus } from "@/lib/kb/status";

import {
  acknowledgePageAction,
  addAttachmentAction,
  deleteNodeAction,
  restoreVersionAction,
  savePageAction,
  setRequiresAckAction,
  transitionStatusAction,
} from "../actions";

export const metadata: Metadata = {
  title: "Doc page",
  robots: { index: false, follow: false },
};

const mdxArticleClass =
  "space-y-4 text-sm leading-relaxed text-foreground " +
  "[&_h1]:font-display [&_h1]:text-3xl [&_h1]:tracking-tight " +
  "[&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold " +
  "[&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold " +
  "[&_p]:text-muted-foreground [&_li]:text-muted-foreground " +
  "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 " +
  "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 " +
  "[&_table]:w-full [&_th]:border-b [&_th]:border-border [&_th]:px-2 [&_th]:py-2 " +
  "[&_td]:border-b [&_td]:border-border [&_td]:px-2 [&_td]:py-2 " +
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs";

const TRANSITIONS: { to: KbStatus; label: string }[] = [
  { to: "in_review", label: "Submit for review" },
  { to: "approved", label: "Approve" },
  { to: "draft", label: "Send back to draft" },
];

export default async function AdminDocPage({
  params,
  searchParams,
}: {
  params: Promise<{ pageId: string }>;
  searchParams: Promise<{ extractError?: string; edit?: string }>;
}) {
  const user = await requireAdmin();
  const { pageId } = await params;
  const sp = await searchParams;
  const editing = sp.edit === "1";

  const pageRes = await getPageById(pageId);
  if (pageRes.error || !pageRes.row) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {pageRes.error ?? "Page not found."}
      </p>
    );
  }

  const page = pageRes.row;
  const [versionsRes, attachmentsRes, acksRes] = await Promise.all([
    listVersions(pageId),
    listAttachments(pageId),
    listAcknowledgments(pageId),
  ]);

  const userHasAck = acksRes.rows.some(
    (a) => a.user_id === user.id && a.version === page.approved_version,
  );

  const showAck = needsAck({
    status: page.status,
    requiresAck: page.requires_ack,
    approvedVersion: page.approved_version,
    userAckVersion: userHasAck ? page.approved_version : null,
  });

  let rendered: React.ReactNode = null;
  if (!editing && page.body.trim()) {
    try {
      const mdx = await compileMDX({
        source: page.body,
        options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
      });
      rendered = mdx.content;
    } catch {
      rendered = (
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
          {page.body}
        </pre>
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            <Link href="/admin/docs" className="hover:underline">
              Docs
            </Link>
          </p>
          <h2 className="font-display text-3xl tracking-tight">
            {page.node.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{page.status}</Badge>
            <span className="text-xs text-muted-foreground">
              v{page.current_version}
              {page.approved_version != null
                ? ` · approved v${page.approved_version}`
                : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <Button asChild variant="secondary">
              <Link href={`/admin/docs/${pageId}`}>View</Link>
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href={`/admin/docs/${pageId}?edit=1`}>Edit</Link>
            </Button>
          )}
        </div>
      </div>

      {sp.extractError ? (
        <p
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          Extract warning: {sp.extractError}
        </p>
      ) : null}

      {showAck ? (
        <form action={acknowledgePageAction}>
          <input type="hidden" name="page_id" value={pageId} />
          <Button type="submit">I have read this</Button>
        </form>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {TRANSITIONS.filter(({ to }) =>
          canTransition(page.status as KbStatus, to),
        ).map(({ to, label }) => (
          <form key={to} action={transitionStatusAction}>
            <input type="hidden" name="page_id" value={pageId} />
            <input type="hidden" name="to" value={to} />
            <Button type="submit" variant="secondary" size="sm">
              {label}
            </Button>
          </form>
        ))}
      </div>

      <form action={setRequiresAckAction} className="flex items-center gap-2">
        <input type="hidden" name="page_id" value={pageId} />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="requires_ack"
            defaultChecked={page.requires_ack}
          />
          Requires acknowledgment
        </label>
        <Button type="submit" variant="ghost" size="sm">
          Save
        </Button>
      </form>

      {editing ? (
        <form action={savePageAction} className="space-y-3">
          <input type="hidden" name="page_id" value={pageId} />
          <AdminField label="Markdown body" htmlFor="body">
            <textarea
              id="body"
              name="body"
              defaultValue={page.body}
              className={`${adminTextareaClass} min-h-[320px] font-mono text-xs`}
            />
          </AdminField>
          <Button type="submit">Save draft</Button>
        </form>
      ) : (
        <article className={mdxArticleClass}>
          {rendered ?? (
            <p className="text-muted-foreground">Empty page. Click Edit.</p>
          )}
        </article>
      )}

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Attachments</h3>
        {attachmentsRes.error ? (
          <p className="text-sm text-destructive">{attachmentsRes.error}</p>
        ) : attachmentsRes.rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">None</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {attachmentsRes.rows.map((a) => (
              <li key={a.id}>
                <a
                  href={`/admin/docs/attachments/${a.id}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {a.filename}
                </a>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({a.kind})
                </span>
              </li>
            ))}
          </ul>
        )}
        <form action={addAttachmentAction} className="flex flex-wrap gap-2">
          <input type="hidden" name="page_id" value={pageId} />
          <input type="file" name="file" required className="text-sm" />
          <Button type="submit" variant="secondary" size="sm">
            Upload
          </Button>
        </form>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Versions</h3>
        {versionsRes.error ? (
          <p className="text-sm text-destructive">{versionsRes.error}</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {versionsRes.rows.map((v) => (
              <li
                key={v.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2"
              >
                <span>
                  v{v.version} · {v.status}
                  {v.note ? ` · ${v.note}` : ""}
                </span>
                <form action={restoreVersionAction}>
                  <input type="hidden" name="page_id" value={pageId} />
                  <input type="hidden" name="version" value={v.version} />
                  <Button type="submit" variant="ghost" size="sm">
                    Restore to draft
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      {acksRes.rows.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Acknowledgments</h3>
          <ul className="text-sm text-muted-foreground">
            {acksRes.rows.map((a) => (
              <li key={a.id}>
                user {a.user_id.slice(0, 8)}… · v{a.version} ·{" "}
                {new Date(a.acked_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <form action={deleteNodeAction} className="border-t border-border pt-4">
        <input type="hidden" name="node_id" value={page.node_id} />
        <Button type="submit" variant="destructive" size="sm">
          Delete page
        </Button>
      </form>
    </div>
  );
}
