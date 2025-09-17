// src/domain/documents/components/DocumentCardGrid.tsx
"use client";

type Doc = {
  id?: string | number;
  number?: string;
  title?: string;
  documentDate?: string; // ISO
  expireDate?: string;   // ISO
  archive?: string;
  contributors?: string[];
};

export default function DocumentCardGrid({ items }: { items: Doc[] }) {
  if (!items || items.length === 0) {
    // panel di DocumentsPanel sudah menampilkan empty hint
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((d, idx) => (
        <article
          key={d.id ?? idx}
          className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_1px_0_#eee] transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
        >
          {/* header dokumen */}
          <div className="flex items-start gap-3">
            <IconFile className="h-9 w-9 flex-none text-emerald-700/90" />
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
                {d.title ?? "Untitled Document"}
              </h3>
              <p className="truncate text-xs text-neutral-500">
                {d.number ?? "—"} · {d.archive ?? "—"}
              </p>
            </div>
          </div>

          {/* meta */}
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <div className="rounded-lg bg-neutral-50 px-2 py-1 dark:bg-neutral-700/40">
              <dt className="truncate">Doc Date</dt>
              <dd className="truncate">{formatDate(d.documentDate)}</dd>
            </div>
            <div className="rounded-lg bg-neutral-50 px-2 py-1 dark:bg-neutral-700/40">
              <dt className="truncate">Expire</dt>
              <dd className="truncate">{formatDate(d.expireDate)}</dd>
            </div>
          </dl>

          {/* footer */}
          <div className="mt-3 flex items-center justify-between">
            <div className="truncate text-xs text-neutral-500">
              {(d.contributors ?? []).slice(0, 2).join(", ") || "—"}
            </div>
            <button className="rounded-lg border px-2 py-1 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700">
              Open
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

/* utils & icon */
function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

function IconFile(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
