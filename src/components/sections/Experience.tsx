import { experience } from "@/lib/content";
import { Section } from "../ui";
import { ExternalIcon } from "../icons";

export default function Experience() {
  if (!experience.length) return null;
  return (
    <Section id="experience" index="04" eyebrow="Experience" title="Where I've worked">
      <ol>
        {experience.map((e, i) => {
          const dates = [e.start, e.end || (e.start ? "Present" : "")].filter(Boolean).join(" – ");
          return (
            <li key={`${e.role}-${e.org}-${i}`} className="grid gap-4 border-b border-line py-8 first:pt-0 md:grid-cols-[12rem_1fr] md:gap-10">
              <div className="label space-y-1.5 text-subtle">
                {dates && <p className="text-accent">{dates}</p>}
                {e.location && <p>{e.location}</p>}
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-bold tracking-tight">{e.role}</h3>
                {e.focus && <p className="mt-1 font-serif text-lg italic text-muted">{e.focus}</p>}
                <p className="label mt-3 flex flex-wrap items-center gap-x-3 text-muted">
                  {e.org}
                  {e.link && (
                    <a href={e.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                      Link <ExternalIcon className="size-3" />
                    </a>
                  )}
                </p>
                <ul className="mt-5 space-y-2.5 font-serif text-lg leading-relaxed text-muted">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="grid grid-cols-[1.25rem_1fr]">
                      <span className="text-accent" aria-hidden>
                        —
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
