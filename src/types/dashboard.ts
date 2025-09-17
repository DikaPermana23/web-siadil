// src/types/dashboard.ts
import type { Route } from "next";

export type ReminderSeverity = "info" | "warn" | "danger" | "success";

export type UserSummary = {
  id: string;
  name: string;
  employeeNo?: string;
  department?: string;
};

export type Archive = {
  id: string;
  name: string;
  alias?: string | null; // ✅ DB bisa null
};

export type Reminder = {
  id: string;
  severity: ReminderSeverity;
  title: string;
  subtitle?: string | null;   // ✅ DB bisa null
  desc?: string | null;       // ✅ DB bisa null
  url?: Route;
  daysLeft?: number;
};

export type DashboardData = {
  user: UserSummary;
  totalDocs: number;
  lastUpdated?: string | null; // ✅ DB bisa null
  archives: Archive[];
  reminders: Reminder[];
};
