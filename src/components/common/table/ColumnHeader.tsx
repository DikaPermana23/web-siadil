"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ColumnHeader({ field, children }: { field: string; children: React.ReactNode }) {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort") || ""; // e.g. "title:asc"
  const [f, dir] = sort.split(":");
  const active = f === field;
  const nextDir = !active ? "asc" : dir === "asc" ? "desc" : "asc";
  const icon = !active ? "↕" : dir === "asc" ? "↑" : "↓";

  const onClick = () => {
    const sp = new URLSearchParams(params);
    sp.set("sort", `${field}:${nextDir}`);
    router.push(`?${sp.toString()}`);
  };

  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 font-semibold text-left">
      <span>{children}</span>
      <span className="text-neutral-400">{icon}</span>
    </button>
  );
}
