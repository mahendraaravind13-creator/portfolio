// Lines for the hero terminal, read from the profile (editable in the admin portal).
// {projects} expands to the featured projects, so adding a project updates the terminal too.
import { featuredProjects, profile } from "./content";

export type TerminalLine = { symbol: string; text: string; tone: "command" | "status" | "output" };

export function terminalLines(): TerminalLine[] {
  const source = profile.terminal?.length ? profile.terminal : ["$ whoami", profile.shortName, "$ ls projects/", "{projects}"];
  return source
    .map((raw) => raw.trim())
    .filter(Boolean)
    .slice(0, 10)
    .map((line) => {
      const m = line.match(/^([$✓●✗>])\s+(.*)$/);
      const symbol = m ? m[1] : "";
      const body = (m ? m[2] : line)
        .replace(/\{projects\}/g, featuredProjects.map((p) => p.slug).join("  "))
        .replace(/\{name\}/g, profile.shortName)
        .replace(/\{title\}/g, profile.title);
      return { symbol, text: body, tone: symbol === "$" ? "command" : symbol ? "status" : "output" };
    });
}
