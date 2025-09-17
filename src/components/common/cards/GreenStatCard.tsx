// src/components/common/cards/GreenStatCard.tsx
import React from "react";
import { IconCalendar } from "@/components/common/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

const BRAND = "#017938";
const BRAND_DARK = "#015d2b";
const ICON_MD = "h-5 w-5";      // ukuran ikon sudut
const ICON_CAL = "h-3.5 w-3.5"; // ikon kalender kecil

type Props = {
  value: number | string;
  label: string;
  sub: string;
  className?: string;
};

export default function GreenStatCard({ value, label, sub, className = "" }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg p-3 text-white shadow-md transition-transform hover:-translate-y-0.5 ${className}`}
      style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})` }}
      aria-label={`${label}: ${value}`}
    >
      {/* Ikon dokumen (Font Awesome) */}
      <div
        className="absolute right-3 top-3 rounded-md border border-white/40 p-1 text-white/90"
        aria-hidden
      >
        <FontAwesomeIcon icon={faFileLines} className={ICON_MD} />
      </div>

      {/* Angka & label */}
      <div className="space-y-0.5">
        <div className="text-2xl font-extrabold leading-tight tracking-tight">{value}</div>
        <div className="text-[12px]/5 opacity-90">{label}</div>
      </div>

      {/* Sub info */}
      <div className="mt-2 flex items-center gap-1.5 text-[11px] opacity-90">
        <IconCalendar className={ICON_CAL} />
        <span className="truncate">{sub}</span>
      </div>

      {/* Gloss bawah */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 rounded-b-lg bg-black/15" />
    </div>
  );
}
