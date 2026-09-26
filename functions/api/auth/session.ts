import type { Env } from "../../_lib/env";
import { readSession } from "../../_lib/auth";
import { error, json } from "../../_lib/http";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const session = await readSession(env, request);
  if (!session) return error("Not signed in.", 401);
  return json({
    user: session.sub,
    expiresAt: new Date(session.exp * 1000).toISOString(),
    devMode: env.DEV_MODE === "true",
    repo: env.GITHUB_REPO ?? "",
  });
};
