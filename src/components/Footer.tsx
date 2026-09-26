import Link from "next/link";
import { profile } from "@/lib/content";
import { Container } from "./ui";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-fg py-8">
      <Container className="label flex flex-col items-center justify-between gap-3 text-subtle sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="flex gap-4">
          <Link href="/updates/" className="hover:text-accent">
            Tech updates
          </Link>
          <Link href="/resume/" className="hover:text-accent">
            Resume
          </Link>
          <a href="#main" className="hover:text-accent">
            Back to top ↑
          </a>
        </p>
      </Container>
    </footer>
  );
}
