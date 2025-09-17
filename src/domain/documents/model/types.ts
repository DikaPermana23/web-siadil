// src/domain/documents/model/types.ts  (final)
export type ArchiveOption = {
  id: string | number;
  name: string;
  alias?: string | null;
  slug?: string | null;
};

export type PaginationMeta = { page: number; totalPages: number };

export type DocumentItem = {
  id: string;
  number: string;
  title: string;
  description?: string;
  documentDate?: string;
  expireDate?: string;
  contributors?: string[];
  archiveId?: string;
  archiveName?: string;
  createdBy?: string;
  updatedBy?: string;
};

export type ListMeta = { page: number; totalPages: number; totalItems?: number };
