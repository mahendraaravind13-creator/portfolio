import { profile } from "@/lib/content";

export default function Contact() {
  const links = [
    ...(profile.showPhone && profile.phone ? [{ href: `tel:${profile.phone.replace(/\s/g, "")}`, label: profile.phone }] : []),
    { href: profile.links.linkedin, label: "LinkedIn" },
    { href: profile.links.github, label: "GitHub" },
    { href: profile.links.leetcode, label: "LeetCode" },
    { href: "/resume.pdf", label: "↓ Resume (PDF)" },
  ].filter((l) => l.href);

  return (
    <section id="contact" className="mt-4 border-t-[5px] border-ink bg-ink text-paper">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
        <p className="font-mono text-[12.5px] uppercase tracking-[0.22em] text-yellow">Contact</p>
        <h2 className="mt-3 font-disp text-[clamp(56px,9vw,124px)] uppercase leading-[0.92]" style={{ textShadow: "4px 4px 0 var(--red)" }}>
          Get in touch.
        </h2>
        <p className="mt-6 max-w-[50ch] font-serif text-[20px] leading-[1.6] text-paper/90">
          {profile.lookingFor ? `Looking for ${profile.lookingFor.replace(/\.$/, "")}.` : ""} The quickest way to reach me is by email.
        </p>
        <a href={`mailto:${profile.email}`} className="mt-8 inline-block break-all font-serif text-[clamp(24px,3.8vw,42px)] text-paper underline decoration-red decoration-[3px] underline-offset-[7px] hover:text-yellow">
          {profile.email}
        </a>
        <ul className="mt-10 flex flex-wrap gap-3">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(l.href.endsWith(".pdf") ? { download: "" } : {})}
                className="inline-block border-2 border-paper px-4 py-2.5 font-mono text-[13px] uppercase tracking-[0.08em] text-paper shadow-[3px_3px_0_var(--red)] transition hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_var(--red)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
