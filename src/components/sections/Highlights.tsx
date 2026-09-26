import { profile } from "@/lib/content";
import { Container } from "../ui";

export default function Highlights() {
  if (!profile.highlights.length) return null;
  return (
    <section aria-label="Highlights" className="pb-16">
      <Container>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {profile.highlights.map((h) => (
            <div key={h.label} className="bg-bg p-5 sm:p-6">
              <dt className="sr-only">{h.label}</dt>
              <dd>
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">{h.value}</p>
                <p className="mt-1.5 text-sm font-medium text-fg">{h.label}</p>
                {h.detail && <p className="mt-1 text-xs text-subtle">{h.detail}</p>}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
