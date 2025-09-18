// src/lib/providers/documents.mock.ts
import type { DocumentItem } from "@/domain/documents/model/types";

export type DocSortKey =
  | "id"
  | "number"
  | "title"
  | "documentDate"
  | "archiveName";
export type DocSortDir = "asc" | "desc";

export type GetDocumentsOptions = {
  page?: number;
  perPage?: number;
  q?: string;
  archiveIds?: string[];
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  contributors?: string[];
  sortBy?: DocSortKey;
  sortDir?: DocSortDir;
};

export type GetDocumentsResult = {
  items: DocumentItem[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

let CACHE: DocumentItem[] | null = null;

const lo = (s?: string) => (s ? s.toLowerCase() : "");
const pad = (n: number) => n.toString().padStart(2, "0");
const addDays = (base: Date, add: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + add);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Helpers tanggal aman
function toStartOfDay(s?: string): Date | null {
  if (!s) return null;
  const t = new Date(`${s}T00:00:00`);
  return Number.isNaN(t.getTime()) ? null : t;
}
function toEndOfDay(s?: string): Date | null {
  if (!s) return null;
  const t = new Date(`${s}T23:59:59`);
  return Number.isNaN(t.getTime()) ? null : t;
}
function toNoon(s?: string): Date | null {
  if (!s) return null;
  const t = new Date(`${s}T12:00:00`);
  return Number.isNaN(t.getTime()) ? null : t;
}

function seedBase(): DocumentItem[] {
  return [
    {
      id: "75658",
      number: "DTS 3.1",
      title: "DTS 3.1",
      description: "DTS 3.1",
      documentDate: "2024-09-10",
      contributors: ["Dokumentasi Aplikasi"],
      archiveId: "1",
      archiveName: "DOKUMENTASIAPLIKASI",
      createdBy: "3082625",
    },
    {
      id: "75355",
      number: "JAJAPWEB",
      title: "JAJAPWEB",
      description: "Aplikasi Jajap untuk Admin Mengelola Transaksi Jajap",
      documentDate: "2024-08-22",
      contributors: ["Dokumentasi Aplikasi"],
      archiveId: "1",
      archiveName: "DOKUMENTASIAPLIKASI",
      createdBy: "3082625",
    },
    {
      id: "75353",
      number: "JAJAPDRIVER",
      title: "JAJAPDRIVER",
      description:
        "Aplikasi Jajap untuk Request Transformasi Area Kawasan Kujang",
      documentDate: "2024-08-22",
      contributors: ["Dokumentasi Aplikasi"],
      archiveId: "1",
      archiveName: "DOKUMENTASIAPLIKASI",
      createdBy: "3082625",
    },
    {
      id: "75352",
      number: "APM",
      title: "APM",
      description:
        "Aplikasi Performance Monitoring Management untuk Generate Montly Report",
      documentDate: "2024-08-22",
      contributors: ["Dokumentasi Aplikasi"],
      archiveId: "1",
      archiveName: "DOKUMENTASIAPLIKASI",
      createdBy: "3082625",
    },
    {
      id: "75351",
      number: "WEBKUJANGADMIN",
      title: "WEBKUJANGADMIN",
      description:
        "Aplikasi Panel Admin untuk Pengelolaan Website Pupuk Kujang",
      documentDate: "2024-08-22",
      contributors: ["Dokumentasi Aplikasi"],
      archiveId: "1",
      archiveName: "DOKUMENTASIAPLIKASI",
      createdBy: "3082625",
    },
  ];
}

function seedMore(targetCount = 200): DocumentItem[] {
  const base = seedBase();

  const makers = [
    { prefix: "DOC", name: "Dokumen Umum" },
    { prefix: "SOP", name: "Standar Operasional" },
    { prefix: "SPK", name: "Surat Perjanjian Kerja" },
    { prefix: "BA", name: "Berita Acara" },
    { prefix: "MEMO", name: "Memo Internal" },
    { prefix: "LAP", name: "Laporan Bulanan" },
    { prefix: "APP", name: "Aplikasi Internal" },
  ];
  const creators = ["3082625", "3082001", "3081999", "3090007"];
  const archives = [
    { id: "1", name: "DOKUMENTASIAPLIKASI" },
    { id: "2", name: "DOKUMENHUMAS" },
    { id: "3", name: "LEGAL" },
  ];

  const startId = 99000;
  const startDate = new Date("2024-07-01");

  let i = 0;
  while (base.length < targetCount) {
    const mk = makers[i % makers.length];
    const idx = i + 1;
    const idNum = startId - i;
    const docDate = addDays(startDate, i % 150);
    const arch = archives[i % archives.length];

    base.push({
      id: `${idNum}`,
      number: `${mk.prefix}-${(idx % 999 + 1).toString().padStart(2, "0")}`,
      title: `${mk.name} ${idx}`,
      description: `${mk.name} nomor ${idx} untuk simulasi data dummy.`,
      documentDate: docDate,
      contributors: ["Dokumentasi Aplikasi"],
      archiveId: arch.id,
      archiveName: arch.name,
      createdBy: creators[i % creators.length],
    });
    i++;
  }

  base.sort((a, b) => Number(b.id) - Number(a.id));
  return base;
}

function ensureCache(): DocumentItem[] {
  if (!CACHE) CACHE = seedMore(200);
  return CACHE!;
}

export async function getDocuments(
  opts: GetDocumentsOptions = {}
): Promise<GetDocumentsResult> {
  const {
    page = 1,
    perPage = 10,
    q,
    archiveIds,
    dateFrom,
    dateTo,
    contributors,
    sortBy = "documentDate",
    sortDir = "desc",
  } = opts;

  const all = ensureCache();

  // FILTER
  let filtered = all.slice();

  if (q && q.trim()) {
    const needle = lo(q);
    filtered = filtered.filter((d) =>
      [lo(d.number), lo(d.title), lo(d.description)].some((s) =>
        s.includes(needle)
      )
    );
  }

  // 👇 FIX: narrow dulu agar Set<string> tidak menerima undefined,
  // lalu hanya cocokkan dokumen yang punya archiveId valid.
  if (archiveIds && archiveIds.length > 0) {
    const set = new Set<string>(
      archiveIds.filter(
        (x): x is string => typeof x === "string" && x.length > 0
      )
    );
    filtered = filtered.filter(
      (d) => typeof d.archiveId === "string" && set.has(d.archiveId)
    );
  }

  if (contributors && contributors.length > 0) {
    const cons = contributors.map((c) => lo(c));
    filtered = filtered.filter((d) =>
      (d.contributors ?? []).some((c) => cons.includes(lo(c)))
    );
  }

  if (dateFrom || dateTo) {
    const from = toStartOfDay(dateFrom);
    const to = toEndOfDay(dateTo);

    filtered = filtered.filter((d) => {
      const t = toNoon(d.documentDate);
      if (!t) return false;
      if (from && t < from) return false;
      if (to && t > to) return false;
      return true;
    });
  }

  // SORT
  const dir = sortDir === "asc" ? 1 : -1;
  filtered.sort((a, b) => {
    const getVal = (x: DocumentItem) => {
      switch (sortBy) {
        case "id":
          return Number(x.id);
        case "number":
          return x.number ?? "";
        case "title":
          return x.title ?? "";
        case "archiveName":
          return x.archiveName ?? "";
        case "documentDate":
        default:
          return x.documentDate ?? "";
      }
    };
    const va = getVal(a);
    const vb = getVal(b);

    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * dir;
    }
    return String(va).localeCompare(String(vb)) * dir;
  });

  // PAGING
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return { items, page, perPage, totalItems, totalPages };
}

// Backwards-compat
export async function getDummyDocuments(count = 200): Promise<DocumentItem[]> {
  return seedMore(count);
}

export async function getArchiveOptions() {
  return [
    { id: "1", name: "DOKUMENTASIAPLIKASI" },
    { id: "2", name: "DOKUMENHUMAS" },
    { id: "3", name: "LEGAL" },
  ];
}
