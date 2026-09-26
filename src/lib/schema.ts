/**
 * Single source of truth for every admin-editable content section.
 * Used by the admin forms (to render fields) and by the API (to validate before committing).
 * Keep this file free of React/Next imports so the Cloudflare functions can bundle it.
 *
 * To add a new section: create content/<name>.json, add an entry to SECTIONS, and render it on the site.
 */

export type Field =
  | { key: string; label: string; type: "text" | "textarea" | "url" | "email"; required?: boolean; help?: string; placeholder?: string }
  | { key: string; label: string; type: "boolean"; help?: string }
  | { key: string; label: string; type: "list"; help?: string; placeholder?: string; /** short items shown as removable tags */ chips?: boolean }
  | { key: string; label: string; type: "objectList"; fields: Field[]; itemTitle: string; help?: string; addLabel?: string }
  | { key: string; label: string; type: "object"; fields: Field[]; help?: string };

export type Section = {
  id: string;
  label: string;
  file: string;
  description: string;
  /** "object": the file holds one object. "list": the file holds an array of items. */
  kind: "object" | "list";
  fields: Field[];
  /** For lists: which field names each item in the sidebar/cards. */
  itemTitle?: string;
  addLabel?: string;
};

const linkFields: Field[] = [
  { key: "github", label: "GitHub URL", type: "url" },
  { key: "linkedin", label: "LinkedIn URL", type: "url" },
  { key: "leetcode", label: "LeetCode URL", type: "url" },
];

export const SECTIONS: Section[] = [
  {
    id: "profile",
    label: "Profile",
    file: "content/profile.json",
    description: "Your name, headline, contact details, About text and the \"By the numbers\" list on the home page.",
    kind: "object",
    fields: [
      { key: "name", label: "Full name", type: "text", required: true },
      { key: "shortName", label: "Short name", type: "text", required: true, help: "Used in the header and page titles." },
      { key: "initials", label: "Initials", type: "text", required: true },
      { key: "title", label: "Headline", type: "text", required: true, placeholder: "Full-Stack Engineer · Applied AI Systems" },
      { key: "tagline", label: "One-line pitch", type: "textarea", required: true },
      { key: "heroHeadline", label: "Big headline (first line)", type: "text", help: "The giant poster text at the top of the home page. Keep it short.", placeholder: "Backends that hold up." },
      { key: "heroAccent", label: "Big headline (second line, in colour)", type: "text", placeholder: "AI that shows its sources." },
      { key: "education", label: "Education (short)", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "openToWork", label: "Show 'open to work' badge", type: "boolean" },
      { key: "openToWorkLabel", label: "Badge text", type: "text", placeholder: "Open to SDE roles" },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "text" },
      { key: "showPhone", label: "Show phone number publicly", type: "boolean", help: "Off by default to avoid spam calls." },
      { key: "links", label: "Profile links", type: "object", fields: linkFields },
      { key: "about", label: "About (one paragraph per line)", type: "list" },
      { key: "lookingFor", label: "What you're looking for", type: "textarea" },
      {
        key: "highlights",
        label: "Highlight numbers",
        type: "objectList",
        itemTitle: "label",
        addLabel: "Add highlight",
        fields: [
          { key: "value", label: "Number", type: "text", required: true, placeholder: "240×" },
          { key: "label", label: "What it means", type: "textarea", required: true, help: "A plain sentence that reads on from the number, e.g. \"requests still answered after I switched off one server.\"" },
          { key: "detail", label: "Where it comes from", type: "text", placeholder: "PulseOps · server monitoring platform" },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    file: "content/projects.json",
    description: "Project cards on the home page and a full case-study page for each one.",
    kind: "list",
    itemTitle: "title",
    addLabel: "Add project",
    fields: [
      { key: "title", label: "Project name", type: "text", required: true },
      { key: "slug", label: "URL name", type: "text", required: true, help: "Lowercase, dashes only, e.g. my-project → /projects/my-project" },
      { key: "subtitle", label: "Subtitle", type: "text", required: true },
      { key: "category", label: "Category", type: "text", placeholder: "Distributed systems" },
      { key: "status", label: "Status badge", type: "text", placeholder: "Live on AWS" },
      { key: "award", label: "Award (optional)", type: "text" },
      { key: "featured", label: "Show on home page", type: "boolean" },
      { key: "plainEnglish", label: "In simple words", type: "textarea", required: true, help: "One sentence a non-technical recruiter understands." },
      { key: "summary", label: "Overview", type: "textarea", required: true },
      { key: "stack", label: "Tech stack", type: "list", chips: true, placeholder: "Add a technology and press Enter" },
      {
        key: "metrics",
        label: "Key numbers",
        type: "objectList",
        itemTitle: "label",
        addLabel: "Add number",
        fields: [
          { key: "value", label: "Number", type: "text", required: true },
          { key: "label", label: "What it means (plain words)", type: "text", required: true },
        ],
      },
      { key: "bullets", label: "What I built (resume bullets)", type: "list" },
      {
        key: "decisions",
        label: "Key engineering decisions",
        type: "objectList",
        itemTitle: "title",
        addLabel: "Add decision",
        fields: [
          { key: "title", label: "Decision", type: "text", required: true },
          { key: "body", label: "Why", type: "textarea", required: true },
        ],
      },
      {
        key: "links",
        label: "Links",
        type: "object",
        fields: [
          { key: "demo", label: "Live demo URL", type: "url" },
          { key: "demoNote", label: "Demo note", type: "text", help: "Shown under the demo button so visitors know what to expect.", placeholder: "Opens straight away, no login" },
          { key: "repo", label: "Source code URL", type: "url" },
        ],
      },
      { key: "diagram", label: "Diagram name (optional)", type: "text", help: "pulseops, atlas or uav — or leave empty." },
      { key: "image", label: "Screenshot or GIF (optional)", type: "text", help: "Add the file to public/projects/ in the repo, then enter its path, e.g. /projects/pulseops-live.gif. Shown instead of the diagram on the home page." },
      { key: "imageCaption", label: "Screenshot caption", type: "text", help: "Say in plain words what the picture shows." },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    file: "content/experience.json",
    description: "Jobs, internships and roles. Add a new company here when you join one — newest first.",
    kind: "list",
    itemTitle: "role",
    addLabel: "Add job / role",
    fields: [
      { key: "role", label: "Role / job title", type: "text", required: true },
      { key: "focus", label: "Team or focus (optional)", type: "text" },
      { key: "org", label: "Company / organisation", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "start", label: "Start (e.g. Jul 2027)", type: "text" },
      { key: "end", label: "End (leave empty if current)", type: "text" },
      { key: "link", label: "Link (optional)", type: "url" },
      { key: "bullets", label: "What you did", type: "list" },
    ],
  },
  {
    id: "education",
    label: "Education",
    file: "content/education.json",
    description: "Degrees and school results.",
    kind: "list",
    itemTitle: "qualification",
    addLabel: "Add education",
    fields: [
      { key: "qualification", label: "Qualification", type: "text", required: true },
      { key: "institution", label: "Institution", type: "text", required: true },
      { key: "board", label: "Board / university", type: "text" },
      { key: "year", label: "Year(s)", type: "text" },
      { key: "score", label: "Score", type: "text" },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    file: "content/skills.json",
    description: "Skill groups and the technologies in each.",
    kind: "list",
    itemTitle: "group",
    addLabel: "Add skill group",
    fields: [
      { key: "group", label: "Group name", type: "text", required: true },
      { key: "items", label: "Skills", type: "list", chips: true, placeholder: "Add a skill and press Enter" },
    ],
  },
  {
    id: "achievements",
    label: "Achievements",
    file: "content/achievements.json",
    description: "Awards, certifications and other achievements.",
    kind: "list",
    itemTitle: "title",
    addLabel: "Add achievement",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "detail", label: "Detail", type: "text" },
      { key: "year", label: "Year", type: "text" },
    ],
  },
];

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function emptyValue(fields: Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "boolean") out[f.key] = false;
    else if (f.type === "list" || f.type === "objectList") out[f.key] = [];
    else if (f.type === "object") out[f.key] = emptyValue(f.fields);
    else out[f.key] = "";
  }
  return out;
}

const MAX_TEXT = 5000;

function validateObject(value: unknown, fields: Field[], path: string, errors: string[]) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    errors.push(`${path || "Item"} must be an object.`);
    return;
  }
  const obj = value as Record<string, unknown>;
  for (const f of fields) {
    const v = obj[f.key];
    const where = path ? `${path} → ${f.label}` : f.label;
    switch (f.type) {
      case "text":
      case "textarea":
      case "url":
      case "email": {
        if (v === undefined || v === null) {
          if (f.required) errors.push(`${where} is required.`);
          break;
        }
        if (typeof v !== "string") { errors.push(`${where} must be text.`); break; }
        if (f.required && !v.trim()) errors.push(`${where} is required.`);
        if (v.length > MAX_TEXT) errors.push(`${where} is too long.`);
        if (f.type === "url" && v && !/^https?:\/\/\S+$/i.test(v)) errors.push(`${where} must start with http:// or https://`);
        if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors.push(`${where} is not a valid email.`);
        break;
      }
      case "boolean":
        if (v !== undefined && typeof v !== "boolean") errors.push(`${where} must be on or off.`);
        break;
      case "list":
        if (v === undefined) break;
        if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) errors.push(`${where} must be a list of text.`);
        break;
      case "objectList":
        if (v === undefined) break;
        if (!Array.isArray(v)) { errors.push(`${where} must be a list.`); break; }
        v.forEach((item, i) => validateObject(item, f.fields, `${where} #${i + 1}`, errors));
        break;
      case "object":
        if (v === undefined) break;
        validateObject(v, f.fields, where, errors);
        break;
    }
  }
}

/** Returns a list of human-readable problems; empty means valid. */
export function validateSection(section: Section, data: unknown): string[] {
  const errors: string[] = [];
  if (section.kind === "list") {
    if (!Array.isArray(data)) return ["Content must be a list."];
    if (data.length > 200) return ["Too many items."];
    data.forEach((item, i) => validateObject(item, section.fields, `#${i + 1}`, errors));
    if (section.id === "projects") {
      const slugs = (data as { slug?: string }[]).map((p) => p.slug);
      slugs.forEach((s, i) => {
        if (s && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) errors.push(`#${i + 1} → URL name may only contain lowercase letters, numbers and dashes.`);
      });
      if (new Set(slugs).size !== slugs.length) errors.push("Two projects have the same URL name.");
    }
  } else {
    validateObject(data, section.fields, "", errors);
  }
  return errors;
}
