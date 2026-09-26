import type { Env } from "../../_lib/env";
import { createSession, sessionCookie, timingSafeEqual, verifyPassword } from "../../_lib/auth";
import { clientIp, error, isSameOrigin, json } from "../../_lib/http";

const MAX_FAILURES = 5;
const LOCKOUT_SECONDS = 15 * 60;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return error("Invalid request origin.", 403);
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD_HASH || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
    return error("Admin login is not configured on the server yet. See SETUP.md.", 500);
  }

  const ip = clientIp(request);
  const kvKey = `login-fail:${ip}`;
  const failures = Number((await env.LOGIN_KV?.get(kvKey)) ?? 0);
  if (failures >= MAX_FAILURES) {
    return error("Too many failed attempts. Try again in 15 minutes.", 429);
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return error("Invalid request.");
  }
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password || password.length > 256) return error("Enter your username and password.");

  const enc = new TextEncoder();
  const userOk = timingSafeEqual(enc.encode(username), enc.encode(env.ADMIN_USERNAME));
  const passOk = await verifyPassword(password, env.ADMIN_PASSWORD_HASH); // always runs, even if the username is wrong

  if (!userOk || !passOk) {
    await env.LOGIN_KV?.put(kvKey, String(failures + 1), { expirationTtl: LOCKOUT_SECONDS });
    await new Promise((r) => setTimeout(r, 400));
    const left = MAX_FAILURES - failures - 1;
    return error(env.LOGIN_KV && left > 0 ? `Wrong username or password. ${left} attempt${left === 1 ? "" : "s"} left.` : "Wrong username or password.", 401);
  }

  await env.LOGIN_KV?.delete(kvKey);
  const token = await createSession(env, env.ADMIN_USERNAME);
  return json({ ok: true, user: env.ADMIN_USERNAME }, 200, { "set-cookie": sessionCookie(token) });
};
