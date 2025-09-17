"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconSearch } from "@/components/common/icons";

const BRAND = "#017938";

type Chip = { key: string; label: string };

const BASE_CHIPS: Chip[] = [
  { key: "archive", label: "Archive" },
  { key: "number", label: "Number" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "docDate", label: "Document Date" },
  { key: "expDate", label: "Document Expire Date" },
  { key: "expIn", label: "Document Expire In" },
  { key: "fileCategory", label: "File Category" },
  { key: "fileDesc", label: "File Description" },
];

// util: hex -> rgba (dipakai untuk ring brand)
function hexToRgba(hex: string, alpha = 0.1) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// tipe bantu agar TS menerima CSS variable Tailwind
type TwVars = React.CSSProperties & { ["--tw-ring-color"]?: string };

export default function DocumentSearchModal({
  open,
  onClose,
  initialQuery = "",
  brand = BRAND,
}: {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
  brand?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [active, setActive] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // fokus + reset query saat buka
  useEffect(() => {
    if (!open) return;
    setQ(initialQuery);
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [open, initialQuery]);

  // kunci body scroll saat modal terbuka
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggleChip = (key: string) =>
    setActive((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });

  // TODO: sambungkan ke API pencarianmu
  const results: Array<{ id: string; title: string; sub?: string }> = [];

  const body = (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered Dialog */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center p-2 sm:p-4">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-search-title"
          className="
            pointer-events-auto w-full max-w-6xl overflow-hidden rounded-2xl
            bg-white shadow-2xl ring-1 ring-black/10 dark:bg-neutral-900
            max-h-[86vh] flex flex-col
          "
          ref={dialogRef}
        >
          {/* Header: search + chips */}
          <div className="sticky top-0 z-10 border-b border-neutral-200/80 bg-white/85 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="relative w-full">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search documents, numbers, titles…"
                  className="
                    h-11 w-full rounded-lg border border-neutral-200 pl-10 pr-12 text-[15px]
                    outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900
                  "
                  // Gunakan CSS var Tailwind utk ring color (fix TS)
                  style={{ ["--tw-ring-color"]: hexToRgba(brand, 0.28) } as TwVars}
                />
                {/* Close */}
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8
                    items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800
                  "
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chips */}
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
              {BASE_CHIPS.map((c) => {
                const selected = active.has(c.key);
                return (
                  <button
                    key={c.key}
                    onClick={() => toggleChip(c.key)}
                    className={[
                      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                      selected
                        ? "border-transparent"
                        : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700/60",
                    ].join(" ")}
                    style={
                      selected
                        ? {
                            borderColor: brand,
                            color: brand,
                            backgroundColor: hexToRgba(brand, 0.12),
                          }
                        : undefined
                    }
                  >
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border"
                      style={{
                        borderColor: selected ? brand : "#d1d5db",
                        color: selected ? brand : "#6b7280",
                        backgroundColor: selected ? hexToRgba(brand, 0.08) : "transparent",
                      }}
                    >
                      {selected ? (
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
                          <path d="M5 10l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
                          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {results.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                  >
                    <div className="font-semibold">{r.title}</div>
                    {r.sub && <div className="mt-1 text-sm text-neutral-500">{r.sub}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  return createPortal(body, document.body);
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="grid place-items-center rounded-full border border-neutral-200 p-6 text-neutral-400 dark:border-neutral-800">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
          <path d="M7 3h10a2 2 0 012 2v14l-5-3-5 3V5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
      <p className="mt-1 text-sm text-neutral-500">Try different keywords or adjust filters</p>
    </div>
  );
}
