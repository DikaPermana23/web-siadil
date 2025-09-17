"use client";

import { useEffect, useState } from "react";
import { IconSearch } from "@/components/common/icons";
import DocumentSearchModal from "./DocumentSearchModal";

export default function SearchDocument() {
  const [open, setOpen] = useState(false);

  // shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mac = navigator.platform.toUpperCase().includes("MAC");
      const meta = mac ? e.metaKey : e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Tombol seperti input (supaya konsisten dengan layout toolbar) */}
      <button
        onClick={() => setOpen(true)}
        className="
          relative h-9 w-[220px] rounded-lg border border-neutral-200 bg-white pl-9 pr-16 text-left text-sm
          hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-200
          dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700
        "
        aria-label="Open document search"
      >
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <span className="text-neutral-500">Search Document</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none rounded border border-neutral-200 bg-neutral-50 px-1.5 text-[10px] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
          ⌘K
        </kbd>
      </button>

      <DocumentSearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
