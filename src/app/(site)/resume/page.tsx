import type { Metadata } from "next";
import { profile } from "@/lib/content";
import { Button, Container } from "@/components/ui";
import { DownloadIcon, ExternalIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Resume", description: `Resume of ${profile.name}, ${profile.title}.` };

export default function ResumePage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Resume</h1>
          <p className="mt-2 text-muted">{profile.name} · {profile.title}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/resume.pdf" download>
            <DownloadIcon /> Download PDF
          </Button>
          <Button href="/resume.pdf" variant="secondary" external>
            Open in new tab <ExternalIcon />
          </Button>
        </div>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        <object data="/resume.pdf#view=FitH" type="application/pdf" className="h-[80vh] min-h-[600px] w-full" aria-label="Resume PDF">
          <div className="p-10 text-center">
            <p className="text-muted">Your browser can&apos;t show the PDF here.</p>
            <div className="mt-4">
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
