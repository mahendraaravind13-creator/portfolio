import type { Metadata } from "next";
import { profile } from "@/lib/content";
import { Button, Container } from "@/components/ui";
import { DownloadIcon, ExternalIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Resume", description: `Resume of ${profile.name}, ${profile.title}.` };

export default function ResumePage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-col justify-between gap-6 border-t-[3px] border-fg pt-5 sm:flex-row sm:items-end">
        <div>
          <p className="label text-accent">Resume</p>
          <h1 className="display mt-3 text-6xl sm:text-7xl">One page</h1>
          <p className="label mt-3 text-muted">
            {profile.name} · {profile.title}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button href="/resume.pdf" download>
            <DownloadIcon /> Download PDF
          </Button>
          <Button href="/resume.pdf" variant="secondary" external>
            Open in new tab <ExternalIcon />
          </Button>
        </div>
      </div>
      <div className="mt-10 border-2 border-fg bg-surface shadow-[6px_6px_0_0_var(--fg)]">
        <object data="/resume.pdf#view=FitH" type="application/pdf" className="block h-[80vh] min-h-[600px] w-full" aria-label="Resume PDF">
          <div className="p-10 text-center">
            <p className="font-serif text-lg text-muted">Your browser can&apos;t show the PDF here.</p>
            <div className="mt-6">
              <Button href="/resume.pdf" download>
                <DownloadIcon /> Download the resume
              </Button>
            </div>
          </div>
        </object>
      </div>
    </Container>
  );
}
