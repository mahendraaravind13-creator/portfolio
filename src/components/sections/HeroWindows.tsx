import { profile } from "@/lib/content";

/** The photo as an image-viewer window. `compact` is the small version used on phones and tablets. */
export function PhotoWindow({ compact = false }: { compact?: boolean }) {
  if (!profile.photo) return null;
  return (
    <figure className={`border-[3px] border-paper bg-ink ${compact ? "w-[132px] shadow-[6px_6px_0_var(--red)]" : "w-[300px] shadow-[12px_12px_0_var(--red)] xl:w-[340px]"}`}>
      {!compact && (
        <div className="flex items-center gap-2 border-b-[3px] border-paper bg-paper px-3 py-2">
          <span className="size-3 rounded-full bg-red" aria-hidden />
          <span className="size-3 rounded-full bg-yellow" aria-hidden />
          <span className="size-3 rounded-full bg-blue" aria-hidden />
          <span className="ml-2 truncate font-mono text-[12.5px] text-ink">{profile.shortName.split(" ")[0].toLowerCase()}.jpg</span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={680} height={850} className="block aspect-[4/5] w-full object-cover object-top" />
    </figure>
  );
}

/** Desktop: the photo window on the right of the hero; a little smaller on short screens. */
export default function HeroWindows() {
  return (
    <div className="origin-bottom-right [@media(max-height:800px)]:scale-[0.82]">
      <PhotoWindow />
    </div>
  );
}
