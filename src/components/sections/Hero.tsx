import { featuredProjects, profile } from "@/lib/content";
import { Button, Container } from "../ui";
import { ArrowRightIcon, ExternalIcon, GitHubIcon, LeetCodeIcon, LinkedInIcon, MailIcon } from "../icons";

export default function Hero() {
  const socials = [
    { href: profile.links.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.links.leetcode, label: "LeetCode", Icon: LeetCodeIcon },
  ].filter((s) => s.href);
  const demos = featuredProjects.filter((p) => p.links.demo);

  return (
    <section className="relative overflow-hidden bg-band text-band-fg">
      <div aria-hidden className="halftone pointer-events-none absolute inset-0 [mask-image:linear-gradient(115deg,transparent_35%,black_100%)] opacity-50" />
      <Container className="relative grid gap-10 pb-16 pt-12 sm:pb-24 sm:pt-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          <p className="label text-band-muted">
            {profile.title}
            {profile.location && <span className="hidden sm:inline"> · {profile.location}</span>}
          </p>
          <h1 className="display mt-6 text-[clamp(3.4rem,11vw,8.5rem)]">
            <span className="block">{profile.heroHeadline || profile.tagline}</span>
            {profile.heroAccent && <span className="block text-band-accent">{profile.heroAccent}</span>}
          </h1>
          <p className="mt-8 max-w-2xl font-serif text-xl leading-snug text-band-fg/90 text-pretty sm:text-2xl">
            I&apos;m <strong className="font-semibold text-band-fg">{profile.name}</strong>. {profile.tagline}
          </p>
          {profile.education && <p className="label mt-4 text-band-muted">{profile.education}</p>}

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/#work" variant="band">
              See the work <ArrowRightIcon />
            </Button>
            <Button href="/resume/" variant="bandOutline">
              Resume
            </Button>
            <Button href={`mailto:${profile.email}`} variant="bandOutline" external>
              <MailIcon className="size-4" /> Email
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {demos.length > 0 && (
              <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-band-muted">
                <span className="text-band-accent">Live now →</span>
                {demos.map((p) => (
                  <a key={p.slug} href={p.links.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-band-fg underline decoration-band-muted/50 underline-offset-4 hover:text-band-accent">
                    {p.title} <ExternalIcon className="size-3" />
                  </a>
                ))}
              </p>
            )}
            <div className="flex items-center gap-1">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="p-2 text-band-muted transition hover:text-band-accent">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {profile.photo && (
          <figure className="order-first w-36 rotate-2 border-[6px] border-band-fg bg-band-fg shadow-[8px_8px_0_0_var(--band-accent)] sm:w-48 lg:order-none lg:mb-4 lg:w-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={256} height={320} className="aspect-[4/5] w-full object-cover object-top grayscale-[35%] contrast-110" />
            {profile.openToWork && <figcaption className="label bg-band-fg px-1 pt-2 text-center !text-[0.62rem] text-band">{profile.openToWorkLabel}</figcaption>}
          </figure>
        )}
      </Container>
    </section>
  );
}
