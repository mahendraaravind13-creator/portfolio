import { achievements, education } from "@/lib/content";
import { Section } from "../ui";

export default function EducationAchievements() {
  return (
    <Section id="education" index="06" eyebrow="Education & achievements" title="Background">
      <div className="grid gap-14 lg:grid-cols-2">
        <div>
          <h3 className="label border-b-2 border-fg pb-3 text-subtle">Education</h3>
          <ul>
            {education.map((e) => (
              <li key={e.qualification} className="flex items-start justify-between gap-6 border-b border-line py-5">
                <div className="min-w-0">
                  <p className="text-lg font-bold tracking-tight">{e.qualification}</p>
                  <p className="mt-1 font-serif text-lg text-muted">{e.institution}</p>
                  <p className="label mt-2 text-subtle">{[e.board, e.year].filter(Boolean).join(" · ")}</p>
                </div>
                {e.score && <p className="display shrink-0 text-right text-3xl text-accent">{e.score}</p>}
              </li>
            ))}
          </ul>
        </div>
        <div id="achievements">
          <h3 className="label border-b-2 border-fg pb-3 text-subtle">Achievements & certifications</h3>
          <ol>
            {achievements.map((a, i) => (
              <li key={a.title} className="grid grid-cols-[2rem_1fr_auto] gap-x-3 border-b border-line py-5">
                <span className="label pt-1.5 text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="text-lg font-bold tracking-tight">{a.title}</p>
                  {a.detail && <p className="mt-1 font-serif text-lg text-muted">{a.detail}</p>}
                </div>
                {a.year && <span className="label pt-1.5 text-subtle">{a.year}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
