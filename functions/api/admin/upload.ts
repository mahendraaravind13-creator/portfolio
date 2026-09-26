import type { Data, Env } from "../../_lib/env";
import { error, json } from "../../_lib/http";
import { GitHub, utf8 } from "../../_lib/github";

const LIMITS = { resume: 5 * 1024 * 1024, photo: 3 * 1024 * 1024 };
const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function looksLike(bytes: Uint8Array, kind: "pdf" | "jpg" | "png" | "webp") {
  const s = (n: number) => String.fromCharCode(...bytes.subarray(0, n));
  if (kind === "pdf") return s(5) === "%PDF-";
  if (kind === "jpg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (kind === "png") return bytes[0] === 0x89 && s(4).slice(1) === "PNG";
  return s(4) === "RIFF" && String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP";
}

// Replaces public/resume.pdf or the profile photo with a single commit.
export const onRequestPost: PagesFunction<Env, string, Data> = async (ctx) => {
  let form: FormData;
  try {
    form = await ctx.request.formData();
  } catch {
    return error("Upload failed — please choose a file again.");
  }
  const kind = form.get("kind");
  const file = form.get("file");
  if ((kind !== "resume" && kind !== "photo") || !(file instanceof File)) return error("Choose a file to upload.");
  if (file.size > LIMITS[kind]) return error(`File is too large (max ${LIMITS[kind] / 1024 / 1024} MB).`);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const files: { path: string; bytes: Uint8Array }[] = [];
  const gh = new GitHub(ctx.env);
  const dev = ctx.env.DEV_MODE === "true";

  if (kind === "resume") {
    if (!looksLike(bytes, "pdf")) return error("That file isn't a PDF.");
    files.push({ path: "public/resume.pdf", bytes });
  } else {
    const ext = PHOTO_TYPES[file.type];
    if (!ext || !looksLike(bytes, ext as "jpg" | "png" | "webp")) return error("Photo must be a JPG, PNG or WebP image.");
    const path = `public/photo.${ext}`;
    files.push({ path, bytes });
    // Point the profile at the new file name in the same commit.
    if (!dev) {
      const profileText = await gh.readText("content/profile.json");
      if (profileText) {
        const profile = JSON.parse(profileText);
        if (profile.photo !== `/photo.${ext}`) {
          profile.photo = `/photo.${ext}`;
          files.push({ path: "content/profile.json", bytes: utf8(JSON.stringify(profile, null, 2) + "\n") });
        }
      }
    }
  }

  if (dev) return json({ ok: true, sha: "dev-mode", devMode: true });
  if (!gh.configured) return error(`GitHub saving is not set up yet: ${gh.missing} is missing in Cloudflare. See SETUP.md.`, 500);
  const sha = await gh.commit(files, `content: replace ${kind === "resume" ? "resume PDF" : "profile photo"}\n\nvia admin portal (${ctx.data.user})`);
  return json({ ok: true, sha });
};
