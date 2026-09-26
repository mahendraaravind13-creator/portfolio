import type { Data, Env } from "../../../_lib/env";
import { error, json } from "../../../_lib/http";
import { GitHub, utf8 } from "../../../_lib/github";
import { DEV_CONTENT } from "../../../_lib/devContent";
import { getSection, validateSection } from "../../../../src/lib/schema";

type Ctx = EventContext<Env, "section", Data>;

function sectionFrom(ctx: Ctx) {
  const id = String(ctx.params.section);
  return getSection(id);
}

export const onRequestGet: PagesFunction<Env, "section", Data> = async (ctx) => {
  const section = sectionFrom(ctx);
  if (!section) return error("Unknown section.", 404);
  if (ctx.env.DEV_MODE === "true") return json({ data: DEV_CONTENT[section.file] });

  const gh = new GitHub(ctx.env);
  if (!gh.configured) return error("GitHub is not configured on the server. See SETUP.md.", 500);
  const text = await gh.readText(section.file);
  if (text === null) return json({ data: section.kind === "list" ? [] : {} });
  return json({ data: JSON.parse(text) });
};

export const onRequestPut: PagesFunction<Env, "section", Data> = async (ctx) => {
  const section = sectionFrom(ctx);
  if (!section) return error("Unknown section.", 404);

  let body: { data?: unknown; message?: unknown };
  try {
    body = await ctx.request.json();
  } catch {
    return error("Invalid JSON.");
  }
  const problems = validateSection(section, body.data);
  if (problems.length) return error("Please fix the highlighted problems.", 422, { problems });

  const message = typeof body.message === "string" && body.message.trim() ? body.message.trim().slice(0, 120) : `content: update ${section.label.toLowerCase()}`;
  if (ctx.env.DEV_MODE === "true") return json({ ok: true, sha: "dev-mode", devMode: true });

  const gh = new GitHub(ctx.env);
  if (!gh.configured) return error("GitHub is not configured on the server. See SETUP.md.", 500);
  const sha = await gh.commit([{ path: section.file, bytes: utf8(JSON.stringify(body.data, null, 2) + "\n") }], `${message}\n\nvia admin portal (${ctx.data.user})`);
  return json({ ok: true, sha });
};
