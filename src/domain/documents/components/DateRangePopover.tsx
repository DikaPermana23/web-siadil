"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type DateRange = {
  start?: Date;
  end?: Date;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** dipakai hanya saat variant='popover' */
  anchorEl?: HTMLElement | null;
  value: DateRange;
  onChange: (r: DateRange) => void;
  onClear: () => void;
  title?: string;
  brand?: string;
  /** 'modal' = dialog di tengah; 'popover' = nempel tombol (default) */
  variant?: "modal" | "popover";
};

const DEFAULT_BRAND = "#017938";

/** tipe bantu agar TS menerima CSS variable Tailwind */
type TwVars = React.CSSProperties & { ["--tw-ring-color"]?: string };

export default function DateRangePopover({
  open,
  onClose,
  anchorEl,
  value,
  onChange,
  onClear,
  title = "Select Date Range",
  brand = DEFAULT_BRAND,
  variant = "popover",
}: Props) {
  // local state (pakai string yyyy-mm-dd supaya seragam dengan input[type=date])
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");

  const panelRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<HTMLInputElement | null>(null);

  // sinkronkan saat modal dibuka
  useEffect(() => {
    if (!open) return;
    setStartStr(toInput(value.start));
    setEndStr(toInput(value.end));
    const t = setTimeout(() => startRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [open, value.start, value.end]);

  // kunci body saat modal (bukan popover)
  useEffect(() => {
    if (!open || variant !== "modal") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, variant]);

  // ESC untuk tutup
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // posisi untuk popover
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useLayoutEffect(() => {
    if (!open || variant !== "popover" || !anchorEl) return;
    const update = () => {
      const r = anchorEl.getBoundingClientRect();
      const GAP = 8;
      const panelW = 360;
      const vw = window.innerWidth;
      const left = Math.min(Math.max(8, r.left), Math.max(8, vw - panelW - 8));
      const top = r.bottom + GAP;
      setPos({ top, left });
    };
    update();
    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener("resize", update, opts);
    window.addEventListener("scroll", update, opts);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [open, anchorEl, variant]);

  // boleh apply hanya jika range valid
  const canApply = useMemo(() => {
    if (!startStr || !endStr) return false;
    const s = fromInput(startStr);
    const e = fromInput(endStr);
    if (!s || !e) return false;
    return s.getTime() <= e.getTime();
  }, [startStr, endStr]);

  if (!open) return null;

  const apply = () => {
    if (!canApply) return;
    onChange({ start: fromInput(startStr)!, end: fromInput(endStr)! });
    onClose();
  };

  const clear = () => {
    onClear();
    onClose();
  };

  /* ========= MODAL (centered) ========= */
  if (variant === "modal") {
    const body = (
      <div className="fixed inset-0 z-[120]">
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={onClose} aria-hidden="true" />
        {/* centered card */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-xs text-neutral-500">Pilih rentang tanggal dokumen</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* content */}
            <div className="px-5 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Start</label>
                  <input
                    ref={startRef}
                    type="date"
                    value={startStr}
                    onChange={(e) => setStartStr(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
                    style={{ ["--tw-ring-color"]: brand } as TwVars}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End</label>
                  <input
                    type="date"
                    value={endStr}
                    onChange={(e) => setEndStr(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
                    style={{ ["--tw-ring-color"]: brand } as TwVars}
                  />
                </div>
              </div>

              {/* quick presets */}
              <div className="mt-4 flex flex-wrap gap-2">
                {quickPresets().map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setStartStr(toInput(p.start));
                      setEndStr(toInput(p.end));
                    }}
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-2 border-t border-neutral-200 px-5 py-3 dark:border-neutral-800">
              <button
                type="button"
                onClick={clear}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Clear
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={apply}
                  disabled={!canApply}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: brand }}
                >
                  Apply
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
    return createPortal(body, document.body);
  }

  /* ========= POPOVER (anchored) ========= */
  const pop = (
    <div className="fixed inset-0 z-[120]" onClick={onClose} aria-hidden="true">
      <div
        ref={panelRef}
        role="dialog"
        aria-label={title}
        className="absolute w-[360px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900"
        style={{ top: pos?.top ?? 0, left: pos?.left ?? 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 px-1 text-xs font-semibold text-neutral-500">{title}</div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                ref={startRef}
                type="date"
                value={startStr}
                onChange={(e) => setStartStr(e.target.value)}
                className="h-9 rounded-md border border-neutral-300 px-2 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
                style={{ ["--tw-ring-color"]: brand } as TwVars}
              />
              <input
                type="date"
                value={endStr}
                onChange={(e) => setEndStr(e.target.value)}
                className="h-9 rounded-md border border-neutral-300 px-2 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
                style={{ ["--tw-ring-color"]: brand } as TwVars}
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {quickPresets().map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    setStartStr(toInput(p.start));
                    setEndStr(toInput(p.end));
                  }}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={!canApply}
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: brand }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(pop, document.body);
}

/* ============ utils ============ */
function toInput(d?: Date) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromInput(s?: string) {
  if (!s) return undefined;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? undefined : d;
}
function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}
function quickPresets() {
  const today = new Date();
  const firstThisMonth = startOfMonth(today);
  const lastThisMonth = today; // sampai hari ini
  const firstPrevMonth = startOfMonth(addDays(firstThisMonth, -1));
  const lastPrevMonth = endOfMonth(addDays(firstThisMonth, -1));
  return [
    { key: "7d", label: "Last 7 days", start: addDays(today, -6), end: today },
    { key: "30d", label: "Last 30 days", start: addDays(today, -29), end: today },
    { key: "tm", label: "This month", start: firstThisMonth, end: lastThisMonth },
    { key: "pm", label: "Previous month", start: firstPrevMonth, end: lastPrevMonth },
    { key: "td", label: "Today", start: today, end: today },
  ];
}
