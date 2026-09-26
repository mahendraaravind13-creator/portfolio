import type { Metadata } from "next";
import { techUpdates } from "@/lib/content";
import TechUpdatesList from "@/components/TechUpdatesList";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Latest tech updates",
  description: "Recent launches and releases in AI, LLMs, frameworks, cloud and developer tools, refreshed automatically with quick summaries.",
};

export default function UpdatesPage() {
  const updated = techUpdates.generatedAt
    ? new Date(techUpdates.generatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })
    : "";
  return (
    <Container className="py-12 sm:py-16">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">Latest tech updates</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">What&apos;s new in AI & software</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Launches and releases from AI labs, frameworks, cloud providers and developer tools. Collected automatically from official sources several times a day. Tap <strong className="font-semibold text-fg">Summarize</strong> on any card for the gist.
      </p>
      {updated && <p className="mt-2 text-sm text-subtle">Last refreshed {updated} IST</p>}
      <div className="mt-10">
        <TechUpdatesList items={techUpdates.items} />
      </div>
    </Container>
  );
}
