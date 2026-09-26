import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-6 ${className}`}>{children}</div>;
}

/** A printed section: red mono kicker, Anton headline, optional serif intro, closed by an ink rule. */
export function Section({ id, kicker, title, intro, children, last }: { id?: string; kicker?: string; title: string; intro?: ReactNode; children: ReactNode; last?: boolean }) {
  return (
    <Container>
      <section id={id} className={`py-14 sm:py-16 ${last ? "" : "border-b-2 border-ink"}`}>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 className="mt-2 font-disp text-[clamp(34px,4.8vw,56px)] uppercase leading-[0.94] text-ink">{title}</h2>
        {intro && <p className="mt-3 max-w-[60ch] font-serif text-[18px] leading-[1.6]">{intro}</p>}
        <div className="mt-8">{children}</div>
      </section>
    </Container>
  );
}

export function MonoLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[12px] uppercase tracking-[0.12em] text-dim ${className}`}>{children}</p>;
}

export function Chip({ children }: { children: ReactNode }) {
  return <li className="border border-rule bg-paper-2 px-2 py-0.5 font-mono text-[12.5px] leading-[1.7] text-ink/85">{children}</li>;
}

type BtnProps = { href: string; children: ReactNode; variant?: "pri" | "dk" | "plain"; external?: boolean; download?: boolean };

export function Btn({ href, children, variant = "plain", external, download }: BtnProps) {
  const cls = `btn ${variant === "pri" ? "btn-pri" : variant === "dk" ? "btn-dk" : ""}`;
  if (external || download || href.startsWith("mailto:") || href.startsWith("tel:")) {
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
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/diagrams/light/diagram-${name}.svg`} alt={alt} width={568} height={300} className="block h-auto w-full" />;
}
