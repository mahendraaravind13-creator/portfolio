import { profile } from "@/lib/content";
import { Btn, Container } from "../ui";

export default function About() {
  return (
    <Container>
      <div id="about" className="grid grid-cols-1 items-start gap-x-14 gap-y-10 border-b-[5px] border-ink py-14 sm:py-16 md:grid-cols-[1.08fr_1fr]">
        <div>
          <p className="kicker mb-2">About</p>
          <h2 className="font-disp text-[clamp(38px,5.4vw,64px)] uppercase leading-[0.9] text-ink">{profile.name}</h2>
          <p className="mb-6 mt-3 font-mono text-[12.5px] uppercase tracking-[0.12em] text-dim">
            {[profile.title, profile.location].filter(Boolean).join(" · ")}
          </p>
          {profile.about.map((p, i) => (
            <p key={i} className="mb-5 max-w-[52ch] font-serif text-[18.5px] leading-[1.65]">
              {p}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href="/#work" variant="pri">
              See the work ↓
            </Btn>
            <Btn href="/resume.pdf" variant="pri" download>
              ↓ Resume (PDF)
            </Btn>
            {profile.links.linkedin && (
              <Btn href={profile.links.linkedin} variant="dk" external>
                LinkedIn
              </Btn>
            )}
            {profile.links.github && (
              <Btn href={profile.links.github} external>
                GitHub
              </Btn>
            )}
            <Btn href={`mailto:${profile.email}`}>Email</Btn>
          </div>
        </div>

        {profile.highlights.length > 0 && (
          <div>
            <p className="mb-2 border-b-2 border-ink pb-2 font-mono text-[12px] uppercase tracking-[0.22em] text-dim">At a glance</p>
            <ol className="text-[17px] leading-[1.45]">
              {profile.highlights.map((h, i) => (
                <li key={h.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-dotted border-rule py-3.5">
                  <span className="w-6 shrink-0 font-mono text-[12px] text-red">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1 text-ink">
                    <strong className="font-semibold">{h.value}</strong> {h.label}
                  </span>
                  {h.detail && <span className="ml-auto shrink-0 text-right font-mono text-[11.5px] uppercase tracking-[0.06em] text-dim">{h.detail}</span>}
                </li>
              ))}
            </ol>
            {profile.lookingFor && <p className="mt-5 max-w-[44ch] font-serif text-[17px] leading-[1.6] text-dim">Looking for: {profile.lookingFor}</p>}
          </div>
        )}
      </div>
    </Container>
  );
}
