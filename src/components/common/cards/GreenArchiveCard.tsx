// src/components/dashboard/CreateArchiveCard.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

const ICON_XL = "h-8 w-8 md:h-9 md:w-9";
const BRAND = "#017938";

export default function CreateArchiveCard({
  title = "Folder",
  subtitle = "Buka untuk melihat isi",
  href,            // contoh: "/siadil/folders/abc123" as Route
  onOpen,          // kalau mau handle klik sendiri
}: {
  title?: string;
  subtitle?: string;
  href?: Route;
  onOpen?: () => void;
}) {
  const isInteractive = Boolean(href || onOpen);

  const CardInner = (
    <div
      className={[
        "relative overflow-hidden rounded-lg text-white",
        // shadow dasar (lebih gelap) + ring tipis
        "shadow-[0_6px_16px_rgba(0,0,0,0.18)] ring-1 ring-white/10",
        // animasi & transform
        "transition-all duration-200 ease-out transform-gpu will-change-transform",
        // efek hover: naik + shadow & ring makin kuat + naik layer
        isInteractive
          ? "hover:-translate-y-1.5 group-hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)] hover:ring-white/30 hover:z-10 cursor-pointer"
          : "cursor-default",
        // tinggi dikunci
        "h-28 md:h-32",
        // layout konten
        "p-4 flex flex-col justify-end",
        // fokus keyboard
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
      ].join(" ")}
      style={{
        background: `linear-gradient(135deg, ${BRAND}, #015d2b)`,
      }}
      aria-label={`Buka folder ${title}`}
      tabIndex={0}
    >
      {/* Overlay halus saat hover (tidak mempengaruhi height) */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-[.06]" />

      {/* Ikon folder di pojok kiri atas */}
      <div className="absolute left-3 top-3 rounded-md border border-white/10 bg-white/5 p-2 transition-colors duration-200 group-hover:bg-white/10 group-hover:border-white/20">
        <FontAwesomeIcon icon={faFolder} className={ICON_XL} />
      </div>

      {/* Teks di bagian bawah kartu */}
      <div className="space-y-1">
        <div className="text-sm leading-5 opacity-90 truncate" title={title}>
          {title}
        </div>
        <div className="text-xs leading-5 opacity-80 truncate" title={subtitle}>
          {subtitle}
        </div>
      </div>

      {/* Gloss bawah (subtle & gelap), tidak memengaruhi height */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 rounded-b-lg bg-black/30 mix-blend-multiply" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {CardInner}
      </Link>
    );
  }

  if (onOpen) {
    return (
      <button type="button" onClick={onOpen} className="block w-full text-left group">
        {CardInner}
      </button>
    );
  }

  return <div className="w-full group">{CardInner}</div>;
}
