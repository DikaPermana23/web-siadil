// src/app/(app)/siadil/page.tsx
import Breadcrumbs from "@/components/common/app-shell/Breadcrumbs";
import { getDashboardData } from "@/lib/providers/dashboard.mock";
import type { DashboardData } from "@/types/dashboard";

// Kartu & section
import CardShell from "@/components/common/cards/CardShell";
import UserCard from "@/components/common/cards/UserCard";
import GreenStatCard from "@/components/common/cards/GreenStatCard";
import GreenArchiveCard from "@/components/common/cards/GreenArchiveCard";
import ReminderCard from "@/components/common/cards/ReminderCard";
import Section from "@/components/common/cards/Section";
import CreateArchiveCard from "@/components/dashboard/CreateArchiveCard";

// Panel dokumen
import DocumentsPanel from "@/domain/documents/components/DocumentsPanel";

// Provider mock (search/sort/filter/paginate)
import { getDocuments } from "@/lib/providers/documents.mock";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const data = (await getDashboardData()) as DashboardData;

  const today = new Date(data.lastUpdated ?? Date.now()).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const firstArchive = data.archives?.[0];

  // ====== Query dari URL ======
  const rawPage = Number(searchParams?.page ?? 1);
  const rawPerPage = Number(
    (searchParams?.perPage as string | undefined) ??
      (searchParams?.limit as string | undefined) ??
      (searchParams?.pageSize as string | undefined) ??
      10
  );

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const perPage = Number.isFinite(rawPerPage) && rawPerPage > 0 ? rawPerPage : 10;

  const q = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  const archiveIds =
    typeof searchParams?.archiveIds === "string"
      ? searchParams.archiveIds.split(",").filter(Boolean)
      : undefined;

  // ====== Ambil dokumen ======
  let { items, totalItems, totalPages } = await getDocuments({
    page,
    perPage,
    q,
    archiveIds,
    sortBy: "documentDate",
    sortDir: "desc",
  });

  // Clamp halaman bila page > totalPages (mis. setelah filter)
  if (totalPages > 0 && page > totalPages) {
    const res2 = await getDocuments({
      page: totalPages,
      perPage,
      q,
      archiveIds,
      sortBy: "documentDate",
      sortDir: "desc",
    });
    items = res2.items;
    totalItems = res2.totalItems;
    totalPages = res2.totalPages;
  }

  // DocumentsPanel expects ArchiveOption[] = { id, name }
  const archiveOptions = (data.archives ?? []).map((a) => ({ id: a.id, name: a.name }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div>
            <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-[#017938] via-[#017938] to-[#015d2b] bg-clip-text text-transparent">
                SIADIL
              </span>
            </h1>
            <p className="mt-0.5 text-base text-neutral-500">Sistem Arsip Digital</p>
          </div>
          <div className="mt-2 text-sm text-neutral-700 [&_svg]:h-4 [&_svg]:w-4">
            <Breadcrumbs />
          </div>
        </div>

        <div className="lg:col-span-4">
          <UserCard user={data.user} />
        </div>
      </div>

      {/* Kartu Atas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,320px] lg:justify-items-end">
        <div className="space-y-3 justify-self-stretch">
          <Section title="Archives">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <GreenStatCard value={totalItems} label="Total Dokumen" sub={`Per ${today}`} />
              <GreenArchiveCard
                title={firstArchive ? firstArchive.name : "—"}
                subtitle={firstArchive?.alias ?? ""}
              />
              <CreateArchiveCard />
            </div>
          </Section>
        </div>

        <aside className="ml-auto w-full max-w-[300px] justify-self-end space-y-3 lg:sticky lg:top-20">
          <Section title="Reminders">
            <div className="grid grid-cols-1 gap-2">
              {data.reminders?.length ? (
                data.reminders.map((r) => <ReminderCard key={r.id} item={r} size="micro" />)
              ) : (
                <CardShell>
                  <div className="p-6 text-sm text-neutral-600">Tidak ada pengingat aktif.</div>
                </CardShell>
              )}
            </div>
          </Section>
        </aside>
      </div>

      {/* Dokumen */}
      <Section title="Dokumen" titleClassName="translate-y-[40px] leading-none">
        <DocumentsPanel
          items={items}
          archives={archiveOptions}
          meta={{ page: Math.min(page, totalPages || 1), totalPages, totalItems }}
          emptyHint="Belum ada data untuk filter/pencarian ini. Tambahkan dokumen atau ubah filter."
        />
      </Section>
    </div>
  );
}
