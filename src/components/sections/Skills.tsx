import { skills } from "@/lib/content";
import { Chip, Section } from "../ui";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Tech stack & fundamentals">
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((g) => (
          <div key={g.group} className="rounded-2xl border border-line p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-subtle">{g.group}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
