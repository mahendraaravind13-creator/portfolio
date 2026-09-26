"use client";

// Reads the TECHNICAL SKILLS section out of a resume PDF (in the browser, with pdf.js) and
// compares it with the site's current skills, so the admin can review and apply the changes.

export type SkillGroup = { group: string; items: string[] };
export type SkillDiff = {
  group: string;
  isNew: boolean;
  added: string[];
  removed: string[];
  items: string[];
};

const SECTION_END = /^(PROJECTS|EXPERIENCE|EDUCATION|CERTIFICATIONS|ACHIEVEMENTS|WORK EXPERIENCE|PUBLICATIONS)\b/i;
const HEADING = /^(technical\s+)?skills$/i;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

type Item = { str: string; x: number; end: number; y: number };
type Line = { y: number; items: Item[] };

/** Text items of every page, grouped into visual lines (top to bottom, left to right). */
async function pdfLines(file: { arrayBuffer(): Promise<ArrayBuffer> }): Promise<Line[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const lines: Line[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const content = await (await doc.getPage(p)).getTextContent();
    for (const it of content.items) {
      if (!("str" in it) || !it.str.trim()) continue;
      const item = { str: it.str, x: it.transform[4], end: it.transform[4] + it.width, y: it.transform[5] - p * 10000 };
      const line = lines.find((l) => Math.abs(l.y - item.y) <= 2);
      if (line) line.items.push(item);
      else lines.push({ y: item.y, items: [item] });
    }
  }
  lines.sort((a, b) => b.y - a.y);
  for (const l of lines) l.items.sort((a, b) => a.x - b.x);
  return lines;
}

/** Joins text items, adding a space only where there is a visible gap. */
function join(items: Item[]): string {
  let out = "";
  let prevEnd = -Infinity;
  for (const it of items) {
    if (out && it.x - prevEnd > 1.5 && !out.endsWith(" ") && !it.str.startsWith(" ")) out += " ";
    out += it.str;
    prevEnd = it.end;
  }
  return out.replace(/\s+/g, " ").trim();
}

function splitItems(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function titleCase(label: string) {
  return label
    .split(/(\s+|\/)/)
    .map((w) => (/^[A-Z]{1,3}$/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase()))
    .join("");
}

/** Extracts skill groups from the resume PDF. Throws if no TECHNICAL SKILLS section is found. */
export async function extractSkills(file: { arrayBuffer(): Promise<ArrayBuffer> }): Promise<SkillGroup[]> {
  const lines = await pdfLines(file);
  const start = lines.findIndex((l) => HEADING.test(join(l.items)));
  if (start < 0) throw new Error("Couldn't find a “Technical Skills” section in this PDF.");

  const section: Line[] = [];
  for (const line of lines.slice(start + 1)) {
    if (SECTION_END.test(join(line.items))) break;
    section.push(line);
  }
  if (!section.length) throw new Error("The skills section in this PDF is empty.");

  // Two-column layout: labels on the left, skills from a fixed x on the right.
  // The skills column starts at the leftmost mixed-case text that is clearly indented from the labels.
  const minX = Math.min(...section.flatMap((l) => l.items.map((i) => i.x)));
  const indented = section.flatMap((l) => l.items).filter((i) => /[a-z]/.test(i.str) && i.x > minX + 20);
  const contentX = indented.length ? Math.min(...indented.map((i) => i.x)) - 2 : Infinity;

  const groups: { label: string; text: string }[] = [];
  for (const line of section) {
    let label = join(line.items.filter((i) => i.x < contentX));
    let text = join(line.items.filter((i) => i.x >= contentX));
    if (contentX === Infinity) {
      // Single-column fallback: "LABEL: skill, skill" or "LABEL skill, skill".
      const m = join(line.items).match(/^([A-Z][A-Z0-9 &/+.-]*[A-Z0-9])\s*:?\s+(.*)$/);
      label = m?.[1] ?? "";
      text = m?.[2] ?? join(line.items);
    }
    label = label.replace(/:$/, "").trim();
    if (label && !/[a-z]/.test(label)) groups.push({ label, text });
    else if (groups.length && text) groups[groups.length - 1].text += " " + text; // wrapped row
  }
  if (!groups.length) throw new Error("Found the skills heading but couldn't read any skill rows.");
  return groups.map((g) => ({ group: titleCase(g.label), items: splitItems(g.text) })).filter((g) => g.items.length);
}

/** Compares resume skills with the current site skills. Existing group names and order are kept. */
export function diffSkills(current: SkillGroup[], fromResume: SkillGroup[]): { next: SkillGroup[]; changes: SkillDiff[] } {
  const next: SkillGroup[] = current.map((g) => ({ ...g, items: [...g.items] }));
  const changes: SkillDiff[] = [];
  for (const r of fromResume) {
    const existing = next.find((g) => norm(g.group) === norm(r.group));
    if (existing) {
      const have = new Set(existing.items.map(norm));
      const want = new Set(r.items.map(norm));
      const added = r.items.filter((i) => !have.has(norm(i)));
      const removed = existing.items.filter((i) => !want.has(norm(i)));
      if (added.length || removed.length) {
        existing.items = r.items;
        changes.push({ group: existing.group, isNew: false, added, removed, items: r.items });
      }
    } else {
      next.push({ group: r.group, items: r.items });
      changes.push({ group: r.group, isNew: true, added: r.items, removed: [], items: r.items });
    }
  }
  return { next, changes };
}
