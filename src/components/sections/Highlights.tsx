import { profile } from "@/lib/content";
import { Section } from "../ui";

/** Each number reads straight into a plain sentence, so it makes sense without knowing the jargon. */
export default function Highlights() {
  if (!profile.highlights.length) return null;
  return (
    <Section id="numbers" index="01" eyebrow="Proof" title="By the numbers" intro="Results from my own projects, and what each one actually means.">
      <ol className="grid gap-x-12 md:grid-cols-2">
        {profile.highlights.map((h, i) => (
          <li key={h.label} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-line py-6 first:pt-0 md:[&:nth-child(2)]:pt-0">
            <span className="label pt-2 text-subtle">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-serif text-xl leading-snug text-pretty sm:text-[1.35rem]">
                <strong className="display mr-2 align-[-0.08em] text-[2.6rem] text-accent sm:text-5xl">{h.value}</strong>
                {h.label}
              </p>
              {h.detail && <p className="label mt-3 text-subtle">{h.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
