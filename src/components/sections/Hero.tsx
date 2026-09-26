import { profile } from "@/lib/content";
import { Badge, Button, Container } from "../ui";
import { ArrowRightIcon, FileIcon, GitHubIcon, GradCapIcon, LeetCodeIcon, LinkedInIcon, MailIcon, MapPinIcon } from "../icons";

export default function Hero() {
  const socials = [
    { href: profile.links.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.links.leetcode, label: "LeetCode", Icon: LeetCodeIcon },
  ].filter((s) => s.href);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_20%_-10%,var(--accent-soft),transparent_70%)]" />
      <Container className="grid items-center gap-8 py-12 sm:gap-12 sm:py-24 lg:grid-cols-[1fr_auto]">
        <div className="max-w-2xl">
          {profile.openToWork && (
            <Badge tone="ok">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-ok" />
              </span>
              {profile.openToWorkLabel}
            </Badge>
          )}
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">{profile.name}</h1>
          <p className="mt-4 text-xl font-medium text-accent sm:text-2xl">{profile.title}</p>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">{profile.tagline}</p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {profile.education && (
              <li className="flex items-center gap-2">
                <GradCapIcon /> {profile.education}
              </li>
            )}
            {profile.location && (
              <li className="flex items-center gap-2">
                <MapPinIcon /> {profile.location}
              </li>
            )}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/#projects">
              View my work <ArrowRightIcon />
            </Button>
            <Button href="/resume/" variant="secondary">
              <FileIcon /> Resume
            </Button>
            <Button href={`mailto:${profile.email}`} variant="secondary" external>
              <MailIcon className="size-4" /> Email me
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-1">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-fg">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {profile.photo && (
          <div className="order-first lg:order-none lg:mx-0">
            <div className="relative size-32 sm:size-56 lg:size-72">
              <div aria-hidden className="absolute -inset-3 rounded-full border border-dashed border-line" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                width={288}
                height={288}
                className="relative size-full rounded-full border-4 border-bg object-cover object-top shadow-xl ring-1 ring-line"
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
