import Link from "next/link";
import { featuredProjects, type Project } from "@/lib/content";
import { Btn, Chip, Diagram, Section } from "../ui";

export function Tag({ children, tone = "yellow" }: { children: React.ReactNode; tone?: "yellow" | "red" }) {
  return (
    <span className={`inline-block max-w-full border-[1.5px] border-ink px-2 py-px font-mono text-[11.5px] uppercase tracking-[0.1em] ${tone === "red" ? "bg-red text-paper" : "bg-yellow text-ink"}`}>
      {children}
    </span>
  );
}

/** A screenshot/GIF if the project has one, otherwise its architecture diagram — in a printed frame. */
export function ProjectVisual({ project }: { project: Project }) {
  const caption = project.image ? project.imageCaption : "How the pieces connect";
  if (!project.image && !project.diagram) return null;
  return (
    <figure>
      <div className={`print-frame overflow-hidden ${project.image ? "bg-[#09090b]" : "bg-[#fbf8f1] p-2"}`}>
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt={project.imageCaption || `${project.title} screenshot`} width={1200} height={750} loading="lazy" className="block h-auto w-full" />
        ) : (
          <Diagram name={project.diagram} alt={`${project.title} architecture diagram`} />
        )}
      </div>
      {caption && <figcaption className="mt-3 font-mono text-[11.5px] uppercase leading-[1.6] tracking-[0.12em] text-dim">{caption}</figcaption>}
    </figure>
  );
}

export function ProjectLinks({ project, caseStudy = true }: { project: Project; caseStudy?: boolean }) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      {caseStudy && (
        <Btn href={`/projects/${project.slug}/`} variant="dk">
          Case study →
        </Btn>
      )}
      {project.links.demo && (
        <span className="inline-flex flex-col gap-2">
          <Btn href={project.links.demo} variant="pri" external>
            Live demo ↗
          </Btn>
          {project.links.demoNote && <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-dim">{project.links.demoNote}</span>}
        </span>
      )}
      {project.links.repo && (
        <Btn href={project.links.repo} external>
          Code
        </Btn>
      )}
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article className="grid gap-8 border-t-2 border-ink pb-12 pt-7 first:border-t-0 first:pt-0 md:grid-cols-[1fr_1.1fr] md:gap-12">
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-dim">
          <span className="text-red">{String(index + 1).padStart(2, "0")}</span>
          {project.category && <span>{project.category}</span>}
          {project.status && <Tag>{project.status}</Tag>}
        </p>
        <h3 className="mt-3 font-sans text-[32px] font-bold leading-[1.15] text-ink">
          <Link href={`/projects/${project.slug}/`} className="red-link">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.09em] text-dim">{project.subtitle}</p>
        {project.award && (
          <p className="mt-4">
            <Tag tone="red">★ {project.award}</Tag>
          </p>
        )}
        <p className="mt-5 max-w-[46ch] font-serif text-[19.5px] leading-[1.58]">
          {project.plainEnglish} {project.punchline && <em className="text-red">{project.punchline}</em>}
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1.5">
          {project.stack.slice(0, 7).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          {project.stack.length > 7 && <Chip>+{project.stack.length - 7}</Chip>}
        </ul>
        <div className="mt-8">
          <ProjectLinks project={project} />
        </div>
      </div>
      <div className="min-w-0 md:pt-1">
        <ProjectVisual project={project} />
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <Section id="work" kicker="Projects" title="Selected projects" intro="What each project does, in plain words, and the result that matters most. Each case study covers the engineering in detail.">
      {featuredProjects.map((p, i) => (
        <ProjectRow key={p.slug} project={p} index={i} />
      ))}
    </Section>
  );
}
