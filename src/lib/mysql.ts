import mysql from "mysql2/promise";

/**
 * Global pool biar tidak bikin koneksi baru setiap kali hot reload
 */
type GlobalWithPool = typeof globalThis & { __mysqlPool?: mysql.Pool };
const g = globalThis as GlobalWithPool;

const host = (process.env.MYSQL_HOST ?? "127.0.0.1").trim();
const port = Number(process.env.MYSQL_PORT ?? 3306);
const user = (process.env.MYSQL_USER ?? "root").trim();
const db   = (process.env.MYSQL_DATABASE ?? "siadil").trim();
const raw  = (process.env.MYSQL_PASSWORD ?? "").trim();

/**
 * Kalau password kosong / null / undefined / tanda kutip → treat sebagai undefined
 * Supaya driver connect dengan "using password: NO"
 */
const password =
  raw === "" ||
  raw === "''" ||
  raw === '""' ||
  raw.toLowerCase() === "null" ||
  raw.toLowerCase() === "undefined"
    ? undefined
    : raw;

if (!host || !user || !db) {
  throw new Error("Missing DB env: MYSQL_HOST / MYSQL_USER / MYSQL_DATABASE");
}

if (process.env.DEBUG_DB === "1") {
  // log sekali, tanpa password
  // eslint-disable-next-line no-console
  console.log("[DB] connecting", {
    host,
    port,
    user,
    db,
    hasPassword: Boolean(password),
  });
}

export const pool =
  g.__mysqlPool ??
  mysql.createPool({
    host,
    port,
    user,
    password, // kalau undefined → mysql2 tidak kirim password
    database: db,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

if (process.env.NODE_ENV !== "production") g.__mysqlPool = pool;

type Row = Record<string, unknown>;

export async function query<T extends Row = Row>(
  sql: string,
  params: ReadonlyArray<unknown> = []
): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T extends Row = Row>(
  sql: string,
  params: ReadonlyArray<unknown> = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length ? rows[0] : null;
}
