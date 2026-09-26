import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/content";
import { Chip, Container, Diagram } from "@/components/ui";
import { ProjectLinks, ProjectVisual, Tag } from "@/components/sections/Projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: `${p.subtitle}. ${p.plainEnglish}` };
}

function Block({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b-2 border-ink py-12 last:border-b-0">
      <p className="kicker">{kicker}</p>
      <h2 className="mt-1 font-disp text-[clamp(30px,4.2vw,46px)] uppercase leading-[0.94] text-ink">{title}</h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <Container>
      <article>
        <header className="border-b-[5px] border-ink pb-12 pt-12">
          <Link href="/#work" className="font-mono text-[12px] uppercase tracking-[0.16em] text-dim hover:text-red">
            ← All projects
          </Link>
          <p className="mt-7 flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-red">
            {p.category && <span>{p.category}</span>}
            {p.status && <Tag>{p.status}</Tag>}
            {p.award && <Tag tone="red">★ {p.award}</Tag>}
          </p>
          <h1 className="mt-3 font-disp text-[clamp(58px,10vw,136px)] uppercase leading-[0.92] text-ink">{p.title}</h1>
          <p className="mt-3 font-mono text-[12.5px] uppercase tracking-[0.12em] text-dim">{p.subtitle}</p>
          <p className="mt-7 max-w-[54ch] font-serif text-[21px] leading-[1.55] text-ink sm:text-[24px]">
            {p.plainEnglish} {p.punchline && <em className="text-red">{p.punchline}</em>}
          </p>
          <div className="mt-8">
            <ProjectLinks project={p} caseStudy={false} />
          </div>
        </header>

        {p.metrics.length > 0 && (
          <div className="grid gap-4 border-b-2 border-ink py-10 sm:grid-cols-3">
            {p.metrics.map((m) => (
              <div key={m.label} className="border-2 border-ink bg-paper-2 px-5 py-4 shadow-[4px_4px_0_var(--ink)]">
                <p className="font-disp text-[42px] uppercase leading-none text-red">{m.value}</p>
                <p className="mt-2.5 font-serif text-[17px] leading-[1.45]">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-x-14 md:grid-cols-[1fr_280px]">
          <div className="min-w-0">
            {p.image && (
              <Block kicker="Demo" title="Live recording">
                <ProjectVisual project={p} />
              </Block>
            )}

            <Block kicker="Summary" title="Overview">
              <p className="max-w-[60ch] font-serif text-[19px] leading-[1.7]">{p.summary}</p>
            </Block>

            {p.diagram && (
              <Block kicker="Architecture" title="How it works">
                <div className="print-frame bg-[#fbf8f1] p-2">
                  <Diagram name={p.diagram} alt={`${p.title} architecture diagram`} />
                </div>
              </Block>
            )}

            {p.decisions.length > 0 && (
              <Block kicker="Design" title="Engineering decisions">
                <div className="grid gap-x-8 sm:grid-cols-2">
                  {p.decisions.map((d, i) => (
                    <article key={d.title} className="border-t-2 border-ink pb-7 pt-4">
                      <p className="font-mono text-[12px] text-red">{String(i + 1).padStart(2, "0")}</p>
                      <h3 className="mt-1.5 font-sans text-[20px] font-bold leading-[1.28] text-ink">{d.title}</h3>
                      <p className="mt-2.5 font-serif text-[17px] leading-[1.6]">{d.body}</p>
                    </article>
                  ))}
                </div>
              </Block>
            )}

            {p.bullets.length > 0 && (
              <Block kicker="Contributions" title="What I built">
                <ul className="space-y-2.5 font-serif text-[18px] leading-[1.62]">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="text-red">
                        ·
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}
          </div>

          <aside className="space-y-9 py-12 md:sticky md:top-14 md:h-fit">
            <div>
              <p className="mb-3 border-b border-rule pb-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-dim">Tech stack</p>
              <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </ul>
            </div>
            {next && next.slug !== p.slug && (
              <Link href={`/projects/${next.slug}/`} className="block border-2 border-ink bg-paper-2 px-5 py-4 shadow-[4px_4px_0_var(--ink)] transition hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_var(--ink)]">
                <span className="block font-mono text-[11.5px] uppercase tracking-[0.14em] text-dim">Next project →</span>
                <span className="mt-1.5 block font-disp text-[28px] uppercase leading-none text-ink">{next.title}</span>
              </Link>
            )}
          </aside>
        </div>
      </article>
    </Container>
  );
}
