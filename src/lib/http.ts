import { API_URL } from "./env";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

function toQuery(params?: QueryParams) {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function request<T>(method: string, path: string, body?: unknown, params?: QueryParams): Promise<T> {
  const res = await fetch(`${API_URL}${path}${toQuery(params)}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const http = {
  get:    <T>(path: string, params?: QueryParams) => request<T>("GET", path, undefined, params),
  post:   <T>(path: string, body?: unknown)       => request<T>("POST", path, body),
  put:    <T>(path: string, body?: unknown)       => request<T>("PUT", path, body),
  delete: <T>(path: string)                        => request<T>("DELETE", path),
};
