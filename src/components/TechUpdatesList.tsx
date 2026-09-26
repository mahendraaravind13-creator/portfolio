"use client";

import { useMemo, useState } from "react";
import type { TechUpdate } from "@/lib/content";

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
    <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-dim">
      <span className="text-red">{item.category}</span> · {item.source} · <time dateTime={item.published}>{shortDate(item.published)}</time>
    </p>
  );
}

/** An important update: plain-English headline and its explanation. `clamp` shortens it to a preview. */
export function UpdateArticle({ item, clamp = false }: { item: TechUpdate; clamp?: boolean }) {
  return (
    <article className="flex flex-col border-t-2 border-ink pb-7 pt-4">
      <h3 className="mb-2 font-sans text-[20px] font-bold leading-[1.28] text-ink">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="red-link">
          {item.headline || item.title}
        </a>
      </h3>
      <Meta item={item} />
      <p className={`mt-3 font-serif text-[17px] leading-[1.6] ${clamp ? "line-clamp-5" : ""}`}>{item.paragraph || item.summary}</p>
    </article>
  );
}

function UpdateLine({ item }: { item: TechUpdate }) {
  return (
    <li className="border-b border-dotted border-rule py-4">
      <Meta item={item} />
      <p className="mt-1.5 font-serif text-[17.5px] leading-[1.55]">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="red-link font-sans font-semibold text-ink">
          {item.headline || item.title}
        </a>
        {(item.paragraph || item.summary) && <span> — {item.paragraph || item.summary}</span>}
      </p>
    </li>
  );
}

function Group({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b-2 border-ink py-12 last:border-b-0">
      <p className="kicker">{kicker}</p>
      <h2 className="mb-7 mt-2 font-disp text-[clamp(30px,4.2vw,46px)] uppercase leading-[0.94] text-ink">{title}</h2>
      {children}
    </section>
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
    return <p className="border-2 border-dashed border-rule p-8 text-center font-serif text-[18px]">Updates are being collected. Check back soon.</p>;
  }

  const inFilter = visible.filter((i) => filter === "All" || i.category === filter);
  const important = inFilter.filter((i) => i.importance === "important");
  const minor = inFilter.filter((i) => i.importance === "minor");
  const fresh = inFilter.filter((i) => !i.reviewed);

  return (
    <div>
      {categories.length > 2 && (
        <div role="group" aria-label="Filter updates by topic" className="flex flex-wrap gap-3 pb-2 pt-8">
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)} className={`btn ${filter === c ? "btn-dk" : ""}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      {important.length > 0 && (
        <Group kicker={`${important.length} updates, each explained`} title="Worth knowing">
          <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {important.map((item) => (
              <UpdateArticle key={item.id} item={item} />
            ))}
          </div>
        </Group>
      )}

      {fresh.length > 0 && (
        <Group kicker="New since the last review" title="Just in">
          <ul>
            {fresh.map((item) => (
              <UpdateLine key={item.id} item={item} />
            ))}
          </ul>
        </Group>
      )}

      {minor.length > 0 && (
        <Group kicker="One line each" title="Smaller updates">
          <ul>
            {minor.map((item) => (
              <UpdateLine key={item.id} item={item} />
            ))}
          </ul>
        </Group>
      )}
    </div>
  );
}
