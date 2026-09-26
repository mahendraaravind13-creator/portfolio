import type { Data, Env } from "../../_lib/env";
import { error, json } from "../../_lib/http";
import { GitHub } from "../../_lib/github";

export const onRequestGet: PagesFunction<Env, string, Data> = async ({ env }) => {
  if (env.DEV_MODE === "true") {
    return json({ commits: [{ sha: "0000000", message: "Local preview — history appears once deployed", author: "you", date: new Date().toISOString() }] });
  }
  const gh = new GitHub(env);
  if (!gh.configured) return error(`GitHub saving is not set up yet: ${gh.missing} is missing in Cloudflare. See SETUP.md.`, 500);
  const commits = await gh.history(["content", "public/resume.pdf", "public/photo.jpg"]);
  return json({ commits });
};
