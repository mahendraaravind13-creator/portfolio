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
    <Container>
      <header className="border-b-[5px] border-ink pb-10 pt-14">
        <p className="kicker">Tech updates</p>
        <h1 className="mt-1 font-disp text-[clamp(54px,9.5vw,112px)] uppercase leading-[0.92] text-ink">What&apos;s new in tech</h1>
        <p className="mt-5 max-w-[58ch] font-serif text-[19px] leading-[1.62]">
          Releases from AI labs, frameworks, cloud providers and developer tools, collected from their official blogs. Each important one is explained in a short paragraph: what changed, and why it matters.
        </p>
        {updated && <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-dim">Last refreshed {updated} IST</p>}
      </header>
      <TechUpdatesList items={techUpdates.items} />
    </Container>
  );
}
