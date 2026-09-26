#!/usr/bin/env node
/**
 * Collects recent tech news from official RSS/Atom feeds and writes content/tech-updates.json.
 * Runs on a schedule in GitHub Actions (.github/workflows/tech-updates.yml) — free, no server.
 *
 * Reviews:
 *  - Each item can carry a review: importance ("important" | "minor" | "skip"), a plain-English headline
 *    and a one-paragraph explanation. Reviews are kept across runs, and reviewed important/minor items stay
 *    listed until they are MAX_AGE_DAYS old even after they drop out of their feed.
 *  - If GEMINI_API_KEY is set (free tier at https://aistudio.google.com/apikey), new items are reviewed
 *    automatically. Without it they appear as "Just in" headlines with the feed's own snippet.
 *
 * Usage: node scripts/fetch-tech-updates.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { XMLParser } from "fast-xml-parser";

const OUT = new URL("../content/tech-updates.json", import.meta.url);
const SOURCES = JSON.parse(await readFile(new URL("../content/tech-sources.json", import.meta.url), "utf8"));
const MAX_ITEMS = 60;
const MAX_PER_SOURCE = 6;
const MAX_AGE_DAYS = 45;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const MAX_AI_CALLS = 30;
const REVIEW_FIELDS = ["reviewed", "importance", "headline", "paragraph", "aiSummary", "whyItMatters"];

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@", textNodeName: "#text", trimValues: true });

const text = (v) => {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return text(v[0]);
  return text(v["#text"] ?? v["@href"] ?? "");
};

const stripHtml = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, "–")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const BOILERPLATE = [
  /The post .*? appeared first on .*?\.?$/i,
  /\b(Read the full (article|post|story)|Continue reading|Read more)\b.*$/i,
  /\[(…|\.\.\.)\]\s*$/,
];

function extractiveSummary(desc, title) {
  let clean = stripHtml(desc);
  for (const re of BOILERPLATE) clean = clean.replace(re, "").trim();
  if (!clean || clean.toLowerCase() === title.toLowerCase() || clean.length < 25) return "";
  // Split on sentence ends followed by a capital letter, so "Spring AI 2.1.0-M1" isn't cut at "2.1."
  const sentences = clean.split(/(?<=[.!?])\s+(?=[A-Z"“(])/);
  let out = "";
  for (const s of sentences) {
    if (out && (out + " " + s).length > 320) break;
    out = out ? `${out} ${s}` : s;
  }
  if (out.length > 340) out = out.slice(0, 320).replace(/\s+\S*$/, "") + "…";
  return out.trim();
}

function linkOf(entry) {
  if (typeof entry.link === "string") return entry.link;
  const links = Array.isArray(entry.link) ? entry.link : [entry.link];
  const alt = links.find((l) => l && (l["@rel"] === "alternate" || !l["@rel"])) ?? links[0];
  return text(alt?.["@href"] ?? alt);
}

async function fetchFeed(src) {
  const res = await fetch(src.url, {
    headers: { "user-agent": "Mozilla/5.0 (portfolio tech-updates bot; +https://github.com)", accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = parser.parse(await res.text());
  const raw = xml.rss?.channel?.item ?? xml.feed?.entry ?? xml["rdf:RDF"]?.item ?? [];
  const entries = Array.isArray(raw) ? raw : [raw];
  const cutoff = Date.now() - MAX_AGE_DAYS * 86_400_000;
  const future = Date.now() + 86_400_000; // ignore items scheduled for the future (e.g. pre-dated release notes)
  return entries
    .map((e) => {
      const title = stripHtml(text(e.title));
      const url = linkOf(e);
      const date = new Date(text(e.pubDate ?? e.published ?? e.updated ?? e["dc:date"]));
      const desc = text(e.description ?? e.summary ?? e["content:encoded"] ?? e.content);
      return { title, url, date, desc };
    })
    .filter((e) => e.title && /^https?:\/\//.test(e.url) && !Number.isNaN(e.date.getTime()) && e.date.getTime() > cutoff && e.date.getTime() < future)
    .filter((e) => !src.include || new RegExp(src.include, "i").test(`${e.title} ${e.desc}`))
    .sort((a, b) => b.date - a.date)
    .slice(0, MAX_PER_SOURCE)
    .map((e) => ({
      id: createHash("sha1").update(e.url).digest("hex").slice(0, 12),
      title: e.title,
      url: e.url,
      source: src.name,
      category: src.category,
      published: e.date.toISOString(),
      summary: extractiveSummary(e.desc, e.title),
      _desc: stripHtml(e.desc).slice(0, 2000),
    }));
}

async function aiReview(item) {
  const prompt = `You edit the tech-news section of a backend and applied-AI engineer's portfolio. Readers are engineers and recruiters. Using ONLY the text given, reply with JSON {"importance": "important" | "minor" | "skip", "headline": string, "paragraph": string}.

importance:
- "important": a release or change developers would want to know about: a new model, framework, runtime or tool version or GA; a security issue or patch; a breaking or behaviour change; a notable new platform capability; or an engineering deep-dive with concrete lessons.
- "minor": real but niche or incremental.
- "skip": marketing or customer case studies, event recaps, podcasts, translations, hiring or people news, generic roundups.

headline: plain English, max 90 characters, says what happened; keep product names and versions.
paragraph: for "important", 70-110 words: first sentence says concretely what happened, then the specific new details (use the text's numbers), then who should care or what to do. For "minor", one sentence of at most 30 words. For "skip", an empty string.
Style: no hype words (revolutionary, game-changer, exciting, powerful, seamless), no marketing tone, don't start with "The", briefly explain jargon. Never invent versions, dates or features; if the text is thin, say less.

Title: ${item.title}
Source: ${item.source}
Text: ${item._desc || "(no description)"}`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  const out = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}");
  const importance = ["important", "minor", "skip"].includes(out.importance) ? out.importance : null;
  if (!importance) throw new Error("no importance in reply");
  const paragraph = String(out.paragraph ?? "").trim();
  if (importance !== "skip" && !paragraph) throw new Error("empty paragraph");
  return { reviewed: true, aiSummary: true, importance, headline: String(out.headline ?? "").trim() || item.title, ...(paragraph ? { paragraph } : {}) };
}

async function main() {
  let previous = { items: [] };
  try {
    previous = JSON.parse(await readFile(OUT, "utf8"));
  } catch {}
  const prevById = new Map(previous.items.map((i) => [i.id, i]));

  const results = await Promise.allSettled(SOURCES.map(fetchFeed));
  const all = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(`✓ ${SOURCES[i].name}: ${r.value.length}`);
      all.push(...r.value);
    } else {
      console.warn(`✗ ${SOURCES[i].name}: ${r.reason?.message ?? r.reason}`);
    }
  });

  // De-duplicate (same URL or same title), newest first.
  const seen = new Set();
  const fresh = all
    .sort((a, b) => b.published.localeCompare(a.published))
    .filter((i) => {
      const key = i.title.toLowerCase();
      if (seen.has(i.id) || seen.has(key)) return false;
      seen.add(i.id);
      seen.add(key);
      return true;
    });

  if (!fresh.length && previous.items.length) {
    console.warn("No items fetched; keeping previous file.");
    return;
  }

  // Carry reviews over, so an article is only ever reviewed once.
  for (const item of fresh) {
    const prev = prevById.get(item.id);
    if (prev) for (const k of REVIEW_FIELDS) if (prev[k] !== undefined) item[k] = prev[k];
  }

  // Reviewed important/minor items stay listed until they age out, even after leaving their feed's latest entries.
  const cutoff = Date.now() - MAX_AGE_DAYS * 86_400_000;
  const isKeeper = (i) => i.reviewed && i.importance !== "skip";
  const dropped = previous.items.filter((p) => isKeeper(p) && !seen.has(p.id) && !seen.has(p.title.toLowerCase()) && Date.parse(p.published) > cutoff);
  const keepers = [...fresh.filter(isKeeper), ...dropped].sort((a, b) => b.published.localeCompare(a.published)).slice(0, MAX_ITEMS * 2);
  const others = fresh.filter((i) => !isKeeper(i)).slice(0, Math.max(0, MAX_ITEMS - keepers.length));
  const items = [...keepers, ...others].sort((a, b) => b.published.localeCompare(a.published));

  let aiCalls = 0;
  for (const item of items) {
    if (!item.reviewed && GEMINI_KEY && aiCalls < MAX_AI_CALLS) {
      try {
        Object.assign(item, await aiReview(item));
        aiCalls++;
        await new Promise((r) => setTimeout(r, 4500)); // stay inside the free-tier rate limit
      } catch (e) {
        console.warn(`AI review failed for "${item.title}": ${e.message}`);
      }
    }
    delete item._desc;
  }

  const unchanged = JSON.stringify(items) === JSON.stringify(previous.items);
  if (unchanged) {
    console.log("No changes.");
    return;
  }
  await writeFile(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2) + "\n");
  console.log(`Wrote ${items.length} items (${aiCalls} new AI reviews).`);
}

await main();
