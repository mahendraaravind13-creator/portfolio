"use client";

// Browser-side client for the admin API (functions/api/*). The session lives in an HttpOnly cookie,
// so there is no token to handle here — the browser sends it automatically.

export class ApiError extends Error {
  constructor(message: string, public status: number, public problems: string[] = []) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin", cache: "no-store", ...init });
  let body: Record<string, unknown> = {};
  try {
    body = await res.json();
  } catch {}
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith("/api/auth/")) {
      window.location.href = "/admin/login/?expired=1";
    }
    throw new ApiError(String(body.error ?? `Request failed (${res.status})`), res.status, (body.problems as string[]) ?? []);
  }
  return body as T;
}

const jsonInit = (method: string, data: unknown): RequestInit => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(data),
});

export type Session = { user: string; expiresAt: string; devMode: boolean; repo: string };
export type Commit = { sha: string; message: string; author: string; date: string };
export type SaveResult = { ok: true; sha: string; devMode?: boolean };

export const api = {
  login: (username: string, password: string) => request<{ ok: true }>("/api/auth/login", jsonInit("POST", { username, password })),
  logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  session: () => request<Session>("/api/auth/session"),
  getContent: <T,>(section: string) => request<{ data: T }>(`/api/admin/content/${section}`),
  saveContent: (section: string, data: unknown, message?: string) => request<SaveResult>(`/api/admin/content/${section}`, jsonInit("PUT", { data, message })),
  upload: (kind: "resume" | "photo", file: File) => {
    const form = new FormData();
    form.append("kind", kind);
    form.append("file", file);
    return request<SaveResult>("/api/admin/upload", { method: "POST", body: form });
  },
  history: () => request<{ commits: Commit[] }>("/api/admin/history"),
  restore: (sha: string) => request<SaveResult>("/api/admin/restore", jsonInit("POST", { sha })),
};

/** Resolves when the public site has been rebuilt with `sha` (Cloudflare writes it to /version.json). */
export async function waitForDeploy(sha: string, onTick?: (seconds: number) => void, timeoutMs = 6 * 60_000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
      const v = await res.json();
      if (typeof v.sha === "string" && (v.sha.startsWith(sha) || sha.startsWith(v.sha))) return true;
    } catch {}
    onTick?.(Math.round((Date.now() - start) / 1000));
    await new Promise((r) => setTimeout(r, 8000));
  }
  return false;
}
