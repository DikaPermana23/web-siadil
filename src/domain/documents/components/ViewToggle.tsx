// src/domain/documents/components/ViewToggle.tsx
"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";

export type ViewMode = "list" | "grid";
type Size = "sm" | "md" | "lg";

const BRAND = "#017938";
type TwVars = React.CSSProperties & {
  ["--brand"]?: string;
  ["--brand-ghost"]?: string;
  ["--brand-ring"]?: string;
};

export default function ViewToggle({
  initialMode = "list",
  size = "md",
  onChange,
  className = "",
}: {
  initialMode?: ViewMode;
  size?: Size;
  onChange?: (m: ViewMode) => void;
  className?: string;
}) {
  const [mode, setMode] = useState<ViewMode>(initialMode);

  // restore pref
  useEffect(() => {
    try {
      const saved = localStorage.getItem("doc_view_mode") as ViewMode | null;
      if (saved === "list" || saved === "grid") setMode(saved);
    } catch {}
  }, []);

  // persist & notify
  useEffect(() => {
    try {
      localStorage.setItem("doc_view_mode", mode);
    } catch {}
    onChange?.(mode);
  }, [mode, onChange]);

  // keyboard (← →)
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setMode((m) => (m === "list" ? "grid" : "list"));
    }
  }, []);

  // ukuran (ikon pakai nilai Tailwind valid)
  const cfg = {
    sm: { px: "px-2.5", py: "py-1.5", icon: "h-4 w-4", thumbPad: "p-1" },
    md: { px: "px-3.5", py: "py-2",   icon: "h-[18px] w-[18px]", thumbPad: "p-1" },
    lg: { px: "px-4",   py: "py-2.5", icon: "h-5 w-5", thumbPad: "p-1.5" },
  }[size];

  const baseBtn = `relative z-10 flex items-center justify-center ${cfg.px} ${cfg.py}
    rounded-full transition-colors duration-200`;

  const vars: TwVars = {
    "--brand": BRAND,
    "--brand-ring": `${BRAND}66`,
    "--brand-ghost": "rgba(1,121,56,.10)",
  };

  return (
    <div
      role="tablist"
      aria-label="View mode"
      onKeyDown={onKeyDown}
      className={`relative inline-grid w-max grid-cols-2 items-center overflow-hidden rounded-full
        border border-neutral-300 bg-white shadow-sm
        dark:border-neutral-700 dark:bg-neutral-800 ${className}`}
      style={vars}
    >
      {/* Thumb (background highlight) */}
      <div className={`pointer-events-none absolute inset-0 ${cfg.thumbPad}`}>
        <div
          className="h-full w-1/2 rounded-full bg-[var(--brand-ghost)]
            shadow-[inset_0_0_0_1px_rgba(1,121,56,.22)]
            transition-transform duration-200 will-change-transform"
          style={{ transform: mode === "grid" ? "translateX(100%)" : "translateX(0%)" }}
        />
      </div>

      {/* List (ikon saja) */}
      <button
        id="view-list"
        role="tab"
        aria-controls="panel-list"
        aria-selected={mode === "list"}
        aria-label="List view"
        title="List view"
        onClick={() => setMode("list")}
        className={`${baseBtn} ${mode === "list" ? "text-[var(--brand)]" : "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"}`}
      >
        <IconListMini className={cfg.icon} />
        <span className="sr-only">List view</span>
      </button>

      {/* Grid (ikon saja) */}
      <button
        id="view-grid"
        role="tab"
        aria-controls="panel-grid"
        aria-selected={mode === "grid"}
        aria-label="Card view"
        title="Card view"
        onClick={() => setMode("grid")}
        className={`${baseBtn} ${mode === "grid" ? "text-[var(--brand)]" : "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"}`}
      >
        <IconGridMini className={cfg.icon} />
        <span className="sr-only">Card view</span>
      </button>

      {/* Focus ring outline */}
      <style jsx>{`
        [role="tab"]:focus-visible {
          outline: 2px solid var(--brand-ring);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

/* ===== Mini Icons ===== */
function IconListMini(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M8 7h11M8 12h11M8 17h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4.5" cy="7" r="1.5" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="4.5" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconGridMini(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
