import { profile } from "@/lib/content";
import HeroArt from "./HeroArt";

const SOFT = { textShadow: "0 1px 14px rgba(10,10,20,0.7)" };

export default function Hero() {
  const lines = (profile.heroHeadline || profile.shortName).split("\n");
  return (
    <section className="relative h-[88svh] max-h-[900px] min-h-[600px] w-full overflow-hidden border-b-[5px] border-ink">
      <HeroArt />

      {/* Scrim: darkens the lower left so the text always reads, whatever the art does behind it. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(22,21,26,0.92)_0%,rgba(22,21,26,0.6)_45%,rgba(22,21,26,0)_72%)] md:bg-[radial-gradient(ellipse_72%_78%_at_0%_100%,rgba(22,21,26,0.8)_0%,rgba(22,21,26,0.5)_45%,rgba(22,21,26,0)_78%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-[linear-gradient(to_top,rgba(22,21,26,0.6),rgba(22,21,26,0))] md:block" />

      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-14 sm:pb-16">
        <div className="mx-auto w-full max-w-[1200px]">
          {profile.openToWork && (
            <p className="mb-5 inline-flex items-center gap-2 border-[1.5px] border-ink bg-yellow px-2.5 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-ink">
              <span className="size-2 rounded-full bg-ink" aria-hidden />
              {profile.openToWorkLabel}
            </p>
          )}
          <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.24em] text-paper sm:text-[13px]" style={SOFT}>
            {profile.title}
          </p>
          <h1 className="font-disp text-[length:clamp(56px,min(12vw,17svh),156px)] uppercase leading-[0.92] tracking-[-0.005em] text-paper" style={{ textShadow: "3px 3px 0 var(--red)" }}>
            {lines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[42ch] font-serif text-[19px] leading-[1.5] text-paper sm:text-[23px]" style={SOFT}>
            {profile.tagline}
          </p>
          {profile.education && (
            <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-paper/80 sm:text-[12.5px]" style={SOFT}>
              {profile.education}
            </p>
          )}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-3 z-10 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-paper/70">scroll ↓</div>
    </section>
  );
}
