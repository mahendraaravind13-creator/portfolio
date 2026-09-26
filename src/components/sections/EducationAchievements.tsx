import { achievements, education } from "@/lib/content";
import { Section } from "../ui";
import { TrophyIcon } from "../icons";

export default function EducationAchievements() {
  return (
    <Section id="education" eyebrow="Education & achievements" title="Background">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Education</h3>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {education.map((e) => (
              <li key={e.qualification} className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">{e.qualification}</p>
                  <p className="mt-1 text-sm text-muted">{e.institution}</p>
                  <p className="mt-0.5 text-sm text-subtle">
                    {[e.board, e.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {e.score && <p className="shrink-0 rounded-md bg-surface px-2.5 py-1 text-sm font-semibold">{e.score}</p>}
              </li>
            ))}
          </ul>
        </div>
        <div id="achievements">
          <h3 className="mb-4 text-lg font-semibold">Achievements & certifications</h3>
          <ul className="grid gap-3">
            {achievements.map((a) => (
              <li key={a.title} className="flex gap-4 rounded-2xl border border-line p-5">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <TrophyIcon />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">
                    {a.title}
                    {a.year && <span className="ml-2 text-sm font-normal text-subtle">{a.year}</span>}
                  </p>
                  {a.detail && <p className="mt-0.5 text-sm text-muted">{a.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
