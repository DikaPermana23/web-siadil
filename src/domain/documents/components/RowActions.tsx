// src/domain/documents/components/RowActions.tsx
"use client";
export default function RowActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onEdit} className="px-2 py-1 border rounded text-xs">Edit</button>
      <button onClick={onDelete} className="px-2 py-1 border rounded text-xs text-red-600">Delete</button>
    </div>
  );
}
