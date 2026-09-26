import { achievements, education, experience, profile, skills } from "@/lib/content";
import { Section } from "../ui";

/** Achievements as printed tiles; the first one is picked out in red. */
export function Achievements() {
  if (!achievements.length) return null;
  return (
    <Section id="achievements" kicker="Recognition" title="Achievements">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {achievements.map((a, i) => (
          <div key={a.title} className={`border-2 border-ink px-4 py-4 shadow-[4px_4px_0_var(--ink)] ${i === 0 ? "bg-red" : "bg-paper-2"}`}>
            <p className={`font-disp text-[24px] uppercase leading-[1.05] ${i === 0 ? "text-paper" : "text-ink"}`}>{a.title}</p>
            <p className={`mt-2 font-mono text-[11.5px] uppercase leading-[1.5] tracking-[0.1em] ${i === 0 ? "text-[#f7ded8]" : "text-dim"}`}>
              {[a.detail, a.year].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** Education on the left; photo and a column of plain facts on the right. */
export default function Background() {
  const ta = experience.find((e) => /teaching/i.test(e.role));
  const languages = skills.find((s) => s.group === "Languages")?.items ?? [];
  const facts = [
    { k: "Looking for", v: profile.lookingFor ? [profile.lookingFor] : [] },
    { k: "Writes", v: languages.length ? [languages.join(" · ")] : [] },
    { k: "Teaching", v: ta ? [ta.focus || ta.role, ta.org] : [] },
    { k: "Interests", v: ["Carnatic violin, 10+ years of formal training"] },
    { k: "Based in", v: profile.location ? [profile.location] : [] },
  ].filter((f) => f.v.length);

  return (
    <Section id="background" kicker="Background" title="Education">
      <div className="grid gap-12 md:grid-cols-[1.15fr_1fr]">
        <ol>
          {education.map((e) => (
            <li key={e.qualification} className="flex items-start justify-between gap-6 border-t-2 border-ink py-5 first:border-t-0 first:pt-0">
              <div className="min-w-0">
                <h3 className="font-sans text-[21px] font-bold leading-[1.25] text-ink">{e.qualification}</h3>
                <p className="mt-1.5 font-serif text-[18px] leading-[1.5]">{e.institution}</p>
                <p className="mt-1.5 font-mono text-[12px] uppercase tracking-[0.12em] text-dim">{[e.board, e.year].filter(Boolean).join(" · ")}</p>
              </div>
              {e.score && <p className="shrink-0 font-disp text-[30px] uppercase leading-none text-red">{e.score}</p>}
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-[minmax(0,150px)_1fr] gap-6 sm:grid-cols-[minmax(0,200px)_1fr]">
          {profile.photo && (
            <figure>
              <div className="print-frame overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={400} height={500} loading="lazy" className="block aspect-[4/5] w-full object-cover object-top" />
              </div>
              <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">{profile.shortName}</figcaption>
            </figure>
          )}
          <dl className="min-w-0 font-mono text-[12.5px] leading-[1.75] text-dim">
            {facts.map((f) => (
              <div key={f.k} className="mb-4">
                <dt className="text-[11.5px] uppercase tracking-[0.14em] text-ink">{f.k}</dt>
                {f.v.map((line) => (
                  <dd key={line}>{line}</dd>
                ))}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
