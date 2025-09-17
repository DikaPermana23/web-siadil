"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export type ColumnOption = { key: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  options: ColumnOption[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
};

export default function ViewColumnsPopover({ open, onClose, anchorEl, options, selected, onChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [local, setLocal] = useState<Set<string>>(new Set(selected));

  useEffect(() => setLocal(new Set(selected)), [selected]);

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

  const width = 260;
  const top = Math.min(rect.bottom + 8, window.innerHeight - 12);
  const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);

  const toggle = (k: string) => {
    const next = new Set(local);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setLocal(next);
    onChange(next);
  };

  return createPortal(
    <div ref={ref} className="fixed z-[9999]" style={{ top, left, width }}>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
        <div className="border-b px-3 py-2 text-sm font-semibold">Toggle columns</div>

        <div className="py-1">
          {options.map((opt) => {
            const checked = local.has(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => toggle(opt.key)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-[15px] hover:bg-neutral-50 dark:hover:bg-neutral-700/60"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-neutral-300">
                  {checked ? "✓" : ""}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
