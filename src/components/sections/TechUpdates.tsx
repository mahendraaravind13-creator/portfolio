import { techUpdates } from "@/lib/content";
import { UpdateArticle } from "../TechUpdatesList";
import { Btn, Section } from "../ui";

export default function TechUpdates() {
  const important = techUpdates.items.filter((i) => i.importance === "important");
  if (!important.length) return null;
  const visible = techUpdates.items.filter((i) => i.importance !== "skip").length;
  return (
    <Section
      id="updates"
      kicker="Tech updates · refreshed every few hours"
      title="What's new in tech"
      intro="Notable releases for backend and AI engineers, summarised from official sources in one paragraph each."
      last
    >
      <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {important.slice(0, 3).map((item) => (
          <UpdateArticle key={item.id} item={item} clamp />
        ))}
      </div>
      <div className="mt-6">
        <Btn href="/updates/" variant="dk">
          All {visible} updates →
        </Btn>
      </div>
    </Section>
  );
}
