import { experience } from "@/lib/content";
import { Section } from "../ui";

export default function Experience() {
  if (!experience.length) return null;
  return (
    <Section id="experience" kicker="Career" title="Experience">
      <ol className="grid gap-x-12 md:grid-cols-2">
        {experience.map((e, i) => {
          const dates = [e.start, e.end || (e.start ? "Present" : "")].filter(Boolean).join(" – ");
          return (
            <li key={`${e.role}-${e.org}-${i}`} className="border-t-2 border-ink pb-8 pt-4">
              <p className="flex flex-wrap gap-x-3 font-mono text-[12px] uppercase tracking-[0.12em] text-dim">
                <span className="text-red">{String(i + 1).padStart(2, "0")}</span>
                {dates && <span>{dates}</span>}
                {e.location && <span>{e.location}</span>}
              </p>
              <h3 className="mt-2.5 font-sans text-[21px] font-bold leading-[1.25] text-ink">
                {e.link ? (
                  <a href={e.link} target="_blank" rel="noopener noreferrer" className="red-link">
                    {e.role}
                  </a>
                ) : (
                  e.role
                )}
              </h3>
              <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.08em] text-dim">
                {e.org}
                {e.focus && ` · ${e.focus}`}
              </p>
              <ul className="mt-4 space-y-2 font-serif text-[17.5px] leading-[1.58]">
                {e.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span aria-hidden className="text-red">
                      ·
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
