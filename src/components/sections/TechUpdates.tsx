import { techUpdates } from "@/lib/content";
import TechUpdatesList from "../TechUpdatesList";
import { Button, Section } from "../ui";
import { ArrowRightIcon } from "../icons";

export default function TechUpdates() {
  return (
    <Section
      id="updates"
      eyebrow="Latest tech updates"
      title="What's new in AI & software"
      intro="Recent launches and releases from AI labs, frameworks and developer tools, refreshed automatically. Tap Summarize for the gist."
    >
      <TechUpdatesList items={techUpdates.items} limit={6} showFilters={false} />
      {techUpdates.items.length > 6 && (
        <div className="mt-8">
          <Button href="/updates/" variant="secondary">
            See all {techUpdates.items.length} updates <ArrowRightIcon />
          </Button>
        </div>
      )}
    </Section>
  );
}
