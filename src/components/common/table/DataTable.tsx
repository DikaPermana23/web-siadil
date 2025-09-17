import type { ReactNode } from "react";
import ColumnHeader from "./ColumnHeader";

export type Column<T extends Record<string, unknown>> = {
  key: keyof T;                         // field yang di-render
  header: ReactNode;                    // judul kolom
  render?: (row: T, index: number) => ReactNode;
  sortKey?: string;                     // nama field utk sorting via URL (?sort=field:asc)
  className?: string;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
}: {
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-auto border rounded-xl">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="text-left px-3 py-2 whitespace-nowrap">
                {c.sortKey ? (
                  <ColumnHeader field={c.sortKey}>{c.header}</ColumnHeader>
                ) : (
                  c.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-6 text-center text-neutral-500" colSpan={columns.length}>
                No data
              </td>
            </tr>
          ) : (
            rows.map((row, r) => (
              <tr key={r} className="border-t">
                {columns.map((c, i) => {
                  let content: ReactNode;

                  if (c.render) {
                    // render kustom selalu ReactNode
                    content = c.render(row, r);
                  } else {
                    // fallback: ambil nilai dari row dan konversi ke ReactNode
                    const raw = row[c.key];
                    if (raw === null || raw === undefined) content = "";
                    else if (typeof raw === "string" || typeof raw === "number") content = raw;
                    else if (Array.isArray(raw)) content = raw.map(String).join(", ");
                    else content = String(raw);
                  }

                  return (
                    <td key={i} className={`px-3 py-2 ${c.className ?? ""}`}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
