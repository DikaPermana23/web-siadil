"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ArchiveOption = { id: string | number; name: string; alias?: string };

export type AddDocumentPayload = {
  archiveId: string | number;
  number: string;
  title: string;
  description?: string;
  documentDate?: string; // "YYYY-MM-DD"
  expireDate?: string;   // "YYYY-MM-DD"
  file?: File | null;
};

export default function AddDocumentModal({
  open,
  onClose,
  onSave,
  archives = [],
  brand = "#017938",
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: AddDocumentPayload) => void;
  archives?: ArchiveOption[];
  brand?: string;
}) {
  const [archiveId, setArchiveId] = useState<string | number>("");
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const canSave = useMemo(
    () => String(archiveId).length > 0 && number.trim() && title.trim(),
    [archiveId, number, title]
  );

  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // body lock + focus
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // esc & click-away
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const input =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-800";
  const label = "text-sm font-medium text-neutral-800 dark:text-neutral-100";
  const help = "mt-1 text-xs text-neutral-500";

  const body = (
    <div className="fixed inset-0 z-[1000]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" aria-hidden="true" />

      {/* Centered Dialog */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-doc-title"
        className="absolute inset-0 grid place-items-center p-4"
      >
        <div
          ref={panelRef}
          className="relative flex h-full w-full max-h-[85vh] max-w-[720px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 transition-transform dark:bg-neutral-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <div>
              <h2 id="add-doc-title" className="text-lg font-semibold">
                Add New Document
              </h2>
              <p className="text-xs text-neutral-500">
                Add new document here. Click save when you’re done.
              </p>
            </div>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            {/* Archive */}
            <div className="mb-4">
              <label className={label}>Archive</label>
              <div className="mt-1">
                <div className="relative">
                  <select
                    value={String(archiveId)}
                    onChange={(e) => setArchiveId(e.target.value)}
                    className={`${input} appearance-none pr-9`}
                  >
                    <option value="">Select Archive</option>
                    {archives.map((a) => (
                      <option key={String(a.id)} value={String(a.id)}>
                        {a.name}
                        {a.alias ? ` (${a.alias})` : ""}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Number */}
            <div className="mb-4">
              <label className={label}>Number</label>
              <input
                ref={firstFieldRef}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter Number"
                className={input}
              />
              <p className={help}>Seperti nomor Memo/PR/PO/dsb.</p>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className={label}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title"
                className={input}
              />
              <p className={help}>Judul dokumen</p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className={label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                rows={3}
                className={`${input} resize-y`}
              />
              <p className={help}>Deskripsikan dokumen secara singkat</p>
            </div>

            {/* Dates */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={label}>Document Date</label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    value={documentDate}
                    onChange={(e) => setDocumentDate(e.target.value)}
                    className={input}
                  />
                  <p className={help}>Tanggal dokumen</p>
                </div>
              </div>
              <div>
                <label className={label}>Document Expire Date</label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className={input}
                  />
                  <p className={help}>Tanggal akhir dokumen berlaku</p>
                </div>
              </div>
            </div>

            {/* File */}
            <div className="mb-2">
              <label className={label}>File</label>
              <div className="mt-1">
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                  <span className="truncate">
                    {file ? file.name : "Belum ada file yang dipilih"}
                  </span>
                  <span className="rounded-md border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-600">
                    Browse
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!canSave) return;
                  onSave({
                    archiveId,
                    number: number.trim(),
                    title: title.trim(),
                    description: description.trim() || undefined,
                    documentDate: documentDate || undefined,
                    expireDate: expireDate || undefined,
                    file,
                  });
                }}
                disabled={!canSave}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: brand }}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.704 5.29a1 1 0 10-1.408-1.42L8.5 10.67l-2.796-2.8a1 1 0 10-1.414 1.42l3.5 3.5a1 1 0 001.414 0l7.5-7.5z" />
                </svg>
                Save
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 font-semibold hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return createPortal(body, document.body);
}
