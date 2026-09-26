import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/content";
import { Badge, Button, Chip, Container, Diagram } from "@/components/ui";
import { ArrowLeftIcon, ArrowRightIcon, ExternalIcon, GitHubIcon, TrophyIcon } from "@/components/icons";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: `${p.subtitle}. ${p.plainEnglish}` };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article>
      <header className="border-b border-line bg-surface">
        <Container className="py-12 sm:py-16">
          <Link href="/#projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
            <ArrowLeftIcon /> All projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {p.category && <span className="text-xs font-semibold uppercase tracking-wider text-accent">{p.category}</span>}
            {p.status && <Badge tone="ok">{p.status}</Badge>}
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{p.title}</h1>
          <p className="mt-3 text-xl text-muted">{p.subtitle}</p>
          {p.award && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-warn/10 px-2.5 py-1 text-sm font-semibold text-warn">
              <TrophyIcon /> {p.award}
            </p>
          )}
          <div className="mt-6 max-w-3xl rounded-xl border-l-4 border-accent bg-bg p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">In simple words</p>
            <p className="mt-1 text-lg text-pretty">{p.plainEnglish}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {p.links.demo && (
              <Button href={p.links.demo} external>
                Live demo <ExternalIcon />
              </Button>
            )}
            {p.links.repo && (
              <Button href={p.links.repo} variant="secondary" external>
                <GitHubIcon className="size-4" /> Source code
              </Button>
            )}
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-12">
          {p.metrics.length > 0 && (
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {p.metrics.map((m) => (
                <div key={m.label} className="bg-bg p-5">
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="text-3xl font-bold tracking-tight text-accent">{m.value}</dd>
                  <dd className="mt-1 text-sm text-muted">{m.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">{p.summary}</p>
          </section>

          {p.diagram && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
              <div className="mt-4 rounded-2xl border border-line bg-surface p-3 sm:p-5">
                <div className="rounded-xl border border-line bg-bg p-2">
                  <Diagram name={p.diagram} alt={`${p.title} architecture diagram`} />
                </div>
              </div>
            </section>
          )}

          {p.decisions.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight">Key engineering decisions</h2>
              <div className="mt-5 grid gap-4">
                {p.decisions.map((d, i) => (
                  <div key={d.title} className="flex gap-4 rounded-2xl border border-line p-5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">{i + 1}</span>
                    <div>
                      <h3 className="font-semibold">{d.title}</h3>
                      <p className="mt-1 leading-relaxed text-muted">{d.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {p.bullets.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight">What I built</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-subtle">
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-line p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">Tech stack</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
          {next && next.slug !== p.slug && (
            <Link href={`/projects/${next.slug}/`} className="group block rounded-2xl border border-line p-5 transition hover:bg-surface">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Next project</p>
              <p className="mt-1 flex items-center justify-between font-semibold">
                {next.title} <ArrowRightIcon className="transition group-hover:translate-x-0.5" />
              </p>
            </Link>
          )}
        </aside>
      </Container>
    </article>
  );
}
