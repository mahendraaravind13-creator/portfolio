import { profile } from "@/lib/content";
import { Button, Container } from "../ui";
import { DownloadIcon, GitHubIcon, LeetCodeIcon, LinkedInIcon, MailIcon, PhoneIcon } from "../icons";

export function ResumeCta() {
  return (
    <section className="border-t border-line/70 py-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-surface p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Prefer a one-page summary?</h2>
            <p className="mt-2 text-muted">My resume has everything on this site in a single page.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/resume/">View resume</Button>
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
  const items = [
    { href: `mailto:${profile.email}`, label: profile.email, Icon: MailIcon },
    ...(profile.showPhone && profile.phone ? [{ href: `tel:${profile.phone.replace(/\s/g, "")}`, label: profile.phone, Icon: PhoneIcon }] : []),
    { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.links.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.links.leetcode, label: "LeetCode", Icon: LeetCodeIcon },
  ].filter((i) => i.href);

  return (
    <section id="contact" className="border-t border-line/70 py-20">
      <Container className="text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Contact</p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s work together</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
          {profile.lookingFor ? `I'm open to ${profile.lookingFor.charAt(0).toLowerCase()}${profile.lookingFor.slice(1)}` : "Say hello."} The fastest way to reach me is email.
        </p>
        <div className="mt-8">
          <Button href={`mailto:${profile.email}`} external className="px-6 py-3 text-base">
            <MailIcon className="size-5" /> {profile.email}
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {items.slice(1).map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-fg"
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
