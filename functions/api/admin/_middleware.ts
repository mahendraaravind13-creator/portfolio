import type { Data, Env } from "../../_lib/env";
import { readSession } from "../../_lib/auth";
import { error, isSameOrigin } from "../../_lib/http";
import { GitHubError } from "../../_lib/github";

// Guards every /api/admin/* route: valid session required, and writes must come from this site.
export const onRequest: PagesFunction<Env, string, Data> = async (ctx) => {
  const session = await readSession(ctx.env, ctx.request);
  if (!session) return error("Your session has expired. Please sign in again.", 401);
  if (ctx.request.method !== "GET" && !isSameOrigin(ctx.request)) return error("Invalid request origin.", 403);
  ctx.data.user = session.sub;
  try {
    return await ctx.next();
  } catch (e) {
    console.error(e);
    if (e instanceof GitHubError && (e.status === 401 || e.status === 403)) {
      return error("The GitHub token has expired or lost access. Create a new one and update GITHUB_TOKEN (SETUP.md → Renew the GitHub token).", 502);
    }
    if (e instanceof GitHubError && e.status === 409) {
      return error("Another change was saved at the same moment. Reload the section and try again.", 409);
    }
    return error("Something went wrong on the server. Please try again.", 500);
  }
};
