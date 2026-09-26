import Link from "next/link";
import { featuredProjects, type Project } from "@/lib/content";
import { Button, Diagram, Section } from "../ui";
import { ArrowRightIcon, ExternalIcon, GitHubIcon, TrophyIcon } from "../icons";

/** A screenshot/GIF if the project has one (people understand it at a glance), otherwise its diagram. */
export function ProjectVisual({ project }: { project: Project }) {
  if (project.image) {
    return (
      <figure>
        <div className="border-2 border-fg bg-band shadow-[6px_6px_0_0_var(--fg)]">
          <div className="flex items-center gap-1.5 border-b-2 border-fg px-3 py-2" aria-hidden>
            <span className="size-2 rounded-full bg-band-accent" />
            <span className="size-2 rounded-full bg-band-muted/60" />
            <span className="size-2 rounded-full bg-band-muted/60" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.imageCaption || `${project.title} screenshot`} width={1200} height={750} loading="lazy" className="block h-auto w-full" />
        </div>
        {project.imageCaption && <figcaption className="mt-4 font-serif text-sm italic leading-snug text-muted">{project.imageCaption}</figcaption>}
      </figure>
    );
  }
  if (!project.diagram) return null;
  return (
    <figure>
      <div className="border-2 border-fg bg-bg p-2 shadow-[6px_6px_0_0_var(--fg)]">
        <Diagram name={project.diagram} alt={`${project.title} architecture diagram`} />
      </div>
      <figcaption className="mt-4 font-serif text-sm italic leading-snug text-muted">How the pieces connect. The case study walks through each one.</figcaption>
    </figure>
  );
}

export function DemoLink({ project, variant = "secondary" }: { project: Project; variant?: "primary" | "secondary" }) {
  if (!project.links.demo) return null;
  return (
    <span className="inline-flex flex-col gap-2">
      <Button href={project.links.demo} variant={variant} external>
        Live demo <ExternalIcon />
      </Button>
      {project.links.demoNote && <span className="label !text-[0.62rem] text-subtle">{project.links.demoNote}</span>}
    </span>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const stack = project.stack.slice(0, 6);
  const more = project.stack.length - stack.length;
  return (
    <article className="grid gap-10 border-t-[3px] border-fg py-12 first:border-t-0 first:pt-0 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div className="min-w-0">
        <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-accent">
          <span className="text-subtle">{String(index + 1).padStart(2, "0")}</span>
          {project.category && <span>{project.category}</span>}
          {project.status && (
            <span className="inline-flex items-center gap-1.5 text-ok">
              <span className="size-1.5 rounded-full bg-ok" aria-hidden /> {project.status}
            </span>
          )}
        </p>
        <h3 className="display mt-4 text-5xl sm:text-6xl">
          <Link href={`/projects/${project.slug}/`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="label mt-3 text-muted">{project.subtitle}</p>
        {project.award && (
          <p className="label mt-4 inline-flex items-center gap-1.5 border border-warn/40 px-2 py-1 text-warn">
            <TrophyIcon className="size-3.5" /> {project.award}
          </p>
        )}
        <p className="mt-6 font-serif text-2xl leading-snug text-pretty">{project.plainEnglish}</p>

        {project.metrics.length > 0 && (
          <dl className="mt-8 border-t border-line">
            {project.metrics.map((m) => (
              <div key={m.label} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-line py-3">
                <dt className="display text-3xl text-accent">{m.value}</dt>
                <dd className="font-serif text-[1.05rem] leading-snug text-muted">{m.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className="label mt-6 leading-relaxed text-subtle">
          {stack.join(" · ")}
          {more > 0 && ` · +${more} more`}
        </p>

        <div className="mt-8 flex flex-wrap items-start gap-4">
          <Button href={`/projects/${project.slug}/`}>
            Read the case study <ArrowRightIcon />
          </Button>
          <DemoLink project={project} />
          {project.links.repo && (
            <Button href={project.links.repo} variant="secondary" external>
              <GitHubIcon className="size-4" /> Code
            </Button>
          )}
        </div>
      </div>
      <div className="min-w-0 lg:pt-10">
        <ProjectVisual project={project} />
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <Section id="work" index="02" eyebrow="Selected work" title="Things I've built and shipped" intro="Each one starts with what it does in plain words. The engineering detail is in the case study.">
      <div>
        {featuredProjects.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
