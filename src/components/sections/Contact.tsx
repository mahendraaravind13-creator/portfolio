import { profile } from "@/lib/content";
import { Button, Container } from "../ui";
import { ArrowRightIcon, DownloadIcon, GitHubIcon, LeetCodeIcon, LinkedInIcon, MailIcon, PhoneIcon } from "../icons";

export function ResumeCta() {
  return (
    <section className="py-8">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 border-2 border-fg bg-accent-soft p-8 shadow-[6px_6px_0_0_var(--fg)] sm:flex-row sm:items-center">
          <div>
            <p className="label text-accent">Resume</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">Want it on one page?</h2>
            <p className="mt-2 font-serif text-lg text-muted">Everything on this site, in a single-page PDF.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href="/resume/">
              View resume <ArrowRightIcon />
            </Button>
            <Button href="/resume.pdf" variant="secondary" download>
              <DownloadIcon /> Download PDF
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function Contact() {
  const others = [
    ...(profile.showPhone && profile.phone ? [{ href: `tel:${profile.phone.replace(/\s/g, "")}`, label: profile.phone, Icon: PhoneIcon }] : []),
    { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.links.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.links.leetcode, label: "LeetCode", Icon: LeetCodeIcon },
  ].filter((i) => i.href);

  return (
    <section id="contact" className="relative overflow-hidden bg-band py-20 text-band-fg sm:py-28">
      <div aria-hidden className="halftone pointer-events-none absolute inset-0 [mask-image:linear-gradient(250deg,transparent_45%,black_100%)] opacity-40" />
      <Container className="relative">
        <p className="label text-band-accent">08 — Contact</p>
        <h2 className="display mt-4 max-w-4xl text-[clamp(3rem,9vw,7rem)] text-balance">
          Let&apos;s build something that <span className="text-band-accent">holds up.</span>
        </h2>
        {profile.lookingFor && (
          <p className="mt-8 max-w-2xl font-serif text-xl leading-snug text-band-fg/90 sm:text-2xl">
            <span className="label mb-2 block text-band-muted">Looking for</span>
            {profile.lookingFor}
          </p>
        )}
        <div className="mt-10">
          <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-3 border-b-2 border-band-accent pb-1 font-serif text-2xl break-all transition hover:text-band-accent sm:text-4xl">
            <MailIcon className="size-6 shrink-0 sm:size-8" /> {profile.email}
          </a>
          <p className="label mt-3 text-band-muted">Email is the fastest way to reach me.</p>
        </div>
        <ul className="mt-10 flex flex-wrap items-center gap-4">
          {others.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="label inline-flex items-center gap-2 border-2 border-band-fg px-4 py-3 text-band-fg transition hover:border-band-accent hover:text-band-accent"
              >
                <Icon className="size-4" /> {label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
