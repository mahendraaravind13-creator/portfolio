import type { Metadata } from "next";
import { profile } from "@/lib/content";
import { Btn, Container } from "@/components/ui";

export const metadata: Metadata = { title: "Resume", description: `Resume of ${profile.name}, ${profile.title}.` };

export default function ResumePage() {
  return (
    <Container className="pb-12">
      <header className="flex flex-col justify-between gap-5 border-b-[5px] border-ink pb-10 pt-14 sm:flex-row sm:items-end">
        <div>
          <p className="kicker">One-page summary</p>
          <h1 className="mt-1 font-disp text-[clamp(54px,9.5vw,108px)] uppercase leading-[0.92] text-ink">Resume</h1>
          <p className="mt-3 font-mono text-[12.5px] uppercase tracking-[0.12em] text-dim">
            {profile.name} · {profile.title}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Btn href="/resume.pdf" variant="pri" download>
            ↓ Download PDF
          </Btn>
          <Btn href="/resume.pdf" external>
            Open in new tab ↗
          </Btn>
        </div>
      </header>
      <div className="print-frame mt-8">
        <object data="/resume.pdf#view=FitH" type="application/pdf" className="block h-[80vh] min-h-[600px] w-full" aria-label="Resume PDF">
          <div className="p-10 text-center">
            <p className="font-serif text-[18px]">Your browser can&apos;t show the PDF here.</p>
            <div className="mt-4">
              <Btn href="/resume.pdf" variant="pri" download>
                ↓ Download the resume
              </Btn>
            </div>
          </div>
        </object>
      </div>
    </Container>
  );
}
