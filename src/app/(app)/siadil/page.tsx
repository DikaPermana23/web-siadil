// src/app/(app)/siadil/page.tsx
import { Suspense } from "react";
import Breadcrumbs from "@/components/common/app-shell/Breadcrumbs";
import DocumentsPanel from "@/domain/documents/components/DocumentsPanel";
import { getDashboardData } from "@/lib/providers/dashboard.server";
import type { Route } from "next";

// Jika sebelumnya ada error prerender karena useSearchParams di child:
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getDashboardData();

  // Breadcrumbs (opsional: bisa tanpa items karena Breadcrumbs juga auto dari URL)
  const crumbs: { label: string; href?: Route }[] = [
    { label: "SIADIL", href: "/siadil" },
    { label: "Dashboard" },
  ];

  // Items minimal: kosong dulu
  const items: React.ComponentProps<typeof DocumentsPanel>["items"] = [];

  // ArchiveOption: { id, name }
  const archiveOptions = data.archives.map((a) => ({ id: a.id, name: a.name }));

  // Meta sesuai ListMeta (tanpa perPage)
  const PER_PAGE = 10; // hanya untuk hitung totalPages
  const totalItems = data.totalDocs ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));

  return (
    <Suspense fallback={<div className="p-6">Memuat…</div>}>
      <div className="space-y-8">
        <Breadcrumbs items={crumbs} />

        <DocumentsPanel
          items={items}
          meta={{ page: 1, totalPages, totalItems }} // ✅ sesuai ListMeta
          archives={archiveOptions}
          emptyHint="Belum ada dokumen."
        />
      </div>
    </Suspense>
  );
}
