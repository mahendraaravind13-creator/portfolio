"use client";

import { useRef, useState } from "react";
import { api } from "./api";
import PublishStatus, { type Publish } from "./PublishStatus";
import { diffSkills, extractSkills, type SkillDiff, type SkillGroup } from "@/lib/resumeSkills";
import { profile } from "@/lib/content";

function DropZone({ accept, label, hint, onFile, busy }: { accept: string; label: string; hint: string; onFile: (f: File) => void; busy: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${over ? "border-accent bg-accent-soft" : "border-line"}`}
    >
      <p className="font-medium">{label}</p>
      <p className="mt-1 text-sm text-subtle">{hint}</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="mt-4 rounded-lg bg-fg px-4 py-2 text-sm font-semibold text-bg disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Choose file"}
      </button>
      <input
        ref={input}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function SkillSync({ file }: { file: File }) {
  const [state, setState] = useState<"idle" | "reading" | "ready" | "none" | "error" | "saving">("idle");
  const [err, setErr] = useState("");
  const [changes, setChanges] = useState<SkillDiff[]>([]);
  const [next, setNext] = useState<SkillGroup[]>([]);
  const [publish, setPublish] = useState<Publish>(null);

  async function read() {
    setState("reading");
    setErr("");
    try {
      const [fromResume, current] = await Promise.all([extractSkills(file), api.getContent<SkillGroup[]>("skills")]);
      const d = diffSkills(current.data, fromResume);
      setChanges(d.changes);
      setNext(d.next);
      setState(d.changes.length ? "ready" : "none");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not read the PDF.");
      setState("error");
    }
  }

  async function apply() {
    setState("saving");
    try {
      const res = await api.saveContent("skills", next, "content: sync skills from resume");
      setPublish({ sha: res.sha, devMode: res.devMode, label: "Skills" });
      setState("none");
      setChanges([]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
      setState("error");
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Update skills from this resume?</p>
          <p className="text-sm text-muted">Reads the “Technical Skills” section and shows what would change on the site.</p>
        </div>
        {(state === "idle" || state === "error") && (
          <button type="button" onClick={read} className="rounded-lg border border-line bg-bg px-4 py-2 text-sm font-semibold hover:bg-surface">
            Check skills
          </button>
        )}
      </div>
      {state === "reading" && <p className="mt-3 text-sm text-muted">Reading your resume…</p>}
      {state === "error" && <p className="mt-3 text-sm font-medium text-danger">{err}</p>}
      {state === "none" && !publish && <p className="mt-3 text-sm text-ok">✓ Your site&apos;s skills already match this resume.</p>}
      {state === "ready" && (
        <div className="mt-4 space-y-3">
          {changes.map((c) => (
            <div key={c.group} className="rounded-lg border border-line bg-bg p-3 text-sm">
              <p className="font-semibold">
                {c.group} {c.isNew && <span className="ml-1 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">new group</span>}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {c.added.map((a) => (
                  <span key={`+${a}`} className="rounded border border-ok/30 bg-ok/10 px-1.5 py-0.5 text-ok">+ {a}</span>
                ))}
                {c.removed.map((r) => (
                  <span key={`-${r}`} className="rounded border border-danger/30 bg-danger/10 px-1.5 py-0.5 text-danger line-through">{r}</span>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" onClick={apply} className="rounded-lg bg-ok px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              Apply these changes
            </button>
            <button type="button" onClick={() => setState("idle")} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-bg">
              Not now
            </button>
          </div>
        </div>
      )}
      {state === "saving" && <p className="mt-3 text-sm text-muted">Saving…</p>}
      {publish && (
        <div className="mt-3">
          <PublishStatus publish={publish} />
        </div>
      )}
    </div>
  );
}

export default function FilesPanel() {
  const [busy, setBusy] = useState<"resume" | "photo" | null>(null);
  const [error, setError] = useState("");
  const [publish, setPublish] = useState<Publish>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [cacheBust] = useState(() => Date.now());

  async function upload(kind: "resume" | "photo", file: File) {
    setError("");
    setBusy(kind);
    try {
      const res = await api.upload(kind, file);
      setPublish({ sha: res.sha, devMode: res.devMode, label: kind === "resume" ? "Resume" : "Photo" });
      if (kind === "resume") setResumeFile(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Resume & photo</h1>
        <p className="mt-1 text-muted">Replace the resume PDF visitors download, or your profile photo.</p>
      </header>

      {error && <p className="mb-4 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm font-medium text-danger">{error}</p>}
      {publish && (
        <div className="mb-6">
          <PublishStatus publish={publish} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-bg p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Resume (PDF)</h2>
            <a href="/resume.pdf" target="_blank" className="text-sm text-accent hover:underline">
              View current ↗
            </a>
          </div>
          <DropZone accept="application/pdf" label="Drop your new resume here" hint="PDF, up to 5 MB" busy={busy === "resume"} onFile={(f) => upload("resume", f)} />
          {resumeFile && <SkillSync key={resumeFile.name + resumeFile.size} file={resumeFile} />}
        </section>

        <section className="rounded-2xl border border-line bg-bg p-5">
          <h2 className="mb-4 font-semibold">Profile photo</h2>
          <div className="mb-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${profile.photo}?v=${cacheBust}`} alt="Current profile photo" className="size-16 rounded-full border border-line object-cover object-top" />
            <p className="text-sm text-muted">A square, well-lit headshot works best.</p>
          </div>
          <DropZone accept="image/jpeg,image/png,image/webp" label="Drop a new photo here" hint="JPG, PNG or WebP, up to 3 MB" busy={busy === "photo"} onFile={(f) => upload("photo", f)} />
        </section>
      </div>
    </div>
  );
}
