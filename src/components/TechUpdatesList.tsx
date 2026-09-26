"use client";

import { useMemo, useState } from "react";
import type { TechUpdate } from "@/lib/content";
import { ExternalIcon } from "./icons";

const CATEGORY_ORDER = ["AI & LLMs", "Frameworks & Languages", "Cloud & DevOps", "Developer Tools", "Industry"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Fixed format (not "2 days ago") so the static HTML and the hydrated page always agree.
function shortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function Meta({ item }: { item: TechUpdate }) {
  return (
    <p className="label flex flex-wrap gap-x-2 gap-y-1 text-subtle">
      <span className="text-accent">{item.category}</span>
      <span aria-hidden>·</span>
      <span>{item.source}</span>
      <span aria-hidden>·</span>
      <time dateTime={item.published}>{shortDate(item.published)}</time>
    </p>
  );
}

/** An important update: plain-English headline and a full paragraph, readable without leaving the page. */
export function UpdateArticle({ item }: { item: TechUpdate }) {
  return (
    <article className="flex flex-col border-t-2 border-fg pt-5">
      <Meta item={item} />
      <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-pretty">{item.headline || item.title}</h3>
      <p className="mt-4 font-serif text-lg leading-relaxed text-muted text-pretty">{item.paragraph || item.summary}</p>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="label mt-5 inline-flex w-fit items-center gap-1.5 text-accent hover:underline">
        Read the original on {item.source} <ExternalIcon className="size-3" />
      </a>
    </article>
  );
}

function UpdateBrief({ item }: { item: TechUpdate }) {
  return (
    <li className="border-b border-line py-5">
      <Meta item={item} />
      <p className="mt-2 font-serif text-lg leading-snug">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-sans font-bold tracking-tight hover:text-accent">
          {item.headline || item.title}
        </a>
        {item.paragraph && <span className="text-muted"> — {item.paragraph}</span>}
      </p>
    </li>
  );
}

function UpdateHeadline({ item }: { item: TechUpdate }) {
  return (
    <li className="border-b border-line py-4">
      <Meta item={item} />
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-start gap-1.5 font-bold tracking-tight hover:text-accent">
        {item.title} <ExternalIcon className="mt-1 size-3 shrink-0 text-subtle" />
      </a>
      {item.summary && <p className="mt-1 font-serif text-muted text-pretty">{item.summary}</p>}
    </li>
  );
}

function GroupTitle({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b-[3px] border-fg pb-3">
      <h2 className="display text-4xl sm:text-5xl">{title}</h2>
      <p className="label text-subtle">{note}</p>
    </div>
  );
}

export default function TechUpdatesList({ items }: { items: TechUpdate[] }) {
  const [filter, setFilter] = useState("All");
  const visible = useMemo(() => items.filter((i) => i.importance !== "skip"), [items]);
  const categories = useMemo(() => {
    const present = new Set(visible.map((i) => i.category));
    return ["All", ...CATEGORY_ORDER.filter((c) => present.has(c)), ...[...present].filter((c) => !CATEGORY_ORDER.includes(c))];
  }, [visible]);

  if (!visible.length) {
    return <p className="border-2 border-dashed border-line p-8 text-center font-serif text-lg text-muted">Updates are being collected. Check back soon.</p>;
  }

  const inFilter = visible.filter((i) => filter === "All" || i.category === filter);
  const important = inFilter.filter((i) => i.importance === "important");
  const minor = inFilter.filter((i) => i.importance === "minor");
  const fresh = inFilter.filter((i) => !i.reviewed);

  return (
    <div>
      {categories.length > 2 && (
        <div role="group" aria-label="Filter updates by topic" className="mb-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={`label border-2 px-3 py-2 transition ${filter === c ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-fg hover:text-fg"}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {fresh.length > 0 && (
        <section className="mb-16">
          <GroupTitle title="Just in" note="New since the last review · headline only" />
          <ul>
            {fresh.map((item) => (
              <UpdateHeadline key={item.id} item={item} />
            ))}
          </ul>
        </section>
      )}

      {important.length > 0 && (
        <section className="mb-16">
          <GroupTitle title="Worth knowing" note={`${important.length} updates, each explained`} />
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
            {important.map((item) => (
              <UpdateArticle key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {minor.length > 0 && (
        <section>
          <GroupTitle title="Also this week" note="Smaller changes, one line each" />
          <ul>
            {minor.map((item) => (
              <UpdateBrief key={item.id} item={item} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
