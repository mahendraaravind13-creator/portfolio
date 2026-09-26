import type { Env } from "./env";

const enc = new TextEncoder();
export const SESSION_COOKIE = "__Host-admin_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

// ---------- base64 helpers ----------
export function b64encode(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
export function b64decode(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const b64url = (bytes: Uint8Array) => b64encode(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const b64urlDecode = (s: string) => b64decode(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));

/** Constant-time comparison so response timing never leaks how much of a secret matched. */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

// ---------- password hashing (PBKDF2-SHA256) ----------
// Stored format: pbkdf2-sha256$<iterations>$<salt b64>$<hash b64>
async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iter, saltB64, hashB64] = (stored ?? "").split("$");
  const iterations = Number(iter);
  if (scheme !== "pbkdf2-sha256" || !iterations || !saltB64 || !hashB64) {
    // Still spend the time so a misconfigured hash can't be detected by timing.
    await pbkdf2(password, new Uint8Array(16), 100_000);
    return false;
  }
  const actual = await pbkdf2(password, b64decode(saltB64), Math.min(iterations, 100_000));
  return timingSafeEqual(actual, b64decode(hashB64));
}

// ---------- signed session tokens ----------
async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function createSession(env: Env, user: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(enc.encode(JSON.stringify({ sub: user, iat: now, exp: now + SESSION_TTL_SECONDS })));
  const sig = b64url(await hmac(env.SESSION_SECRET, payload));
  return `${payload}.${sig}`;
}

export async function readSession(env: Env, request: Request): Promise<{ sub: string; exp: number } | null> {
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) return null;
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await hmac(env.SESSION_SECRET, payload);
  if (!timingSafeEqual(expected, b64urlDecode(sig))) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
    if (data.sub !== env.ADMIN_USERNAME) return null; // username changed → old sessions die
    return data;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearedCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
