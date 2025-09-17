import React from "react";
import Link from "next/link";
import { type Reminder, type ReminderSeverity } from "@/types/dashboard";

/* =========================================
   Tone warna per severity (pekat, rapi)
   ========================================= */
type Tone = {
  surface: string;
  ring: string;
  text: string;
  iconWrap: string;
  chip: string;
  arrow: string;
};
function toneBySeverity(sev: ReminderSeverity): Tone {
  switch (sev) {
    case "danger":
      return {
        surface: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/25 dark:to-red-950/30",
        ring: "border-red-300/80 dark:border-red-900/60",
        text: "text-red-950 dark:text-red-100",
        iconWrap: "bg-red-500/20 text-red-700 dark:text-red-200",
        chip: "bg-red-600/10 text-red-800 dark:text-red-100",
        arrow: "hover:bg-red-500/15 focus-visible:ring-red-500/50",
      };
    case "warn":
      return {
        surface: "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/25 dark:to-amber-950/30",
        ring: "border-amber-300/80 dark:border-amber-900/60",
        text: "text-amber-950 dark:text-amber-100",
        iconWrap: "bg-amber-500/20 text-amber-800 dark:text-amber-200",
        chip: "bg-amber-600/10 text-amber-800 dark:text-amber-100",
        arrow: "hover:bg-amber-500/15 focus-visible:ring-amber-500/50",
      };
    case "success":
      return {
        surface: "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/25 dark:to-emerald-950/30",
        ring: "border-emerald-300/80 dark:border-emerald-900/60",
        text: "text-emerald-950 dark:text-emerald-100",
        iconWrap: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200",
        chip: "bg-emerald-600/10 text-emerald-800 dark:text-emerald-100",
        arrow: "hover:bg-emerald-500/15 focus-visible:ring-emerald-500/50",
      };
    default:
      return {
        surface: "bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/25 dark:to-sky-950/30",
        ring: "border-sky-300/80 dark:border-sky-900/60",
        text: "text-sky-950 dark:text-sky-100",
        iconWrap: "bg-sky-500/20 text-sky-800 dark:text-sky-200",
        chip: "bg-sky-600/10 text-sky-800 dark:text-sky-100",
        arrow: "hover:bg-sky-500/15 focus-visible:ring-sky-500/50",
      };
  }
}

/* =========================================
   Icon per severity
   ========================================= */
function SeverityIcon({
  severity,
  className = "h-4 w-4",
}: {
  severity: ReminderSeverity;
  className?: string;
}) {
  switch (severity) {
    case "danger":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 9v4m0 4h.01M3.1 17.4 10.2 4.7c.71-1.28 2.89-1.28 3.6 0l7.1 12.7c.69 1.23-.2 2.6-1.8 2.6H4.9c-1.6 0-2.49-1.37-1.8-2.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "warn":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "success":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="m9 12.75 2.25 2.25L15 9.75M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
}

/* =========================================
   Clamp style
   ========================================= */
const clamp = (lines: number): React.CSSProperties => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
  overflow: "hidden",
});

/* =========================================
   Days badge (ringkas)
   ========================================= */
function DaysBadge({ days, className = "" }: { days?: number; className?: string }) {
  if (typeof days !== "number") return null;
  const text = days > 0 ? `Sisa ${days} hari` : days === 0 ? "Jatuh tempo hari ini" : `Terlambat ${Math.abs(days)} hari`;
  return (
    <span className={`inline-flex items-center rounded-full px-1.5 py-[2px] text-[10px] font-semibold ${className}`} title={text}>
      {text}
    </span>
  );
}

/* =========================================
   Arrow button (kecil, anim slide)
   ========================================= */
function ArrowButton({
  className = "",
  label = "Lihat detail",
  sizeClass = "h-7 w-7",
  svgSizeClass = "h-4 w-4",
}: {
  className?: string;
  label?: string;
  sizeClass?: string;
  svgSizeClass?: string;
}) {
  return (
    <span
      className={`inline-grid ${sizeClass} place-items-center rounded-full ring-1 ring-inset transition-transform duration-200 group-hover:translate-x-0.5 ${className}`}
      aria-label={label}
      title={label}
      role="button"
    >
      <svg viewBox="0 0 24 24" fill="none" className={svgSizeClass}>
        <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* =========================================
   Komponen utama
   ========================================= */
type ReminderWithDays = Reminder & { daysLeft?: number };
type Size = "normal" | "compact" | "micro";

export default function ReminderCard({
  item,
  className = "",
  compact,
  size,
}: {
  item: ReminderWithDays;
  className?: string;
  compact?: boolean;
  size?: Size;
}) {
  const tone = toneBySeverity(item.severity);
  const finalSize: Size = size ?? (compact ? "compact" : "normal");

  const S = {
    normal: {
      radius: "rounded-xl",
      pad: "p-4",
      gap: "gap-3",
      gridCols: "grid-cols-[42px,1fr,auto]",
      iconBox: "h-10 w-10 self-center",
      icon: "h-5 w-5",
      title: "text-sm font-semibold leading-tight",
      sub: "text-[12px] leading-tight",
      desc: "text-[12px] leading-snug",
      arrowSize: "h-9 w-9",
      arrowSvg: "h-5 w-5",
      prEdge: "pr-3",
      showSubtitle: true,
      showDesc: true,
      shadow: "shadow",
    },
    compact: {
      radius: "rounded-lg",
      pad: "p-3",
      gap: "gap-2",
      gridCols: "grid-cols-[36px,1fr,auto]",
      iconBox: "h-9 w-9 self-center",
      icon: "h-4 w-4",
      title: "text-[13px] font-semibold leading-tight",
      sub: "text-[11px] leading-tight",
      desc: "text-[11px] leading-snug",
      arrowSize: "h-8 w-8",
      arrowSvg: "h-4 w-4",
      prEdge: "pr-2",
      showSubtitle: true,
      showDesc: true,
      shadow: "shadow",
    },
    micro: {
      radius: "rounded-lg",
      pad: "p-2.5",
      gap: "gap-2",
      gridCols: "grid-cols-[30px,1fr,auto]",
      iconBox: "h-8 w-8 self-center",
      icon: "h-4 w-4",
      title: "text-[13px] font-semibold leading-tight",
      sub: "text-[11px] leading-tight",
      desc: "text-[11px] leading-snug",
      arrowSize: "h-7 w-7",
      arrowSvg: "h-4 w-4",
      prEdge: "pr-2",
      showSubtitle: true,
      showDesc: true,
      shadow: "shadow",
    },
  }[finalSize];

  return (
    <article
      className={[
        "w-full",
        "group grid items-start",
        S.gridCols,
        S.gap,
        S.radius,
        "border",
        S.pad,
        S.prEdge,
        S.shadow,
        // anim hover: naik halus + shadow bertambah
        "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md",
        tone.surface,
        tone.ring,
        tone.text,
        className,
      ].join(" ")}
    >
      {/* Icon tengah kiri + anim scale halus */}
      <div className={`grid ${S.iconBox} place-items-center rounded-full ${tone.iconWrap} transition-transform duration-200 group-hover:scale-105`}>
        <SeverityIcon severity={item.severity} className={S.icon} />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`truncate ${S.title}`}>{item.title}</h3>
          <DaysBadge days={item.daysLeft} className={tone.chip} />
        </div>
        {S.showSubtitle && item.subtitle && (
          <p className="mt-0.5 opacity-90" style={clamp(1)}>
            <span className={S.sub}>{item.subtitle}</span>
          </p>
        )}
        {S.showDesc && item.desc && (
          <p className="mt-0.5 opacity-90" style={clamp(2)}>
            <span className={S.desc}>{item.desc}</span>
          </p>
        )}
      </div>

      {/* Tombol panah: center vertikal & slide saat hover */}
      <div className="justify-self-end self-center">
        {item.url ? (
          <Link href={item.url} className="focus:outline-none">
            <ArrowButton
              className={`${tone.arrow} ring-black/5 dark:ring-white/10`}
              sizeClass={S.arrowSize}
              svgSizeClass={S.arrowSvg}
            />
          </Link>
        ) : (
          <button type="button" className="focus:outline-none">
            <ArrowButton
              className={`${tone.arrow} ring-black/5 dark:ring-white/10`}
              sizeClass={S.arrowSize}
              svgSizeClass={S.arrowSvg}
            />
          </button>
        )}
      </div>
    </article>
  );
}
