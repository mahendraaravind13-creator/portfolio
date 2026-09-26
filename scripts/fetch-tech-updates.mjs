#!/usr/bin/env node
/**
 * Collects recent tech news from official RSS/Atom feeds and writes content/tech-updates.json.
 * Runs on a schedule in GitHub Actions (.github/workflows/tech-updates.yml) — free, no server.
 *
 * Summaries:
 *  - If GEMINI_API_KEY is set (free tier at https://aistudio.google.com/apikey), each new item gets an
 *    AI summary + "why it matters".
 *  - Otherwise the summary is extracted from the article's own description.
 * Summaries already generated are reused, so the AI is only called for new items.
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
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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

async function aiSummarize(item) {
  const prompt = `You summarise tech news for a busy software engineer. Using only the information given, reply with JSON {"summary": string, "whyItMatters": string}. "summary": 1-2 plain-English sentences on what was announced (max 45 words). "whyItMatters": 1 sentence on why a developer should care (max 30 words). If the text is too thin, base it on the title and say less rather than guessing.

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
  if (!out.summary) throw new Error("empty summary");
  return { summary: String(out.summary).trim(), whyItMatters: String(out.whyItMatters ?? "").trim() };
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
  const items = all
    .sort((a, b) => b.published.localeCompare(a.published))
    .filter((i) => {
      const key = i.title.toLowerCase();
      if (seen.has(i.id) || seen.has(key)) return false;
      seen.add(i.id);
      seen.add(key);
      return true;
    })
    .slice(0, MAX_ITEMS);

  if (!items.length && previous.items.length) {
    console.warn("No items fetched; keeping previous file.");
    return;
  }

  let aiCalls = 0;
  for (const item of items) {
    const prev = prevById.get(item.id);
    if (prev?.aiSummary) {
      Object.assign(item, { summary: prev.summary, whyItMatters: prev.whyItMatters, aiSummary: true });
    } else if (GEMINI_KEY && aiCalls < 25) {
      try {
        Object.assign(item, await aiSummarize(item), { aiSummary: true });
        aiCalls++;
        await new Promise((r) => setTimeout(r, 4500)); // stay inside the free-tier rate limit
      } catch (e) {
        console.warn(`AI summary failed for "${item.title}": ${e.message}`);
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
  console.log(`Wrote ${items.length} items (${aiCalls} new AI summaries).`);
}

await main();
