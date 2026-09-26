import { profile } from "@/lib/content";
import { GitHubIcon, LeetCodeIcon, LinkedInIcon, MailIcon } from "./icons";
import { Container } from "./ui";

export default function Footer() {
  const links = [
    { href: profile.links.github, label: "GitHub", Icon: GitHubIcon },
    { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: profile.links.leetcode, label: "LeetCode", Icon: LeetCodeIcon },
    { href: `mailto:${profile.email}`, label: "Email", Icon: MailIcon },
  ].filter((l) => l.href && l.href !== "mailto:");
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="rounded-md p-2 transition hover:bg-surface hover:text-fg"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
