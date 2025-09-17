// src/components/dashboard/CreateArchiveCard.tsx
"use client";

import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";

const ICON_LG = "h-6 w-6 md:h-7 md:w-7"; // ikon diperbesar
const BRAND = "#017938";

type ParentFolder = { id: string; name: string; path?: string };

export default function CreateArchiveCard({
  parents = [],
  onCreated,
}: {
  parents?: ParentFolder[];
  // parentId kini opsional
  onCreated?: (payload: { name: string; subtitle?: string; parentId?: string }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [parentId, setParentId] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  // Sekarang cukup butuh nama saja
  const canSave = !!name.trim();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const payload: { name: string; subtitle?: string; parentId?: string } = {
        name: name.trim(),
        ...(subtitle.trim() ? { subtitle: subtitle.trim() } : {}),
        ...(parentId ? { parentId } : {}), // hanya kirim kalau diisi
      };

      const res = await fetch("/api/archives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Gagal (${res.status})`);

      setOk("Folder berhasil dibuat.");
      setName("");
      setSubtitle("");
      setParentId("");
      onCreated?.(payload);
      // opsional kalau mau auto-close:
      // setOpen(false);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan tak terduga.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Kartu hijau brand — glossy diturunkan & agak dipergelap */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative w-full overflow-hidden rounded-lg p-4 text-left text-white shadow transition-transform hover:-translate-y-0.5"
        style={{ background: `linear-gradient(135deg, ${BRAND}, #015d2b)` }}
        aria-label="Buka form buat folder arsip"
      >
        {/* Wrapper ikon: gloss rendah, ikon diperbesar */}
        <div className="absolute left-3 top-3 rounded-md border border-white/10 bg-white/5 p-2">
          <FontAwesomeIcon icon={faFolderPlus} className={ICON_LG} />
        </div>

        <div className="mt-10 space-y-1">
          <div className="text-sm/5 opacity-90">Create New Archives</div>
          <div className="text-xs/5 opacity-80">Folder Baru</div>
        </div>

        {/* Lapisan gloss bawah: lebih gelap & tipis */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 rounded-b-lg bg-black/25 mix-blend-multiply" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="create-archive-title">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl">
              <div className="border-b p-4">
                <h3 id="create-archive-title" className="text-base font-semibold">
                  Buat Folder Arsip
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Isi nama &amp; (opsional) pilih folder induk untuk menyimpan sebagai subfolder.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4 p-4">
                {/* Nama folder */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">Nama Folder</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#017938]/40"
                    placeholder="Misal: Kontrak 2025"
                    autoFocus
                    required
                  />
                </div>

                {/* Sub Judul */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">
                    Sub Judul <span className="font-normal text-neutral-400">(opsional)</span>
                  </label>
                  <input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#017938]/40"
                    placeholder="Misal: Dokumen kontrak departemen TI"
                  />
                </div>

                {/* Folder Induk (opsional) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Folder Induk <span className="font-normal text-neutral-400">(opsional)</span>
                  </label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#017938]/40"
                    aria-describedby="parent-help"
                  >
                    <option value="">— Tanpa folder induk (root) —</option>
                    {parents.length > 0 ? (
                      parents.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.path ? `${p.path}/${p.name}` : p.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>(Belum ada folder yang bisa dipilih)</option>
                    )}
                  </select>
                  <p id="parent-help" className="mt-1 text-xs text-neutral-500">
                    Biarkan kosong untuk menyimpan di root. Pilih salah satu jika ingin membuat sebagai subfolder.
                  </p>
                </div>

                {err && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert" aria-live="polite">
                    {err}
                  </div>
                )}
                {ok && (
                  <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700" role="status" aria-live="polite">
                    {ok}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="h-9 rounded-md border px-4 text-sm">
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !canSave}
                    className="h-9 rounded-md px-4 text-sm text-white disabled:opacity-60"
                    style={{ background: BRAND }}
                  >
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
