import { techUpdates } from "@/lib/content";
import { UpdateArticle } from "../TechUpdatesList";
import { Button, Section } from "../ui";
import { ArrowRightIcon } from "../icons";

export default function TechUpdates() {
  const important = techUpdates.items.filter((i) => i.importance === "important");
  if (!important.length) return null;
  const visible = techUpdates.items.filter((i) => i.importance !== "skip").length;
  return (
    <Section
      id="updates"
      index="07"
      eyebrow="Tech updates"
      title="What's new in tech"
      intro="The releases that matter to backend and AI engineers, each explained in one paragraph. Refreshed from official sources every few hours."
    >
      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
        {important.slice(0, 4).map((item) => (
          <UpdateArticle key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-12">
        <Button href="/updates/" variant="secondary">
          See all {visible} updates <ArrowRightIcon />
        </Button>
      </div>
    </Section>
  );
}
