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

export default async function DashboardPage() {
  const data = (await getDashboardData()) as DashboardData;

  const today = new Date(data.lastUpdated ?? Date.now()).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const firstArchive = data.archives?.[0];

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

      {/* Kartu Atas: kiri lebar, kanan fixed 320px */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,320px] lg:justify-items-end">
        {/* Kiri: Archives */}
        <div className="space-y-3 justify-self-stretch">
          <Section title="Archives">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <GreenStatCard value={data.totalDocs} label="Total Dokumen" sub={`Per ${today}`} />
              <GreenArchiveCard title={firstArchive ? firstArchive.name : "—"} subtitle={firstArchive?.alias ?? ""} />
              <CreateArchiveCard />
            </div>
          </Section>
        </div>

        {/* Kanan: Reminders */}
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
      <Section
        title="Dokumen"
        titleClassName="translate-y-[40px] leading-none" // geser judul sedikit ke bawah
      >
        <DocumentsPanel
          items={[]}
          archives={data.archives}
          meta={{ page: 1, totalPages: 1 }}
          emptyHint="Belum ada data untuk filter/pencarian ini. Tambahkan dokumen atau ubah filter."
        />
      </Section>
    </div>
  );
}
