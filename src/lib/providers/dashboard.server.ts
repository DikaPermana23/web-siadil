import { query, queryOne } from "@/lib/mysql";
import type { DashboardData, Reminder, ReminderSeverity } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  // 👉 ambil user aktif (ubah WHERE sesuai auth kamu)
  const user =
    (await queryOne<{ id: string; name: string; employeeNo: string }>(
      `SELECT id, name, employee_no AS employeeNo
       FROM users
       ORDER BY id ASC
       LIMIT 1`
    )) ?? { id: "0", name: "Personal", employeeNo: "1990123" };

  // total dokumen
  const total = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM documents`
  );

  // dokumen terakhir diupdate
  const lastDoc = await queryOne<{ updatedAt: string }>(
    `SELECT DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') AS updatedAt
     FROM documents
     ORDER BY updated_at DESC
     LIMIT 1`
  );

  // 1 kartu archive paling baru
  const archives = await query<{ id: string; name: string; alias: string | null }>(
    `SELECT id, name, alias
     FROM archives
     ORDER BY updated_at DESC
     LIMIT 1`
  );

  // reminders (urut: danger > warn > due_date asc)
  const remindersRows = await query<{
    id: string;
    severity: string;
    title: string;
    subtitle: string | null;
    desc: string | null;
  }>(
    `SELECT id, severity, title, subtitle, description AS desc
     FROM reminders
     ORDER BY
       CASE WHEN severity='danger' THEN 1
            WHEN severity='warn'   THEN 2
            ELSE 3 END,
       due_date ASC
     LIMIT 10`
  );

  const reminders: Reminder[] = remindersRows.map((r): Reminder => {
    const sev: ReminderSeverity =
      r.severity === "danger"
        ? "danger"
        : r.severity === "warn"
        ? "warn"
        : r.severity === "success"
        ? "success"
        : "info";

    return {
      id: r.id,
      severity: sev,
      title: r.title,
      subtitle: r.subtitle ?? null,
      desc: r.desc ?? null,
    };
  });

  return {
    user,
    totalDocs: total?.total ?? 0,
    lastUpdated: lastDoc?.updatedAt ?? null,
    archives,
    reminders,
  };
}
