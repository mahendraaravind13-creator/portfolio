import Link from "next/link";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/updates/", label: "Tech updates" },
  { href: "/resume/", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

/** Thin ink strip across the top, like the band on a printed sleeve. */
export default function Header({ name, location }: { name: string; location?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-ink text-paper">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-1.5 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.18em] sm:px-6">
        <Link href="/" className="font-medium hover:text-yellow">
          {name}
        </Link>
        {location && <span className="hidden text-paper/60 md:inline">{location}</span>}
        <nav aria-label="Main" className="flex flex-wrap gap-x-5 gap-y-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-paper/85 hover:text-yellow">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
