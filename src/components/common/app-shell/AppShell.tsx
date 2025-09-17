"use client";

import * as React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppShellCtx = React.createContext(false);

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "1");
  }, []);
  React.useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const desktopWidth = collapsed ? 80 : 265; // 64px (tutup) / 224px (buka)

  return (
    <div className="h-screen overflow-hidden bg-neutral-50">
      <div className="relative h-full md:flex">
        {/* Sidebar: kolom kiri (scroll sendiri) */}
        <Sidebar
          collapsed={collapsed}
          desktopWidth={desktopWidth}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Konten: kolom kanan (scroll sendiri) */}
        <section className="flex h-full flex-1 min-w-0 flex-col">
          <Topbar
            onToggle={() => setCollapsed(v => !v)}
            onOpenSidebar={() => setMobileOpen(true)}
          />
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const inside = React.useContext(AppShellCtx);
  if (inside) return <>{children}</>; // guard anti nested

  return (
    <AppShellCtx.Provider value={true}>
      <AppShellInner>{children}</AppShellInner>
    </AppShellCtx.Provider>
  );
}
