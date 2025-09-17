// src/domain/documents/components/DocumentTable.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DataTable, { type Column } from "@/components/common/table/DataTable";
import Pagination from "@/components/common/table/Pagination";
import type { DocumentItem, ListMeta } from "../model/types";
import RowActions from "./RowActions";

/* ========== Icons ========== */
const IconSort = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M8 9l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 15l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAsc = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M7 17V4M7 4l-3 3M7 4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17h8M12 13h5M12 9h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconDesc = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M7 7v13M7 20l-3-3M7 20l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7h8M12 11h5M12 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconHide = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10.6 6.2A9.8 9.8 0 0121 12c-1.3 2.4-4.8 6-9 6-1.1 0-2.1-.2-3-.6M5 8.3A10.7 10.7 0 003 12c1.3 2.4 4.8 6 9 6 1 0 1.9-.1 2.7-.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

/* ========== Sorting helpers (tanpa instanceof) ========== */
type SortDir = "asc" | "desc";
type SortableKey = "id" | "title" | "documentDate" | "archiveName" | "updatedBy";
type SortState = { key?: SortableKey; dir: SortDir };
type SortableValue = DocumentItem[SortableKey];

function norm(v: SortableValue): number | string {
  if (v == null) return "";
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const t = Date.parse(v);
    return Number.isNaN(t) ? v.toLowerCase() : t;
  }
  const maybe = v as unknown;
  if (
    typeof maybe === "object" &&
    maybe !== null &&
    "getTime" in (maybe as Record<string, unknown>) &&
    typeof (maybe as { getTime: unknown }).getTime === "function"
  ) {
    return (maybe as unknown as Date).getTime();
  }
  return String(v).toLowerCase();
}
function cmp(a: SortableValue, b: SortableValue, dir: SortDir) {
  const na = norm(a), nb = norm(b);
  if (na < nb) return dir === "asc" ? -1 : 1;
  if (na > nb) return dir === "asc" ? 1 : -1;
  return 0;
}

/* ========== Header (ikon + trigger) ========== */
function SortHeader({
  label,
  colKey,
  disabled,
  currentSort,
  onOpenMenu,
}: {
  label: string;
  colKey: SortableKey | string;
  disabled?: boolean;
  currentSort: SortState;
  onOpenMenu: (k: string, anchorEl: HTMLElement) => void;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const isThis = currentSort.key === colKey;
  const isDesc = isThis && currentSort.dir === "desc";

  // pilih ikon sesuai status: asc/desc/netral
  const Icon = !isThis ? IconSort : isDesc ? IconDesc : IconAsc;

  const iconClasses = [
    "h-[18px] w-[18px] transition-transform",
    isThis ? "text-emerald-600" : "text-neutral-500",
  ].join(" ");

  const title = !isThis ? "Sort options" : isDesc ? "Sorted: Desc" : "Sorted: Asc";

  return (
    <div className="relative inline-flex items-center gap-1">
      <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200">
        {label}
      </span>
      {!disabled && (
        <button
          ref={btnRef}
          type="button"
          onClick={() => {
            if (!btnRef.current) return;
            onOpenMenu(String(colKey), btnRef.current);
          }}
          className="ml-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:hover:bg-neutral-700"
          aria-haspopup="menu"
          title={title}
          data-sort-trigger="true"
        >
          <Icon className={iconClasses} />
        </button>
      )}
    </div>
  );
}

/* ========== Main ========== */
type Placement = "auto" | "bottom" | "top" | "right" | "left";

export default function DocumentTable({
  items,
  meta,
  menuPlacement = "auto",
}: {
  items: DocumentItem[];
  meta: ListMeta;
  menuPlacement?: Placement;
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortState>({ key: undefined, dir: "asc" });

  // === Single global menu (portal to body)
  const [menu, setMenu] = useState<{
    open: boolean;
    col?: string;
    anchor?: HTMLElement | null;
    top: number;
    left: number;
  }>({ open: false, col: undefined, anchor: undefined, top: 0, left: 0 });

  const computeMenuPos = useCallback((anchor: HTMLElement, pref: Placement) => {
    const r = anchor.getBoundingClientRect();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const menuW = 160;
    const menuH = 120;
    const pad = 6;

    const order: Placement[] =
      pref === "auto" ? ["bottom", "top", "right", "left"] : [pref, "bottom", "top", "right", "left"];

    for (const place of order) {
      if (place === "bottom" && H - r.bottom > menuH + pad) {
        return { top: r.bottom + pad, left: Math.max(8, Math.min(W - menuW - 8, r.right - menuW)) };
      }
      if (place === "top" && r.top > menuH + pad) {
        return { top: r.top - menuH - pad, left: Math.max(8, Math.min(W - menuW - 8, r.right - menuW)) };
      }
      if (place === "right" && W - r.right > menuW + pad) {
        return { top: Math.max(8, r.top), left: r.right + pad };
      }
      if (place === "left" && r.left > menuW + pad) {
        return { top: Math.max(8, r.top), left: r.left - menuW - pad };
      }
    }
    return { top: r.bottom + pad, left: Math.max(8, Math.min(W - menuW - 8, r.right - menuW)) };
  }, []);

  const openMenu = useCallback(
    (col: string, anchorEl: HTMLElement) => {
      setMenu((m) => {
        // toggle kalau klik ikon yg sama
        if (m.open && m.anchor === anchorEl) return { ...m, open: false };
        const pos = computeMenuPos(anchorEl, menuPlacement);
        return { open: true, col, anchor: anchorEl, top: pos.top, left: pos.left };
      });
    },
    [computeMenuPos, menuPlacement]
  );

  const closeMenu = useCallback(() => setMenu((m) => ({ ...m, open: false })), []);

  // Reposition saat scroll/resize
  useEffect(() => {
    if (!menu.open || !menu.anchor) return;
    const onMove = () => {
      const pos = computeMenuPos(menu.anchor as HTMLElement, menuPlacement);
      setMenu((m) => ({ ...m, top: pos.top, left: pos.left }));
    };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [menu.open, menu.anchor, computeMenuPos, menuPlacement]);

  // Click-away & Esc
  useEffect(() => {
    if (!menu.open) return;
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.('[role="menu"]')) return;
      if (el?.closest?.('[data-sort-trigger="true"]')) return;
      closeMenu();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu.open, closeMenu]);

  // Actions
  const onAsc = useCallback((k: SortableKey) => { setSort({ key: k, dir: "asc" }); closeMenu(); }, [closeMenu]);
  const onDesc = useCallback((k: SortableKey) => { setSort({ key: k, dir: "desc" }); closeMenu(); }, [closeMenu]);
  const onHide = useCallback((k: string) => {
    setHidden((prev) => { const next = new Set(prev); next.add(k); return next; });
    closeMenu();
  }, [closeMenu]);

  const resetHidden = useCallback(() => setHidden(new Set()), []);

  // Columns (header custom)
  const columns = useMemo<Column<DocumentItem>[]>(() => {
    const H = (text: string, key: SortableKey | string, disabled?: boolean) => (
      <SortHeader label={text} colKey={key} disabled={disabled} currentSort={sort} onOpenMenu={openMenu} />
    );
    return [
      { key: "id", header: H("ID", "id"), className: "w-20" },
      {
        key: "title",
        header: H("Number & Title", "title"),
        render: (r) => (
          <div>
            <div className="font-semibold">
              {r.number} — {r.title}
            </div>
            {r.description && <div className="text-xs text-neutral-500">{r.description}</div>}
          </div>
        ),
        className: "min-w-[280px]",
      },
      { key: "documentDate", header: H("Document Date", "documentDate"), className: "w-44" },
      { key: "contributors", header: H("Contributors", "contributors", true), render: (r) => r.contributors?.join(", ") ?? "-", className: "min-w-[180px]" },
      { key: "archiveName", header: H("Archive", "archiveName"), className: "w-48" },
      { key: "updatedBy", header: H("Update & Create by", "updatedBy"), className: "w-56" },
      { key: "id", header: H("Actions", "actions", true), render: () => <RowActions />, className: "w-32" },
    ];
  }, [openMenu, sort]);

  // Hide kolom
  const visibleColumns = useMemo(
    () => columns.filter((c) => !hidden.has(String(c.key))),
    [columns, hidden]
  );

  // Sort client-side
  const sortedRows = useMemo(() => {
    if (!sort.key) return items;
    return [...items].sort((a, b) => cmp(a[sort.key!], b[sort.key!], sort.dir));
  }, [items, sort]);

  return (
    <div className="space-y-3">
      {hidden.size > 0 && (
        <div className="flex items-center justify-end">
          <button
            onClick={resetHidden}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            title="Show all hidden columns"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {hidden.size} column{hidden.size > 1 ? "s" : ""} hidden — Reset
          </button>
        </div>
      )}

      {/* Table */}
      <div
        className={[
          "[&_tr]:transition-none",
          "[&_tr:hover]:translate-y-0",
          "[&_tr:hover]:shadow-none",
          "[&_tbody_tr:hover]:bg-neutral-50",
          "dark:[&_tbody_tr:hover]:bg-neutral-800/50",
          "[&_thead_th>svg]:hidden", // sembunyikan caret default, kita pakai ikon sendiri
        ].join(" ")}
      >
        <DataTable<DocumentItem> columns={visibleColumns} rows={sortedRows} />
      </div>

      {/* Global anchored menu via portal */}
      {menu.open && menu.col &&
        createPortal(
          (() => {
            const col = menu.col as string;
            return (
              <div
                role="menu"
                className="fixed z-[9999] w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
                style={{ top: menu.top, left: menu.left }}
              >
                <button
                  onClick={() => onAsc(col as SortableKey)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-neutral-800 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  <IconAsc className="h-4 w-4" /> Asc
                </button>
                <button
                  onClick={() => onDesc(col as SortableKey)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-neutral-800 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  <IconDesc className="h-4 w-4" /> Desc
                </button>
                <div className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                <button
                  onClick={() => onHide(col)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-neutral-800 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  <IconHide className="h-4 w-4" /> Hide
                </button>
              </div>
            );
          })(),
          document.body
        )
      }

      <Pagination page={meta.page} totalPages={meta.totalPages} />
    </div>
  );
}
