// src/app/(app)/siadil/DocToolbar.client.tsx
"use client";

import { useCallback, useMemo } from "react"; // Tambahkan useMemo untuk potensi penggunaan di masa depan atau hapus jika tidak perlu
import SearchDocument from "@/components/common/search/SearchDocument";
import AddDocumentButton from "@/domain/documents/components/AddDocumentButton";
import type { ArchiveOption } from "@/domain/documents/model/types";

type Props = {
  /** daftar archive boleh undefined, kita default-kan [] */
  archives?: ArchiveOption[];
  /** opsional: kalau mau menangkap hasil simpan dari luar */
  onSaved?: (payload: unknown) => void;
};

export default function DocToolbar({ archives = [], onSaved }: Props) {
  const handleSaved = useCallback(
    (payload: unknown) => {
      // TODO: refresh data, tampilkan toast, dsb.
      console.log("Saved document:", payload);
      onSaved?.(payload);
    },
    [onSaved]
  );

  // Transformasi data untuk memastikan tidak ada nilai `null` pada properti `alias`
  const transformedArchives = useMemo(
    () =>
      archives.map((archive) => ({
        ...archive,
        // Ubah nilai null menjadi undefined, nilai selain itu tetap
        alias: archive.alias ?? undefined,
      })),
    [archives]
  );

  return (
    <div className="flex items-center gap-2">
      <SearchDocument />
      {/* Gunakan data yang sudah di-transformasi */}
      <AddDocumentButton archives={transformedArchives} onSaved={handleSaved} />
    </div>
  );
}