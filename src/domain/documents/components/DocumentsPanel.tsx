"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CardShell from "@/components/common/cards/CardShell";
import FilterChips from "./FilterChips";
import DocumentTable from "./DocumentTable";
import DocumentCardGrid from "./DocumentCardGrid";
import ViewToggle, { type ViewMode } from "./ViewToggle";
import AddDocumentButton from "./AddDocumentButton";
import SearchDocument from "@/components/common/search/SearchDocument";

import type {
  ArchiveOption as ModelArchiveOption,
  DocumentItem,
  ListMeta,
} from "@/domain/documents/model/types";
import type { ArchiveOption as ModalArchiveOption } from "./AddDocumentModal";
import type { AddDocumentPayload } from "./AddDocumentModal";

// Tipe properti "items" milik DocumentCardGrid
type GridItems = React.ComponentProps<typeof DocumentCardGrid>["items"];

export default function DocumentsPanel({
  items,
  meta,
  emptyHint = "Tidak ada data.",
  archives = [],
  onAddSaved,
}: {
  items: DocumentItem[];
  meta?: ListMeta;
  emptyHint?: string;
  archives?: ModelArchiveOption[];
  onAddSaved?: (payload: AddDocumentPayload) => void;
}) {
  const [mode, setMode] = useState<ViewMode>("list");
  const params = useSearchParams();

  // Baca perPage dari URL agar Pagination sinkron (perPage | limit | pageSize)
  const perPageFromUrl = useMemo(() => {
    const raw =
      params.get("perPage") ?? params.get("limit") ?? params.get("pageSize") ?? "10";
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 10;
  }, [params]);

  // Samakan tipe untuk AddDocumentModal/Button
  const uiArchives: ModalArchiveOption[] = useMemo(
    () =>
      (archives ?? []).map((a) => ({
        id: a.id,
        name: a.name,
        alias: a.alias ?? undefined,
      })),
    [archives]
  );

  // Mapping ke bentuk grid
  const gridItems: GridItems = useMemo(
    () =>
      items.map((d) => ({
        id: d.id,
        title: d.title,
        subtitle: d.number,
        description: d.description,
        archiveName: d.archiveName,
        updatedBy: d.updatedBy,
      })),
    [items]
  );

  // Pastikan meta selalu ada
  const safeMeta: ListMeta = useMemo(
    () => ({
      page: meta?.page ?? 1,
      totalPages: meta?.totalPages ?? 1,
      totalItems: meta?.totalItems ?? items.length,
      // NOTE: ListMeta tidak punya perPage, jadi jangan tambahkan field lain di sini
    }),
    [meta, items.length]
  );

  return (
    <div className="space-y-3">
      {/* Top bar */}
      <div className="flex items-center gap-2">
        <div className="ml-auto flex items-center gap-2">
          <SearchDocument />
          <AddDocumentButton archives={uiArchives} onSaved={onAddSaved} />
          <ViewToggle initialMode={mode} onChange={setMode} />
        </div>
      </div>

      {/* Card: filter + tabel/grid */}
      <CardShell>
        <div className="p-3">
          <FilterChips archives={archives} onApply={() => {}} />

          <div className="mt-3">
            {mode === "list" ? (
              <DocumentTable
                items={items}
                meta={safeMeta}
                // Jika DocumentTable butuh default page size, kamu bisa
                // teruskan via prop opsional (tambahkan di DocumentTable).
                // Untuk sekarang, Pagination membaca perPage dari URL,
                // jadi cukup seperti ini.
                // defaultPerPage={perPageFromUrl}
              />
            ) : (
              <DocumentCardGrid items={gridItems} />
            )}
          </div>

          {(!Array.isArray(items) || items.length === 0) && (
            <div className="mt-6 rounded-xl border border-dashed p-6 text-center text-sm text-neutral-500">
              {emptyHint}
            </div>
          )}
        </div>
      </CardShell>
    </div>
  );
}
