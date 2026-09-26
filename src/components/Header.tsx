"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { CloseIcon, MenuIcon } from "./icons";

const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/updates/", label: "Tech updates" },
  { href: "/resume/", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

export default function Header({ name, initials }: { name: string; initials: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-fg text-[13px] font-bold text-bg">{initials}</span>
          <span className="hidden sm:inline">{name}</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-line text-muted lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon className="size-4" /> : <MenuIcon className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-line bg-bg px-4 py-3 lg:hidden">
          <ul className="grid gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-fg hover:bg-surface">
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
