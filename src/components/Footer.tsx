import Link from "next/link";
import { profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/70">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-5 font-mono text-[12px] uppercase tracking-[0.16em] sm:px-6">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="flex gap-5">
          <Link href="/updates/" className="hover:text-yellow">
            Tech updates
          </Link>
          <Link href="/resume/" className="hover:text-yellow">
            Resume
          </Link>
          <a href="#main" className="hover:text-yellow">
            Back to top ↑
          </a>
        </span>
      </div>
    </footer>
  );
}
