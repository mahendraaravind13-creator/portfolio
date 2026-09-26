import { experience } from "@/lib/content";
import { Section } from "../ui";
import { ExternalIcon } from "../icons";

export default function Experience() {
  if (!experience.length) return null;
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative space-y-10 border-l border-line pl-8">
        {experience.map((e, i) => {
          const dates = [e.start, e.end || (e.start ? "Present" : "")].filter(Boolean).join(" – ");
          return (
            <li key={`${e.role}-${e.org}-${i}`} className="relative">
              <span aria-hidden className="absolute -left-[39px] top-1.5 flex size-4 items-center justify-center rounded-full border-2 border-accent bg-bg">
                <span className="size-1.5 rounded-full bg-accent" />
              </span>
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <h3 className="text-lg font-semibold">
                  {e.role}
                  {e.focus && <span className="font-normal text-muted"> · {e.focus}</span>}
                </h3>
                {dates && <p className="shrink-0 text-sm text-subtle">{dates}</p>}
              </div>
              <p className="mt-1 text-sm text-muted">
                {e.org}
                {e.location && ` · ${e.location}`}
                {e.link && (
                  <a href={e.link} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-accent hover:underline">
                    Link <ExternalIcon className="size-3" />
                  </a>
                )}
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted marker:text-subtle">
                {e.bullets.map((b, j) => (
                  <li key={j} className="leading-relaxed">
                    {b}
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
