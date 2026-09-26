import { profile, skills } from "@/lib/content";
import { Section } from "../ui";

export default function About() {
  const core = skills.find((s) => s.group === "Languages")?.items ?? [];
  const facts = [
    { k: "Looking for", v: profile.lookingFor },
    { k: "Studying", v: profile.education },
    { k: "Writes", v: core.join(", ") },
    { k: "Based in", v: profile.location },
  ].filter((f) => f.v);

  return (
    <Section id="about" index="03" eyebrow="About" title="The short version">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="space-y-6 font-serif text-xl leading-relaxed text-pretty">
          {profile.about.map((p, i) => (
            <p key={i} className={i === 0 ? "text-fg" : "text-muted"}>
              {p}
            </p>
          ))}
        </div>
        <aside className="h-fit">
          <p className="label border-b-2 border-fg pb-3 text-subtle">At a glance</p>
          <dl>
            {facts.map((f, i) => (
              <div key={f.k} className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-line py-4">
                <span className="label pt-1 text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <dt className="label text-subtle">{f.k}</dt>
                  <dd className="mt-1.5 font-serif text-lg leading-snug">{f.v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Section>
  );
}
