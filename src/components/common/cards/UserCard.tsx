import React from "react";
import CardShell from "@/components/common/cards/CardShell";
import { type DashboardData } from "@/types/dashboard";

const BRAND = "#017938";
const ICON_SM = "h-4 w-4";

export default function UserCard({ user }: { user: DashboardData["user"] }) {
  const name = user?.name ?? "—";
  const emp = user?.employeeNo ?? "—";
  const dept = user?.department ?? "—";

  return (
    <CardShell>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 rounded-full" style={{ backgroundColor: "#eef5f0" }}>
            <div className="absolute inset-0 m-auto flex items-center justify-center" style={{ color: BRAND }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="truncate font-semibold">{name}</div>
              <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: "#e6f3ea", color: BRAND }}>
                <svg viewBox="0 0 24 24" className={ICON_SM} aria-hidden="true">
                  <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 0 1 6 0v3z" fill="currentColor" />
                </svg>
                Personal
              </span>
            </div>

            <div className="mt-0.5 grid grid-cols-2 gap-x-4 text-xs text-neutral-500">
              <div className="truncate">
                ID: <span className="text-neutral-700">{emp}</span>
              </div>
              <div className="truncate">
                Dept: <span className="text-neutral-700">{dept}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}