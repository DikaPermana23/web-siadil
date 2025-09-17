// src/domain/documents/components/FilterChips.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import {
  IconFilter, IconPlusCircle, IconCalendar, IconDownload, IconSliders, IconTimer
} from "@/components/common/icons";
import ArchivePickerModal from "./ArchivePickerModal";
import DateRangePopover, { DateRange } from "./DateRangePopover";
import ExpireInPopover, { makeDefaultExpireInOptions } from "./ExpireInPopover";
import ExportPopover, { type ExportFormat } from "./ExportPopover";
import ViewColumnsPopover, { type ColumnOption } from "./ViewColumnsPopover"; // ⬅️ NEW
import type { ArchiveOption } from "../../documents/model/types";


const BRAND = "#017938";

type ChipProps = { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean; suffix?: React.ReactNode; };

function Chip({ icon, label, onClick, active, suffix }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
        "dark:border-neutral-700 dark:hover:bg-neutral-800",
        active ? "border-emerald-600 bg-emerald-50/60 text-emerald-700" : "hover:bg-neutral-50",
      ].join(" ")}
    >
      <span className="text-neutral-600 dark:text-neutral-300">{icon}</span>
      <span>{label}</span>
      {suffix}
    </button>
  );
}

export default function FilterChips({
  archives = [],
  initialSelectedArchiveIds = [],
  onApply,
  onExport,                 // opsional
  onColumnsChange,          // ⬅️ NEW (opsional)
}: {
  archives?: ArchiveOption[];
  initialSelectedArchiveIds?: Array<string | number>;
  onApply?: (filters: { archiveIds: Array<string | number>; selectAll: boolean }) => void;
  onExport?: (fmt: ExportFormat) => void;
  onColumnsChange?: (keys: string[]) => void; // ⬅️ NEW
}) {
  // ARCHIVE
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedArchiveIds.map(String)));

  // DATE RANGE (Document/Expire)
  const [docDateOpen, setDocDateOpen] = useState(false);
  const [expDateOpen, setExpDateOpen] = useState(false);
  const [docDate, setDocDate] = useState<DateRange>({});
  const [expDate, setExpDate] = useState<DateRange>({});
  const docBtnRef = useRef<HTMLButtonElement | null>(null);
  const expBtnRef = useRef<HTMLButtonElement | null>(null);

  // EXPIRE IN
  const [expireInOpen, setExpireInOpen] = useState(false);
  const [expireInIds, setExpireInIds] = useState<Set<string>>(new Set());
  const expireInBtnRef = useRef<HTMLButtonElement | null>(null);
  const expireInOptions = makeDefaultExpireInOptions();

  // EXPORT
  const [exportOpen, setExportOpen] = useState(false);
  const exportBtnRef = useRef<HTMLButtonElement | null>(null);

  // VIEW (toggle columns) ⬇️
  const [viewOpen, setViewOpen] = useState(false);                       // ⬅️ NEW
  const viewBtnRef = useRef<HTMLButtonElement | null>(null);             // ⬅️ NEW
  const columnOptions: ColumnOption[] = [                                // ⬅️ NEW
    { key: "title",        label: "Title" },
    { key: "description",  label: "Description" },
    { key: "docDate",      label: "Document Date" },
    { key: "contributors", label: "Contributors" },
    { key: "archive",      label: "Archive" },
    { key: "updated",      label: "Last Updated" },
  ];
  const [visibleCols, setVisibleCols] = useState<Set<string>>(           // ⬅️ NEW
    new Set(columnOptions.map(c => c.key))
  );
  const applyCols = (next: Set<string>) => {                             // ⬅️ NEW
    setVisibleCols(new Set(next));
    onColumnsChange?.(Array.from(next));
  };

  /* ---------- Archive summary ---------- */
  const summaryArchive = useMemo(() => {
    if (selectedIds.size === 0) return "";
    if (selectedIds.size === archives.length && archives.length > 0) return "All";
    if (selectedIds.size === 1) {
      const onlyId = Array.from(selectedIds)[0];
      const found = archives.find((a) => String(a.id) === onlyId);
      return found ? (found.alias || found.name) : "1";
    }
    return String(selectedIds.size);
  }, [selectedIds, archives]);

  const handleApplyArchive = (ids: Set<string>, selectAll: boolean) => {
    setSelectedIds(new Set(ids));
    const idList = selectAll ? archives.map((a) => a.id) : Array.from(ids);
    onApply?.({ archiveIds: idList, selectAll });
  };

  /* ---------- Helpers ---------- */
  const fmtRange = (r: DateRange) => (r.start && r.end ? `${fmt(r.start)}–${fmt(r.end)}` : "");
  const expireInSummary = useMemo(() => {
    if (expireInIds.size === 0) return "";
    if (expireInIds.size === 1) {
      const id = Array.from(expireInIds)[0];
      const opt = expireInOptions.find(o => o.id === id);
      if (!opt) return "1";
      const unitShort = opt.unit === "month" ? "M" : opt.unit === "week" ? "W" : "D";
      return `In ${opt.amount}${unitShort}`;
    }
    return String(expireInIds.size);
  }, [expireInIds, expireInOptions]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Chip icon={<IconFilter />} label="Filter document.." />

        {/* Archive */}
        <Chip
          icon={<IconPlusCircle />}
          label="Archive"
          active={selectedIds.size > 0}
          onClick={() => { setArchiveOpen(true); setDocDateOpen(false); setExpDateOpen(false); setExpireInOpen(false); setExportOpen(false); setViewOpen(false); }}
          suffix={summaryArchive ? <Badge>{summaryArchive}</Badge> : null}
        />

        {/* Document Date */}
        <button
          ref={docBtnRef}
          onClick={() => { setDocDateOpen(v => !v); setExpDateOpen(false); setArchiveOpen(false); setExpireInOpen(false); setExportOpen(false); setViewOpen(false); }}
          className={[
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
            "dark:border-neutral-700 dark:hover:bg-neutral-800",
            docDate.start && docDate.end ? "border-emerald-600 bg-emerald-50/60 text-emerald-700" : "hover:bg-neutral-50",
          ].join(" ")}
        >
          <span className="text-neutral-600 dark:text-neutral-300"><IconCalendar /></span>
          <span>Document Date</span>
          {fmtRange(docDate) && (
            <Badge withClose onClose={(e) => { e.stopPropagation(); setDocDate({}); }}>
              {fmtRange(docDate)}
            </Badge>
          )}
        </button>

        {/* Expire Date */}
        <button
          ref={expBtnRef}
          onClick={() => { setExpDateOpen(v => !v); setDocDateOpen(false); setArchiveOpen(false); setExpireInOpen(false); setExportOpen(false); setViewOpen(false); }}
          className={[
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
            "dark:border-neutral-700 dark:hover:bg-neutral-800",
            expDate.start && expDate.end ? "border-emerald-600 bg-emerald-50/60 text-emerald-700" : "hover:bg-neutral-50",
          ].join(" ")}
        >
          <span className="text-neutral-600 dark:text-neutral-300"><IconCalendar /></span>
          <span>Expire Date</span>
          {fmtRange(expDate) && (
            <Badge withClose onClose={(e) => { e.stopPropagation(); setExpDate({}); }}>
              {fmtRange(expDate)}
            </Badge>
          )}
        </button>

        {/* Expire In */}
        <button
          ref={expireInBtnRef}
          onClick={() => { setExpireInOpen(v => !v); setDocDateOpen(false); setExpDateOpen(false); setArchiveOpen(false); setExportOpen(false); setViewOpen(false); }}
          className={[
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
            "dark:border-neutral-700 dark:hover:bg-neutral-800",
            expireInIds.size > 0 ? "border-emerald-600 bg-emerald-50/60 text-emerald-700" : "hover:bg-neutral-50",
          ].join(" ")}
        >
          <span className="text-neutral-600 dark:text-neutral-300"><IconTimer /></span>
          <span>Expire In</span>
          {expireInSummary && (
            <Badge withClose onClose={(e) => { e.stopPropagation(); setExpireInIds(new Set()); }}>
              {expireInSummary}
            </Badge>
          )}
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* Export button → Popover */}
          <button
            ref={exportBtnRef}
            onClick={() => {
              setExportOpen(v => !v);
              setArchiveOpen(false); setDocDateOpen(false); setExpDateOpen(false); setExpireInOpen(false); setViewOpen(false);
            }}
            className={[
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
              "hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800",
            ].join(" ")}
          >
            <span className="text-neutral-600 dark:text-neutral-300"><IconDownload /></span>
            <span>Export</span>
          </button>

          {/* View button → Popover (toggle columns) */}
          <button
            ref={viewBtnRef}
            onClick={() => {
              setViewOpen(v => !v);
              setArchiveOpen(false); setDocDateOpen(false); setExpDateOpen(false); setExpireInOpen(false); setExportOpen(false);
            }}
            className={[
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
              "hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800",
            ].join(" ")}
          >
            <span className="text-neutral-600 dark:text-neutral-300"><IconSliders /></span>
            <span>View</span>
          </button>
        </div>
      </div>

      {/* Popups */}
      <ArchivePickerModal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        items={archives}
        selected={selectedIds}
        onApply={handleApplyArchive}
        brand={BRAND}
      />

      <DateRangePopover
        open={docDateOpen}
        onClose={() => setDocDateOpen(false)}
        anchorEl={docBtnRef.current}
        value={docDate}
        onChange={(r) => setDocDate(r)}
        onClear={() => setDocDate({})}
        title="Document Date"
        brand={BRAND}
      />

      <DateRangePopover
        open={expDateOpen}
        onClose={() => setExpDateOpen(false)}
        anchorEl={expBtnRef.current}
        value={expDate}
        onChange={(r) => setExpDate(r)}
        onClear={() => setExpDate({})}
        title="Expire Date"
        brand={BRAND}
      />

      <ExpireInPopover
        open={expireInOpen}
        onClose={() => setExpireInOpen(false)}
        anchorEl={expireInBtnRef.current}
        options={expireInOptions}
        selected={expireInIds}
        onApply={(ids/*, all*/) => setExpireInIds(new Set(ids))}
        brand={BRAND}
        placeholder="Document Expire In"
      />

      <ExportPopover
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        anchorEl={exportBtnRef.current}
        onSelect={(fmt) => {
          setExportOpen(false);
          onExport?.(fmt);
          if (!onExport) console.log("Export:", fmt);
        }}
      />

      {/* View popover: Toggle columns */}
      <ViewColumnsPopover
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        anchorEl={viewBtnRef.current}
        options={columnOptions}
        selected={visibleCols}
        onChange={applyCols}
      />
    </>
  );
}

/* Reusable badge (with optional clear button) */
function Badge({ children, withClose, onClose }:{ children: React.ReactNode; withClose?: boolean; onClose?: (e: React.MouseEvent) => void; }) {
  return (
    <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-600 pl-2 pr-1 py-0.5 text-[11px] font-semibold text-white">
      <span className="truncate max-w-[9rem]">{children}</span>
      {withClose && (
        <button
          type="button"
          aria-label="Clear"
          onClick={onClose}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

/* utils */
function fmt(d?: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}
