import type { DocumentItem } from "../model/types";

function s(o: Record<string, unknown>, k: string): string | undefined {
  const v = o[k];
  if (v == null) return undefined;
  return typeof v === "string" ? v : String(v);
}

function arrStr(o: Record<string, unknown>, k: string): string[] | undefined {
  const v = o[k];
  if (Array.isArray(v)) return v.map((x) => String(x));
  return undefined;
}

/** Map DTO backend -> model UI tanpa any */
export function mapDocument(dto: unknown): DocumentItem {
  const o = (dto ?? {}) as Record<string, unknown>;
  return {
    id: s(o, "id") ?? "",
    number: s(o, "number") ?? "",
    title: s(o, "title") ?? "",
    description: s(o, "description"),
    documentDate: s(o, "document_date") ?? s(o, "documentDate"),
    expireDate: s(o, "expire_date") ?? s(o, "expireDate"),
    contributors: arrStr(o, "contributors") ?? [],
    archiveId: s(o, "archive_id") ?? s(o, "archiveId"),
    archiveName: s(o, "archive_name") ?? s(o, "archiveName"),
    createdBy: s(o, "created_by") ?? s(o, "createdBy"),
    updatedBy: s(o, "updated_by") ?? s(o, "updatedBy"),
  };
}
