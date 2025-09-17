// "use client";

// import { useEffect, useRef, useState } from "react";

// type ArchiveRecord = {
//   id: string;
//   name: string;
//   parentId: string | null;
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onCreated?: (rec?: ArchiveRecord) => void;
//   parentOptions?: Array<{ id: string; name: string }>;
// };

// export default function CreateArchiveModal({ open, onClose, onCreated, parentOptions = [] }: Props) {
//   const [name, setName] = useState("");
//   const [parentId, setParentId] = useState<string | "">("");
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [onClose]);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setErr(null);
//     if (!name.trim()) {
//       setErr("Nama folder wajib diisi.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch("/api/archives", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: name.trim(), parentId: parentId || null }),
//       });
//       if (!res.ok) throw new Error(`Gagal menyimpan (status ${res.status}).`);
//       const json = (await res.json()) as ArchiveRecord;
//       onCreated?.(json);
//       onClose();
//     } catch (e: unknown) {
//       const msg = e instanceof Error ? e.message : "Terjadi kesalahan saat menyimpan.";
//       setErr(msg);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//       <div
//         ref={ref}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="create-archive-title"
//         className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl border"
//       >
//         <div className="flex items-center justify-between">
//           <h3 id="create-archive-title" className="text-lg font-semibold">Create New Archive</h3>
//           <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100" aria-label="Close">✕</button>
//         </div>

//         <form onSubmit={submit} className="mt-4 space-y-4">
//           <div>
//             <label className="text-sm font-medium">Folder Name<span className="text-rose-600">*</span></label>
//             <input
//               className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
//               value={name}
//               onChange={e => setName(e.target.value)}
//               placeholder="cth: Kontrak Vendor 2025"
//               autoFocus
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Parent Folder (opsional)</label>
//             <select
//               className="mt-1 w-full rounded-lg border px-3 py-2 outline-none bg-white focus:ring-2 focus:ring-emerald-500"
//               value={parentId}
//               onChange={e => setParentId(e.target.value)}
//             >
//               <option value="">(Root)</option>
//               {parentOptions.map(p => (
//                 <option key={p.id} value={p.id}>{p.name}</option>
//               ))}
//             </select>
//           </div>

//           {err && <p className="text-sm text-rose-600">{err}</p>}

//           <div className="flex justify-end gap-2 pt-2">
//             <button type="button" onClick={onClose} className="h-9 rounded-lg border px-4">Batal</button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="h-9 rounded-lg bg-emerald-600 text-white px-4 font-semibold disabled:opacity-50"
//             >
//               {loading ? "Menyimpan..." : "Simpan"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
