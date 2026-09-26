"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { CloseIcon, MenuIcon } from "./icons";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/updates/", label: "Tech updates" },
  { href: "/resume/", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

export default function Header({ name, status }: { name: string; status?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-band text-band-fg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="label !text-[0.78rem] font-semibold !tracking-[0.2em]" onClick={() => setOpen(false)}>
          {name}
        </Link>
        {status && (
          <p className="label hidden items-center gap-2 text-band-muted xl:flex">
            <span className="size-1.5 rounded-full bg-band-accent" aria-hidden />
            {status}
          </p>
        )}
        <nav aria-label="Main" className="hidden items-center lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="label px-2.5 py-2 text-band-muted transition hover:text-band-accent">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center border border-band-muted/40 text-band-muted lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon className="size-4" /> : <MenuIcon className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-band-muted/20 px-4 py-3 lg:hidden">
          <ul className="grid gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="label block py-3 text-band-fg hover:text-band-accent">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
