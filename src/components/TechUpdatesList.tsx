"use client";

import { useMemo, useState } from "react";
import type { TechUpdate } from "@/lib/content";
import { ExternalIcon, SparkIcon } from "./icons";

const CATEGORY_ORDER = ["AI & LLMs", "Frameworks & Languages", "Cloud & DevOps", "Developer Tools", "Industry"];

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  if (!then) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function UpdateCard({ item }: { item: TechUpdate }) {
  const [open, setOpen] = useState(false);
  const panelId = `sum-${item.id}`;
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-bg p-5 transition hover:border-subtle/60">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold uppercase tracking-wider text-accent">{item.category}</span>
        <time dateTime={item.published} className="text-subtle">
          {timeAgo(item.published)}
        </time>
      </div>
      <h3 className="mt-2 font-semibold leading-snug text-pretty">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
          {item.title}
        </a>
      </h3>
      <p className="mt-1 text-sm text-muted">{item.source}</p>

      {open && (
        <div id={panelId} className="mt-4 rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-subtle">{item.aiSummary ? "AI summary" : "Summary"}</p>
          <p className="text-fg">{item.summary || "No summary is available for this update yet — open the article to read it."}</p>
          {item.whyItMatters && (
            <>
              <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-subtle">Why it matters</p>
              <p className="text-fg">{item.whyItMatters}</p>
            </>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 pt-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium transition hover:bg-surface"
        >
          <SparkIcon className="size-3.5" /> {open ? "Hide summary" : "Summarize"}
        </button>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-accent hover:underline">
          Read <ExternalIcon className="size-3.5" />
        </a>
      </div>
    </article>
  );
}

export default function TechUpdatesList({ items, limit, showFilters = true }: { items: TechUpdate[]; limit?: number; showFilters?: boolean }) {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(() => {
    const present = new Set(items.map((i) => i.category));
    return ["All", ...CATEGORY_ORDER.filter((c) => present.has(c)), ...[...present].filter((c) => !CATEGORY_ORDER.includes(c))];
  }, [items]);
  const shown = items.filter((i) => filter === "All" || i.category === filter).slice(0, limit ?? items.length);

  if (!items.length) {
    return <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">Updates are being collected — check back soon.</p>;
  }

  return (
    <div>
      {showFilters && categories.length > 2 && (
        <div role="tablist" aria-label="Filter updates by topic" className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                filter === c ? "border-fg bg-fg text-bg" : "border-line text-muted hover:bg-surface hover:text-fg"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <UpdateCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
