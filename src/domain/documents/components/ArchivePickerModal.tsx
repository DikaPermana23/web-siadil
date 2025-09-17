// src/domain/documents/components/ArchivePickerModal.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconSearch } from "@/components/common/icons";
import type { ArchiveOption } from "../../documents/model/types";

type TwVars = React.CSSProperties & { ["--tw-ring-color"]?: string };

export default function ArchivePickerModal({
  open,
  onClose,
  items,
  selected,
  onApply,
  brand = "#017938",
}: {
  open: boolean;
  onClose: () => void;
  items: ArchiveOption[];
  selected: Set<string>;
  onApply: (ids: Set<string>, selectAll: boolean) => void;
  brand?: string;
}) {
  const [q, setQ] = useState("");
  const [local, setLocal] = useState<Set<string>>(new Set(selected));
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sinkron pilihan lokal saat props berubah
  useEffect(() => setLocal(new Set(selected)), [selected]);

  // Body scroll lock saat modal tampil
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC & click-away
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) =>
      `${it.id} ${it.name} ${it.alias ?? ""} ${it.slug ?? ""}`.toLowerCase().includes(s),
    );
  }, [q, items]);

  const allChecked = local.size === items.length && items.length > 0;
  const someChecked = local.size > 0 && !allChecked;

  const toggleAll = () => {
    if (allChecked) setLocal(new Set());
    else setLocal(new Set(items.map((i) => String(i.id))));
  };

  const toggleOne = (id: string | number) => {
    const key = String(id);
    const next = new Set(local);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setLocal(next);
  };

  const apply = () => onApply(local, local.size === items.length);
  const clear = () => setLocal(new Set());

  if (!open) return null;

  const body = (
    <div className="fixed inset-0 z-[1000]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" aria-hidden="true" />

      {/* Centered dialog (di LUAR card, via portal) */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center p-3 sm:p-4">
        <section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Pilih Arsip"
          className="
            pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl
            bg-white/95 shadow-2xl ring-1 ring-black/10 dark:bg-neutral-900/95
            flex max-h-[82vh] flex-col
          "
        >
          {/* Header sticky: search + select all */}
          <div className="sticky top-0 z-10 border-b border-neutral-200/80 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-neutral-800/70 dark:bg-neutral-900/90">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari archive…"
                  className="h-11 w-full rounded-lg border border-neutral-300 pl-9 pr-3 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
                  style={{ ["--tw-ring-color"]: brand } as TwVars}
                />
              </div>
              <button
                onClick={toggleAll}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                {allChecked ? "Unselect All" : "Select All"}
              </button>
            </div>
          </div>

          {/* List */}
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
            {filtered.map((a) => {
              const checked = local.has(String(a.id));
              return (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-neutral-50 focus-within:ring-2 dark:hover:bg-neutral-800"
                  style={{ ["--tw-ring-color"]: brand } as TwVars}
                >
                  {/* Custom checkbox */}
                  <span
                    className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border"
                    style={{
                      borderColor: checked ? brand : "#d1d5db",
                      backgroundColor: checked ? hexToRgba(brand, 0.12) : "transparent",
                      color: checked ? brand : "#6b7280",
                    }}
                  >
                    {checked ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                        <path
                          d="M5 13l4 4 10-10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>

                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleOne(a.id)}
                  />

                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
                      (ID#{a.id}) {a.name}
                      {a.alias ? ` (${a.alias})` : ""}
                    </div>
                  </div>
                </label>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-neutral-500">Tidak ada hasil.</div>
            )}
          </div>

          {/* Footer sticky */}
          <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-neutral-200/80 bg-white/90 px-4 py-3 text-sm backdrop-blur-md dark:border-neutral-800/70 dark:bg-neutral-900/90">
            <div className="text-xs text-neutral-500">
              {local.size}/{items.length} selected
              {someChecked && (
                <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] dark:bg-neutral-800">
                  partial
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clear}
                className="rounded-lg border border-neutral-300 px-3 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Clear
              </button>
              <button
                onClick={apply}
                style={{ backgroundColor: brand }}
                className="rounded-lg px-4 py-2 font-semibold text-white hover:brightness-110"
              >
                Apply
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-neutral-300 px-3 py-2 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  // ⬅️ INI KUNCI UTAMANYA
  return createPortal(body, document.body);
}

/* helpers */
function hexToRgba(hex: string, alpha = 0.12) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
