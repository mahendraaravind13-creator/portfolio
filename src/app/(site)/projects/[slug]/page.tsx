import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/content";
import { Button, Container, Diagram } from "@/components/ui";
import { DemoLink, ProjectVisual } from "@/components/sections/Projects";
import { ArrowLeftIcon, ArrowRightIcon, GitHubIcon, TrophyIcon } from "@/components/icons";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: `${p.subtitle}. ${p.plainEnglish}` };
}

function Heading({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="border-t-[3px] border-fg pt-4">
      <p className="label text-accent">{n}</p>
      <h2 className="display mt-2 text-4xl sm:text-5xl">{children}</h2>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <article>
      <header className="relative overflow-hidden bg-band text-band-fg">
        <div aria-hidden className="halftone pointer-events-none absolute inset-0 [mask-image:linear-gradient(115deg,transparent_40%,black_100%)] opacity-40" />
        <Container className="relative py-12 sm:py-16">
          <Link href="/#work" className="label inline-flex items-center gap-1.5 text-band-muted hover:text-band-accent">
            <ArrowLeftIcon /> All projects
          </Link>
          <p className="label mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-band-accent">
            {p.category && <span>{p.category}</span>}
            {p.status && (
              <span className="inline-flex items-center gap-1.5 text-band-fg">
                <span className="size-1.5 rounded-full bg-band-accent" aria-hidden /> {p.status}
              </span>
            )}
          </p>
          <h1 className="display mt-4 text-[clamp(3.4rem,11vw,8rem)]">{p.title}</h1>
          <p className="label mt-3 text-band-muted">{p.subtitle}</p>
          {p.award && (
            <p className="label mt-5 inline-flex items-center gap-1.5 border border-band-accent/60 px-2 py-1 text-band-accent">
              <TrophyIcon className="size-3.5" /> {p.award}
            </p>
          )}
          <div className="mt-8 max-w-3xl border-l-4 border-band-accent pl-5">
            <p className="label text-band-muted">In simple words</p>
            <p className="mt-2 font-serif text-2xl leading-snug text-pretty sm:text-3xl">{p.plainEnglish}</p>
          </div>
        </Container>
      </header>

      <Container className="py-14 sm:py-20">
        <div className="flex flex-wrap items-start gap-4">
          <DemoLink project={p} variant="primary" />
          {p.links.repo && (
            <Button href={p.links.repo} variant="secondary" external>
              <GitHubIcon className="size-4" /> Source code
            </Button>
          )}
        </div>

        {p.metrics.length > 0 && (
          <dl className="mt-12 grid gap-x-10 border-t border-line sm:grid-cols-3">
            {p.metrics.map((m) => (
              <div key={m.label} className="border-b border-line py-5">
                <dt className="display text-5xl text-accent">{m.value}</dt>
                <dd className="mt-2 font-serif text-lg leading-snug text-muted">{m.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_17rem]">
          <div className="min-w-0 space-y-16">
            {p.image && (
              <section>
                <Heading n={num()}>See it working</Heading>
                <div className="mt-8">
                  <ProjectVisual project={p} />
                </div>
              </section>
            )}

            <section>
              <Heading n={num()}>Overview</Heading>
              <p className="mt-6 font-serif text-xl leading-relaxed text-pretty">{p.summary}</p>
            </section>

            {p.diagram && (
              <section>
                <Heading n={num()}>How it works</Heading>
                <div className="mt-8 border-2 border-fg bg-bg p-2 shadow-[6px_6px_0_0_var(--fg)]">
                  <Diagram name={p.diagram} alt={`${p.title} architecture diagram`} />
                </div>
              </section>
            )}

            {p.decisions.length > 0 && (
              <section>
                <Heading n={num()}>Key engineering decisions</Heading>
                <ol className="mt-6">
                  {p.decisions.map((d, i) => (
                    <li key={d.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-line py-6">
                      <span className="display text-3xl text-accent">{i + 1}</span>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">{d.title}</h3>
                        <p className="mt-2 font-serif text-lg leading-relaxed text-muted">{d.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {p.bullets.length > 0 && (
              <section>
                <Heading n={num()}>What I built</Heading>
                <ul className="mt-6 space-y-3 font-serif text-lg leading-relaxed text-muted">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="grid grid-cols-[1.25rem_1fr]">
                      <span className="text-accent" aria-hidden>
                        —
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-10 lg:sticky lg:top-20 lg:h-fit">
            <div>
              <h2 className="label border-b-2 border-fg pb-3 text-subtle">Tech stack</h2>
              <ul className="mt-2">
                {p.stack.map((s) => (
                  <li key={s} className="border-b border-line py-2 font-serif text-lg">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {next && next.slug !== p.slug && (
              <Link href={`/projects/${next.slug}/`} className="group block border-2 border-fg p-5 shadow-[4px_4px_0_0_var(--fg)] transition hover:-translate-x-0.5 hover:-translate-y-0.5">
                <p className="label text-subtle">Next project</p>
                <p className="display mt-2 flex items-center justify-between text-3xl group-hover:text-accent">
                  {next.title} <ArrowRightIcon className="size-5" />
                </p>
              </Link>
            )}
          </aside>
        </div>
      </Container>
    </article>
  );
}
