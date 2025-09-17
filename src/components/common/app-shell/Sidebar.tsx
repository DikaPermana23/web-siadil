// src/components/common/app-shell/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse, faUser, faBriefcase, faClock, faBook, faLink, faCubes,
  faWandMagicSparkles, faShieldHalved, faBoxesStacked, faLayerGroup,
  faFolderOpen, faSquarePollVertical, faMapLocationDot, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

const BRAND = "#017938";

type NavItem = {
  label: string;
  href: Route;
  icon: IconDefinition;
  rightDot?: boolean;
  labelClass?: string;
};

export default function Sidebar({
  collapsed,
  desktopWidth,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  desktopWidth: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const generals: NavItem[] = [
    { label: "Home", href: "/home" as Route, icon: faHouse },
    { label: "Profile", href: "/profile" as Route, icon: faUser },
    { label: "Employment", href: "/employment" as Route, icon: faBriefcase },
    { label: "Kehadiran, Koreksi, Cuti,\ndan Dinas", href: "/attendance" as Route, icon: faClock },
  ];

  const mainMenu: NavItem[] = [
    { label: "Portal Aplikasi", href: "/portal" as Route, icon: faCubes, rightDot: true, labelClass: "text-green-700 font-semibold" },
    { label: "Kujang AI", href: "/ai" as Route, icon: faWandMagicSparkles, rightDot: true, labelClass: "text-pink-600 font-semibold" },
    { label: "Library", href: "/library" as Route, icon: faBook },
    { label: "Shortlink", href: "/shortlink" as Route, icon: faLink, rightDot: true, labelClass: "text-green-700 font-semibold" },
  ];

  const features: NavItem[] = [
    { label: "E-Prosedur", href: "/features/e-prosedur" as Route, icon: faLayerGroup },
    { label: "Employee Directory", href: "/features/employee-directory" as Route, icon: faLayerGroup },
    { label: "SIADIL", href: "/" as Route, icon: faFileLines },
    { label: "SYSTIK", href: "/features/systik" as Route, icon: faBoxesStacked },
    { label: "Konsumsi", href: "/features/konsumsi" as Route, icon: faLayerGroup },
    { label: "Dokumenku", href: "/features/dokumenku" as Route, icon: faFolderOpen },
    { label: "MyStatement", href: "/features/mystatement" as Route, icon: faSquarePollVertical },
    { label: "Work Area", href: "/features/work-area" as Route, icon: faMapLocationDot },
    { label: "Peraturan Perundangan", href: "/features/peraturan" as Route, icon: faShieldHalved },
  ];

  return (
    <>
      {/* Backdrop (mobile) */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={onMobileClose} />}

      <aside
        style={{ width: `${desktopWidth}px` }}
        className="fixed left-0 top-0 z-50 h-full flex-none overflow-y-auto border-r border-neutral-200 bg-white py-4 transition-[width] duration-300 ease-in-out scrollbar-hide dark:border-neutral-700 dark:bg-neutral-800 md:static md:z-auto"
      >
        {/* Close btn (mobile) */}
        <div className="md:hidden flex justify-end px-3">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        {/* Brand — selalu tampil; mengecil saat collapsed */}
        <Link href="/" className="block px-3" title="Demplon / SIADIL">
          <div className={`relative mx-auto transition-all duration-300 ease-out ${collapsed ? "h-10 w-10" : "h-10 w-32"}`}>
            <Image src="/logo.png" alt="demplon" fill className="object-contain" priority />
          </div>
        </Link>

        {/* User */}
        <div className={`mt-4 flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-3"}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-[13px] font-semibold text-neutral-700">
            DF
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="whitespace-nowrap text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">Dika Permana</div>
              <div className="whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">10122059</div>
            </div>
          )}
        </div>

        {/* Sections */}
        <Section title="GENERALS" collapsed={collapsed}>
          {generals.map((it) => (
            <Row key={it.href} item={it} active={pathname === it.href} collapsed={collapsed} />
          ))}
        </Section>

        <Section title="MAIN MENU" collapsed={collapsed}>
          {mainMenu.map((it) => (
            <Row key={it.href} item={it} active={pathname === it.href} collapsed={collapsed} />
          ))}
        </Section>

        <Section title="APPS & FEATURES" collapsed={collapsed}>
          {features.map((f) => {
            const active = pathname === f.href; // hanya item dengan URL yang cocok
            return <Row key={f.href} item={f} active={active} collapsed={collapsed} />;
          })}
        </Section>
      </aside>
    </>
  );
}

/* helpers */
function Section({ title, children, collapsed }: React.PropsWithChildren<{ title: string; collapsed: boolean }>) {
  return (
    <div className={`mt-5 ${collapsed ? "px-0" : "px-2"}`}>
      <div className={`${collapsed ? "hidden" : "block"} px-1 text-[13px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400`}>
        {title}
      </div>
      <ul className={`mt-2 ${collapsed ? "space-y-2 px-0" : "space-y-1 px-0"}`}>{children}</ul>
    </div>
  );
}

function Row({ item, active, collapsed }: { item: NavItem; active?: boolean; collapsed: boolean }) {
  const base = "group relative rounded-xl outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500";
  const expanded = "flex items-center gap-3 px-2 py-2 text-[15px]";
  const expandedIdle = "hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200";
  const compact = "mx-auto flex h-10 w-10 items-center justify-center";
  const compactIdle = "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700";

  const activeClass = "text-white";
  const activeBgStyle = active ? { backgroundColor: BRAND } : undefined;

  return (
    <li>
      <Link
        href={item.href}
        title={collapsed ? item.label.replace(/\n/g, " ") : undefined}
        className={[
          base,
          collapsed ? compact : expanded,
          active ? activeClass : (collapsed ? compactIdle : expandedIdle),
        ].join(" ")}
        style={activeBgStyle}
      >
        {/* Icon */}
        <span className={`relative inline-flex ${collapsed ? "" : "h-8 w-8 items-center justify-center"}`}>
          <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
          {/* Titik hijau berdetak saat COLLAPSED (dan item tidak aktif) */}
          {item.rightDot && collapsed && !active && (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5" aria-hidden>
              <span
                className="absolute inset-0 rounded-full opacity-70 animate-ping motion-reduce:animate-none"
                style={{ backgroundColor: BRAND }}
              />
              <span
                className="relative block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-neutral-800"
                style={{ backgroundColor: BRAND }}
              />
            </span>
          )}
        </span>

        {/* Label (hidden saat collapsed) */}
        {!collapsed && (
          <>
            <span className={`flex-1 ${item.labelClass ?? ""}`}>
              {item.label.split("\n").map((p, i) => (
                <span key={i} className="block whitespace-nowrap">{p}</span>
              ))}
            </span>

            {/* Titik hijau berdetak saat EXPANDED (dan item tidak aktif) */}
            {item.rightDot && !active && (
              <span className="ml-auto inline-flex items-center justify-center">
                <span className="relative h-3 w-3">
                  <span
                    className="absolute inset-0 rounded-full opacity-70 animate-ping motion-reduce:animate-none"
                    style={{ backgroundColor: BRAND }}
                  />
                  <span
                    className="relative block h-3 w-3 rounded-full ring-2"
                    style={{ backgroundColor: BRAND, boxShadow: "0 0 0 2px #CDEDD8 inset" }}
                  />
                </span>
              </span>
            )}
          </>
        )}

        {collapsed && <span className="sr-only">{item.label.replace(/\n/g, " ")}</span>}
      </Link>
    </li>
  );
}
