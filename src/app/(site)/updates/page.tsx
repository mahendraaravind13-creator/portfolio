import type { Metadata } from "next";
import { techUpdates } from "@/lib/content";
import TechUpdatesList from "@/components/TechUpdatesList";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Tech updates",
  description: "The releases that matter in AI, frameworks, cloud and developer tools, each explained in one plain-English paragraph.",
};

export default function UpdatesPage() {
  const updated = techUpdates.generatedAt
    ? new Date(techUpdates.generatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })
    : "";
  return (
    <>
      <header className="relative overflow-hidden bg-band text-band-fg">
        <div aria-hidden className="halftone pointer-events-none absolute inset-0 [mask-image:linear-gradient(115deg,transparent_40%,black_100%)] opacity-40" />
        <Container className="relative py-14 sm:py-20">
          <p className="label text-band-accent">Tech updates</p>
          <h1 className="display mt-4 text-[clamp(3.2rem,10vw,7.5rem)]">What&apos;s new in tech</h1>
          <p className="mt-6 max-w-2xl font-serif text-xl leading-snug text-band-fg/90 text-pretty">
            Releases from AI labs, frameworks, cloud providers and developer tools, collected from their official blogs. Each important one is explained in a single paragraph, so you get what changed and why it matters without opening ten tabs.
          </p>
          {updated && <p className="label mt-5 text-band-muted">Last refreshed {updated} IST</p>}
        </Container>
      </header>
      <Container className="py-14 sm:py-20">
        <TechUpdatesList items={techUpdates.items} />
      </Container>
    </>
  );
}
