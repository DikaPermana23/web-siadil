// src/domain/documents/api/index.ts
import { http } from "@/lib/http";
import type { DocumentItem, ListMeta } from "../model/types";

export async function listDocuments(params: { page?: number; q?: string; sort?: string }) {
  return http.get<{ items: DocumentItem[]; meta: ListMeta }>("/documents", params);
}
export async function getDocument(id: string) { return http.get<DocumentItem>(`/documents/${id}`); }
export async function createDocument(input: Partial<DocumentItem>) { return http.post<DocumentItem>("/documents", input); }
export async function updateDocument(id: string, input: Partial<DocumentItem>) { return http.put<DocumentItem>(`/documents/${id}`, input); }
export async function deleteDocument(id: string) { return http.delete<void>(`/documents/${id}`); }
