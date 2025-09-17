import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  return {
    user: { id: "0", name: "Personal", employeeNo: "1990123" },
    totalDocs: 709,
    lastUpdated: new Date().toISOString(),
    archives: [{ id: "a1", name: "Teknologi Informasi & Komunikasi", alias: "TIK" }],
    reminders: [
      { id: "r1", severity: "danger", title: "SSL", subtitle: "pupuk-kujang.co.id (Non GCP)", desc: "This document is expired 2 month 11 days" },
      { id: "r2", severity: "warn",   title: "SSL", subtitle: "pupuk-kujang.co.id (Non GCP)", desc: "This document is expired 2 month 11 days" }
    ]
  };
}
