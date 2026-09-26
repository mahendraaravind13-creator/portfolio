import type { Data, Env } from "../../_lib/env";
import { error, json } from "../../_lib/http";
import { GitHub, utf8 } from "../../_lib/github";
import { SECTIONS } from "../../../src/lib/schema";

// Restores every content section to how it was at a past commit, as a NEW commit (nothing is lost).
export const onRequestPost: PagesFunction<Env, string, Data> = async (ctx) => {
  let body: { sha?: unknown };
  try {
    body = await ctx.request.json();
  } catch {
    return error("Invalid request.");
  }
  const sha = typeof body.sha === "string" ? body.sha : "";
  if (!/^[0-9a-f]{7,40}$/i.test(sha)) return error("Invalid version.");
  if (ctx.env.DEV_MODE === "true") return json({ ok: true, sha: "dev-mode", devMode: true });

  const gh = new GitHub(ctx.env);
  if (!gh.configured) return error("GitHub is not configured on the server. See SETUP.md.", 500);
  const files: { path: string; bytes: Uint8Array }[] = [];
  for (const s of SECTIONS) {
    const text = await gh.readText(s.file, sha);
    if (text !== null) files.push({ path: s.file, bytes: utf8(text) });
  }
  if (!files.length) return error("That version has no content to restore.", 404);
  const newSha = await gh.commit(files, `content: restore version ${sha.slice(0, 7)}\n\nvia admin portal (${ctx.data.user})`);
  return json({ ok: true, sha: newSha });
};
