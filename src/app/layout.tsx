import "./globals.css";
import "@/styles/tokens.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { Suspense } from "react";
import type { Metadata } from "next";
import AppShell from "@/components/common/app-shell/AppShell";

export const metadata: Metadata = {
  title: "SIADIL",
  description: "Sistem Arsip Digital",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      {/* body tidak scroll; scroll ada di AppShell */}
      <body className="h-screen overflow-hidden bg-neutral-50 text-neutral-900 antialiased">
        {/* Suspense boundary untuk CSR bailout (useSearchParams, dll) */}
        <Suspense fallback={null}>
          <AppShell>
            <Suspense fallback={null}>{children}</Suspense>
          </AppShell>
        </Suspense>
      </body>
    </html>
  );
}
