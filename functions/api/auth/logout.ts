import type { Env } from "../../_lib/env";
import { clearedCookie } from "../../_lib/auth";
import { error, isSameOrigin, json } from "../../_lib/http";

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  if (!isSameOrigin(request)) return error("Invalid request origin.", 403);
  return json({ ok: true }, 200, { "set-cookie": clearedCookie() });
};
