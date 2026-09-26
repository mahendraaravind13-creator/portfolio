import Link from "next/link";
import { featuredProjects, type Project } from "@/lib/content";
import { Badge, Button, Chip, Diagram, Section } from "../ui";
import { ArrowRightIcon, ExternalIcon, GitHubIcon, TrophyIcon } from "../icons";

export function ProjectCard({ project }: { project: Project }) {
  const shown = project.stack.slice(0, 7);
  const more = project.stack.length - shown.length;
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-bg transition hover:border-subtle/60 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/40">
      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {project.category && <span className="text-xs font-semibold uppercase tracking-wider text-accent">{project.category}</span>}
            {project.status && <Badge tone="ok">{project.status}</Badge>}
          </div>
          <h3 className="mt-3 text-2xl font-bold tracking-tight">
            <Link href={`/projects/${project.slug}/`} className="underline-offset-4 hover:underline">
              {project.title}
            </Link>
          </h3>
          <p className="mt-1 font-medium text-muted">{project.subtitle}</p>
          {project.award && (
            <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-warn/10 px-2 py-1 text-xs font-semibold text-warn">
              <TrophyIcon className="size-3.5" /> {project.award}
            </p>
          )}
          <p className="mt-4 leading-relaxed text-fg text-pretty">{project.plainEnglish}</p>

          {project.metrics.length > 0 && (
            <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-line py-4">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="text-xl font-bold tracking-tight text-accent sm:text-2xl">{m.value}</dd>
                  <dd className="mt-0.5 text-xs text-muted">{m.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-5 flex flex-wrap gap-1.5">
            {shown.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
            {more > 0 && <Chip className="text-muted">+{more}</Chip>}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <Button href={`/projects/${project.slug}/`}>
              Read case study <ArrowRightIcon />
            </Button>
            {project.links.demo && (
              <Button href={project.links.demo} variant="secondary" external>
                Live demo <ExternalIcon />
              </Button>
            )}
            {project.links.repo && (
              <Button href={project.links.repo} variant="secondary" external>
                <GitHubIcon className="size-4" /> Code
              </Button>
            )}
          </div>
        </div>
        {project.diagram && (
          <div className="flex items-center border-t border-line bg-surface p-4 sm:p-6 lg:border-l lg:border-t-0">
            <div className="w-full rounded-xl border border-line bg-bg p-2">
              <Diagram name={project.diagram} alt={`${project.title} diagram`} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Things I've built and shipped"
      intro="Each project starts with a one-line explanation anyone can follow, then the engineering detail."
    >
      <div className="grid gap-8">
        {featuredProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </Section>
  );
}
