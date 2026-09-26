import { skills } from "@/lib/content";
import { Section } from "../ui";

export default function Skills() {
  return (
    <Section id="skills" index="05" eyebrow="Skills" title="Tools I work with">
      <dl className="grid gap-x-12 md:grid-cols-2">
        {skills.map((g) => (
          <div key={g.group} className="border-b border-line py-5">
            <dt className="label text-accent">{g.group}</dt>
            <dd className="mt-2 font-serif text-lg leading-relaxed">
              {g.items.map((s, i) => (
                <span key={s}>
                  <span className="whitespace-nowrap">{s}</span>
                  {i < g.items.length - 1 && <span className="text-subtle"> / </span>}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
