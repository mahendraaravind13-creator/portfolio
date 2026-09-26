import { profile, skills } from "@/lib/content";
import { Section } from "../ui";

export default function About() {
  const core = skills.find((s) => s.group === "Languages")?.items ?? [];
  return (
    <Section id="about" eyebrow="About" title="I build systems that hold up — and measure them.">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          {profile.about.map((p, i) => (
            <p key={i} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-subtle">At a glance</h3>
          <dl className="mt-4 space-y-4 text-sm">
            {profile.lookingFor && (
              <div>
                <dt className="font-semibold">Looking for</dt>
                <dd className="mt-1 text-muted">{profile.lookingFor}</dd>
              </div>
            )}
            {profile.education && (
              <div>
                <dt className="font-semibold">Education</dt>
                <dd className="mt-1 text-muted">{profile.education}</dd>
              </div>
            )}
            {core.length > 0 && (
              <div>
                <dt className="font-semibold">Languages</dt>
                <dd className="mt-1 text-muted">{core.join(" · ")}</dd>
              </div>
            )}
            {profile.location && (
              <div>
                <dt className="font-semibold">Based in</dt>
                <dd className="mt-1 text-muted">{profile.location}</dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </Section>
  );
}
