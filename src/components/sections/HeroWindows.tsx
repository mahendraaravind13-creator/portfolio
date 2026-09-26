import { profile } from "@/lib/content";
import { terminalLines } from "@/lib/terminal";

function TitleBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b-[3px] border-paper bg-paper px-3 py-2">
      <span className="size-3 rounded-full bg-red" aria-hidden />
      <span className="size-3 rounded-full bg-yellow" aria-hidden />
      <span className="size-3 rounded-full bg-blue" aria-hidden />
      <span className="ml-2 truncate font-mono text-[12.5px] text-ink">{title}</span>
    </div>
  );
}

/** The photo as an image-viewer window. `compact` is the small version used on phones and tablets. */
export function PhotoWindow({ compact = false }: { compact?: boolean }) {
  if (!profile.photo) return null;
  return (
    <figure className={`border-[3px] border-paper bg-ink ${compact ? "w-[132px] shadow-[6px_6px_0_var(--red)]" : "w-[260px] shadow-[10px_10px_0_var(--red)] xl:w-[290px]"}`}>
      {!compact && <TitleBar title={`${profile.shortName.split(" ")[0].toLowerCase()}.jpg`} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={580} height={725} className="block aspect-[4/5] w-full object-cover object-top" />
    </figure>
  );
}

export function TerminalWindow() {
  const lines = terminalLines();
  return (
    <div className="w-[300px] border-[3px] border-paper bg-ink shadow-[10px_10px_0_rgba(14,13,18,0.85)] xl:w-[330px]">
      <TitleBar title={profile.terminalTitle || "~/portfolio — main"} />
      <div className="whitespace-pre-wrap break-words px-4 py-3.5 font-mono text-[14px] leading-[1.75]">
        {lines.map((l, i) => (
          <p key={i} className="type-in" style={{ animationDelay: `${0.6 + i * 0.18}s` }}>
            {l.symbol && <span className="text-yellow">{l.symbol} </span>}
            <span className={l.tone === "output" ? "text-[#a59d8b]" : l.tone === "command" ? "font-semibold text-paper" : "text-paper"}>
              {/* Items separated by two spaces (like the project list) never break mid-name, e.g. at a hyphen. */}
              {l.text.split(/(\s{2,})/).map((chunk, j) => (
                <span key={j} className={/\s/.test(chunk) ? undefined : "whitespace-nowrap"}>
                  {chunk}
                </span>
              ))}
            </span>
          </p>
        ))}
        <p className="type-in" style={{ animationDelay: `${0.6 + lines.length * 0.18}s` }}>
          <span className="text-yellow">$ </span>
          <span className="cursor-blink inline-block h-[15px] w-[9px] translate-y-[2px] bg-red" aria-hidden />
        </p>
      </div>
    </div>
  );
}

/** Desktop: photo window top-right with the terminal overlapping its lower-left corner, like two app windows. */
export default function HeroWindows() {
  return (
    // The terminal starts below the face so it only overlaps the shoulders; short screens get a smaller pair.
    <div className="relative w-[410px] origin-bottom-right pt-[268px] xl:w-[450px] xl:pt-[296px] [@media(max-height:800px)]:scale-[0.82]">
      <div className="absolute right-0 top-0">
        <PhotoWindow />
      </div>
      <div className="relative z-10">
        <TerminalWindow />
      </div>
    </div>
  );
}
