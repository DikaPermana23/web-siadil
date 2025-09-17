"use client";

import { useState } from "react";
import { IconPlusCircle } from "@/components/common/icons";
import AddDocumentModal, {
  type ArchiveOption,
  type AddDocumentPayload,
} from "./AddDocumentModal";

const BRAND = "#017938";

export default function AddDocumentButton({
  archives = [],
  onSaved,
  /** kelas tambahan untuk mengatur posisi/ukuran/spacing dari parent */
  className = "",
  /** jika parent-nya flex row dan ingin tombol nempel kanan */
  pushRight = false,
}: {
  archives?: ArchiveOption[];
  onSaved?: (payload: AddDocumentPayload) => void;
  className?: string;
  pushRight?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={[
          "inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white shadow-sm hover:brightness-110",
          pushRight ? "ml-auto" : "",
          className,
        ].join(" ")}
        style={{ background: BRAND }}
      >
        <IconPlusCircle className="h-4 w-4" />
        Add New Document
      </button>

      <AddDocumentModal
        open={open}
        onClose={() => setOpen(false)}
        archives={archives}
        onSave={(payload) => {
          onSaved?.(payload);
          setOpen(false);
          console.log("Saved payload:", payload);
        }}
        brand={BRAND}
      />
    </>
  );
}
