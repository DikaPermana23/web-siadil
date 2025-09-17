// src/components/common/app-shell/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { IconFolderLine, IconDocumentLine } from "@/components/common/icons";

type CrumbType = "folder" | "doc";
type CrumbLabel = { label: string } | { name: string };

export type Crumb = CrumbLabel & {
  href?: Route | string;   // jika undefined → dirender sebagai teks
  type?: CrumbType;        // default: 'folder'
};

const ICON_SM = "h-4 w-4";

const LABELS: Record<string, string> = {
  siadil: "SIADIL",
  documents: "Dokumen Arsip",
};

const PATH_CONFIG: Record<string, CrumbType> = {
  documents: "doc",
};

function getText(c: Crumb) {
  return "label" in c ? c.label : c.name;
}

export default function Breadcrumbs({
  items,
  className,
}: {
  items?: Crumb[];      // jika tidak dikirim, otomatis dari URL
  className?: string;
}) {
  const pathname = usePathname();

  // Auto-generate dari URL saat items kosong
  let computed: Crumb[] = [];
  if (!items || items.length === 0) {
    const parts = pathname.split("/").filter(Boolean);
    const crumbs: Crumb[] = [{ label: "Root", href: "/" as Route, type: "folder" }];

    parts.forEach((part, i) => {
      const href = ("/" + parts.slice(0, i + 1).join("/")) as Route;
      const key = part.toLowerCase();
      const label =
        LABELS[key] ??
        decodeURIComponent(part)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (m) => m.toUpperCase());
      const type: CrumbType = PATH_CONFIG[key] ?? "folder";
      crumbs.push({ label, href, type });
    });

    computed = crumbs;
  }

  const list = items && items.length > 0 ? items : computed;

  return (
    <nav aria-label="Breadcrumb" className={className ?? "mt-2"}>
      <ol className="flex items-center gap-2 text-sm text-neutral-600">
        {list.map((c, idx) => {
          const isLast = idx === list.length - 1;
          const Icon = (c.type ?? "folder") === "doc" ? IconDocumentLine : IconFolderLine;

          // key aman tanpa cast paksa
          const key = typeof c.href === "string" ? c.href : `${getText(c)}-${idx}`;

          // typedRoutes-safe: jika href string, ubah ke UrlObject { pathname }
          const hrefForLink =
            typeof c.href === "string" ? { pathname: c.href } : c.href;

          return (
            <li key={key} className="flex items-center gap-2">
              {idx > 0 && <span aria-hidden="true" className="text-neutral-400">›</span>}

              {isLast || !hrefForLink ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-neutral-100 px-2.5 py-1.5"
                  aria-current="page"
                >
                  <Icon className={ICON_SM} />
                  <span>{getText(c)}</span>
                </span>
              ) : (
                <Link
                  href={hrefForLink} // Route | UrlObject (bukan string mentah)
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 hover:bg-neutral-50"
                >
                  <Icon className={ICON_SM} />
                  <span>{getText(c)}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
