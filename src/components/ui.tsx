import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({ id, eyebrow, title, intro, children }: { id?: string; eyebrow?: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="border-t border-line/70 py-16 sm:py-20">
      <Container>
        <div className="mb-10 max-w-2xl">
          {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {intro && <p className="mt-3 text-lg text-muted">{intro}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-md border border-line bg-surface px-2.5 py-1 text-[13px] font-medium text-fg ${className}`}>
      {children}
    </span>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "ok" | "accent" | "warn" }) {
  const tones = {
    neutral: "border-line bg-surface text-muted",
    ok: "border-ok/30 bg-ok/10 text-ok",
    accent: "border-accent/30 bg-accent-soft text-accent",
    warn: "border-warn/30 bg-warn/10 text-warn",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

type BtnProps = { href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost"; external?: boolean; download?: boolean; className?: string };

export function Button({ href, children, variant = "primary", external, download, className = "" }: BtnProps) {
  const styles = {
    primary: "bg-fg text-bg hover:opacity-90",
    secondary: "border border-line bg-bg text-fg hover:bg-surface",
    ghost: "text-accent hover:underline underline-offset-4 px-0",
  };
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${styles[variant]} ${className}`;
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
