"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

/** Buat daftar nomor halaman dengan elipsis */
function buildPager(current: number, total: number, delta = 1): (number | "…")[] {
  if (total <= 0) return [];
  const set = new Set<number>([1, total]);
  for (let p = current - delta; p <= current + delta; p++) if (p >= 1 && p <= total) set.add(p);
  const arr = Array.from(set).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[i]);
    if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) out.push("…");
  }
  return out;
}

type Props = {
  page: number;
  totalPages: number;
  totalRows?: number;
  currentCount?: number;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
};

export default function Pagination({
  page,
  totalPages,
  totalRows,
  currentCount,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 10,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const cloneParams = () => new URLSearchParams(params.toString());

  // Baca page size dari beberapa alias (perPage | limit | pageSize)
  const raw =
    params.get("perPage") ??
    params.get("limit") ??
    params.get("pageSize") ??
    String(defaultPageSize);
  const pageSize = Math.max(1, Number(raw) || defaultPageSize);

  const pushQuery = (next: URLSearchParams) => {
    for (const [k, v] of Array.from(next.entries())) if (!v) next.delete(k);
    const href = `${pathname}?${next.toString()}`;
    // Proyekmu memakai typed routes; karena href dinamis, cast aman:
    router.push(href as never);
  };

  const go = (p: number) => {
    if (p < 1 || (totalPages > 0 && p > totalPages) || p === page) return;
    const sp = cloneParams();
    sp.set("page", String(p));
    pushQuery(sp);
  };

  const changePageSize = (size: number) => {
    const sp = cloneParams();
    sp.set("perPage", String(size));
    sp.set("limit", String(size)); // kompat untuk alias lama
    sp.delete("page"); // kembali ke page 1
    pushQuery(sp);
  };

  // Data untuk “Showing …”
  let start = 0,
    end = 0,
    total = totalRows ?? 0;

  if (totalRows != null) {
    if (totalRows > 0 && totalPages > 0) {
      start = (page - 1) * pageSize + 1;
      end = Math.min(page * pageSize, totalRows);
    }
  } else if (currentCount != null) {
    start = currentCount > 0 ? (page - 1) * pageSize + 1 : 0;
    end = currentCount > 0 ? start + currentCount - 1 : 0;
    total = currentCount;
  }

  const items = buildPager(page, totalPages);
  const canPrev = page > 1 && totalPages > 0;
  const canNext = page < totalPages && totalPages > 0;

  return (
    <div className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
        {/* Left: showing */}
        <div className="text-sm text-neutral-600 dark:text-neutral-300 sm:justify-self-start">
          {totalPages > 0 ? (
            <span>
              Showing{" "}
              <span className="font-medium text-neutral-800 dark:text-neutral-100">
                {start}-{end}
              </span>{" "}
              of{" "}
              <span className="font-medium text-neutral-800 dark:text-neutral-100">
                {total}
              </span>{" "}
              row(s).
            </span>
          ) : (
            <span>Showing 0 of 0 row(s).</span>
          )}
        </div>

        {/* Center: pager controls */}
        <div className="flex items-center justify-center gap-1">
          <button
            disabled={!canPrev}
            onClick={() => go(page - 1)}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Prev
          </button>

          {items.map((it, idx) =>
            it === "…" ? (
              <span key={`dot-${idx}`} className="px-2 text-neutral-400">
                …
              </span>
            ) : (
              <button
                key={it}
                onClick={() => go(it)}
                className={[
                  "min-w-[36px] rounded-md border px-2.5 py-1.5 text-sm",
                  it === page
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800",
                ].join(" ")}
                aria-current={it === page ? "page" : undefined}
              >
                {it}
              </button>
            )
          )}

          <button
            disabled={!canNext}
            onClick={() => go(page + 1)}
            className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Next
          </button>
        </div>

        {/* Right: rows-per-page + page info */}
        <div className="flex items-center justify-center gap-3 sm:justify-self-end">
          <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200">
            <span className="whitespace-nowrap">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => changePageSize(Number(e.target.value))}
              className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-800"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div className="text-sm text-neutral-700 dark:text-neutral-200">
            Page{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {Math.max(1, Math.min(page, Math.max(1, totalPages)))}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
