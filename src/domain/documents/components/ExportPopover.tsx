"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export type ExportFormat = "excel" | "csv" | "pdf";

type Props = {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  onSelect: (fmt: ExportFormat) => void;
  brand?: string;
};

export default function ExportPopover({ open, onClose, anchorEl, onSelect, brand = "#017938" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => setRect(anchorEl?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorEl]);

  useEffect(() => {
    if (!open) return;
    const clickAway = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", clickAway);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", clickAway);
      document.removeEventListener("keydown", esc);
    };
  }, [open, onClose]);

  if (!open || !rect) return null;

  const width = 240;
  const top = Math.min(rect.bottom + 8, window.innerHeight - 12);
  const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);

  return createPortal(
    <div ref={ref} className="fixed z-[9999]" style={{ top, left, width }}>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
        <div className="border-b px-3 py-2 text-sm font-semibold" style={{ color: brand }}>
          Export data to
        </div>
        <div className="py-1">
          {([
            { k: "excel", label: "Excel" },
            { k: "csv", label: "CSV" },
            { k: "pdf", label: "PDF" },
          ] as { k: ExportFormat; label: string }[]).map((it) => (
            <button
              key={it.k}
              onClick={() => onSelect(it.k)}
              className="block w-full px-3 py-2 text-left text-[15px] hover:bg-neutral-50 dark:hover:bg-neutral-700/60"
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
