import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

/** Numbered editorial section: a heavy rule, a mono label ("02 — Work") and a poster headline. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
}: {
  id?: string;
  index?: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-16 sm:py-24">
      <Container>
        <header className="mb-10 grid gap-5 border-t-[3px] border-fg pt-5 sm:mb-14 md:grid-cols-[1fr_minmax(0,24rem)] md:items-end">
          <div>
            {eyebrow && (
              <p className="label text-accent">
                {index && <span>{index} — </span>}
                {eyebrow}
              </p>
            )}
            <h2 className="display mt-3 text-5xl text-balance sm:text-7xl">{title}</h2>
          </div>
          {intro && <p className="font-serif text-lg leading-snug text-muted text-pretty md:text-right">{intro}</p>}
        </header>
        {children}
      </Container>
    </section>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`label inline-flex items-center border border-line px-2 py-1 !text-[0.66rem] text-muted ${className}`}>{children}</span>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "ok" | "accent" | "warn" }) {
  const tones = {
    neutral: "border-line text-muted",
    ok: "border-ok/40 text-ok",
    accent: "border-accent/40 text-accent",
    warn: "border-warn/40 text-warn",
  };
  return <span className={`label inline-flex items-center gap-1.5 border px-2 py-1 !text-[0.66rem] ${tones[tone]}`}>{children}</span>;
}

type Variant = "primary" | "secondary" | "ghost" | "band" | "bandOutline";
type BtnProps = { href: string; children: ReactNode; variant?: Variant; external?: boolean; download?: boolean; className?: string };

const lift = "hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0";

const VARIANTS: Record<Variant, string> = {
  primary: `border-fg bg-accent text-white shadow-[4px_4px_0_0_var(--fg)] hover:shadow-[6px_6px_0_0_var(--fg)] dark:text-band ${lift}`,
  secondary: `border-fg bg-bg text-fg shadow-[4px_4px_0_0_var(--fg)] hover:shadow-[6px_6px_0_0_var(--fg)] ${lift}`,
  ghost: "border-transparent !px-0 text-accent underline-offset-4 hover:underline",
  band: `border-band-fg bg-band-accent text-band shadow-[4px_4px_0_0_var(--band-fg)] hover:shadow-[6px_6px_0_0_var(--band-fg)] ${lift}`,
  bandOutline: `border-band-fg bg-band text-band-fg shadow-[4px_4px_0_0_var(--band-fg)] hover:shadow-[6px_6px_0_0_var(--band-fg)] ${lift}`,
};

export function Button({ href, children, variant = "primary", external, download, className = "" }: BtnProps) {
  const cls = `label inline-flex items-center justify-center gap-2 border-2 px-4 py-3 font-semibold transition ${VARIANTS[variant]} ${className}`;
  if (external || download) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...(download ? { download: "" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Diagram({ name, alt }: { name: string; alt: string }) {
  if (!name) return null;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/diagrams/light/diagram-${name}.svg`} alt={alt} width={568} height={300} className="block h-auto w-full dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/diagrams/dark/diagram-${name}.svg`} alt={alt} width={568} height={300} className="hidden h-auto w-full dark:block" />
    </>
  );
}
