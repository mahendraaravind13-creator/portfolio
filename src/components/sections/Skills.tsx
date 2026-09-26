import { skills } from "@/lib/content";
import { Chip, Section } from "../ui";

export default function Skills() {
  return (
    <Section id="skills" kicker="Skills" title="Technical skills" intro="The languages, frameworks and platforms behind the projects above, each used in production work.">
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((g) => (
          <div key={g.group}>
            <p className="mb-3 border-b border-rule pb-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-dim">{g.group}</p>
            <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
              {g.items.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
