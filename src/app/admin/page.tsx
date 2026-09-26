"use client";

import { useCallback, useEffect, useState } from "react";
import { SECTIONS } from "@/lib/schema";
import { api, type Session } from "@/components/admin/api";
import SectionEditor from "@/components/admin/SectionEditor";
import FilesPanel from "@/components/admin/FilesPanel";
import HistoryPanel from "@/components/admin/HistoryPanel";
import ThemeToggle from "@/components/ThemeToggle";

const PANELS = [
  { id: "overview", label: "Overview", icon: "🏠" },
  ...SECTIONS.map((s) => ({ id: s.id, label: s.label, icon: ({ profile: "👤", projects: "🛠️", experience: "💼", education: "🎓", skills: "🧰", achievements: "🏆" } as Record<string, string>)[s.id] ?? "📄" })),
  { id: "files", label: "Resume & photo", icon: "📎" },
  { id: "history", label: "History", icon: "🕘" },
];

function Overview({ go }: { go: (id: string) => void }) {
  const tasks = [
    { id: "experience", title: "Joined a new company?", body: "Add the job under Experience — it appears at the top of your timeline." },
    { id: "projects", title: "Built something new?", body: "Add a project with a one-line explanation, key numbers and links." },
    { id: "files", title: "Updated your resume?", body: "Upload the new PDF — you can also sync the skills from it in one click." },
    { id: "skills", title: "Learned a new technology?", body: "Add it to a skill group under Skills." },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back 👋</h1>
      <p className="mt-1 text-muted">Everything on your public website is managed from here. Pick what you want to change.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {tasks.map((t) => (
          <button key={t.id} type="button" onClick={() => go(t.id)} className="rounded-2xl border border-line bg-bg p-5 text-left transition hover:border-accent hover:shadow-sm">
            <p className="font-semibold">{t.title}</p>
            <p className="mt-1 text-sm text-muted">{t.body}</p>
            <p className="mt-3 text-sm font-semibold text-accent">Open →</p>
          </button>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-bg p-5">
        <h2 className="font-semibold">How publishing works</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
          <li>Edit a section and press <strong className="text-fg">Save &amp; publish</strong>.</li>
          <li>Your change is saved as a new version (see History — you can always undo).</li>
          <li>The public website rebuilds automatically and shows your change in about 1–2 minutes.</li>
        </ol>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [panel, setPanel] = useState("overview");
  const [dirty, setDirty] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api
      .session()
      .then(setSession)
      .catch(() => window.location.replace("/admin/login/"));
    const fromHash = window.location.hash.slice(1);
    if (PANELS.some((p) => p.id === fromHash)) setPanel(fromHash);
  }, []);

  const go = useCallback(
    (id: string) => {
      if (id === panel) return;
      if (dirty && !confirm("You have unsaved changes. Leave this section without saving?")) return;
      setDirty(false);
      setPanel(id);
      setMenuOpen(false);
      history.replaceState(null, "", `#${id}`);
      window.scrollTo({ top: 0 });
    },
    [panel, dirty],
  );

  async function logout() {
    if (dirty && !confirm("You have unsaved changes. Sign out anyway?")) return;
    await api.logout().catch(() => {});
    window.location.replace("/admin/login/");
  }

  if (!session) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Checking your session…</div>;
  }

  const section = SECTIONS.find((s) => s.id === panel);

  const nav = (
    <nav aria-label="Admin sections" className="space-y-1">
      {PANELS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => go(p.id)}
          aria-current={panel === p.id ? "page" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
            panel === p.id ? "bg-fg text-bg" : "text-muted hover:bg-bg hover:text-fg"
          }`}
        >
          <span aria-hidden>{p.icon}</span> {p.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-md border border-line px-2 py-1 text-sm lg:hidden" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
              ☰
            </button>
            <span className="font-semibold">Portfolio admin</span>
            {session.devMode && <span className="rounded-full bg-warn/15 px-2 py-0.5 text-xs font-semibold text-warn">Local preview</span>}
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface hover:text-fg sm:inline">
              View site ↗
            </a>
            <ThemeToggle />
            <button type="button" onClick={logout} className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface">
              Sign out
            </button>
          </div>
        </div>
        {menuOpen && <div className="border-t border-line bg-surface p-3 lg:hidden">{nav}</div>}
      </header>

      <div className="lg:flex">
        <aside className="hidden w-64 shrink-0 border-r border-line p-4 lg:block lg:min-h-[calc(100vh-3.5rem)]">
          {nav}
          <p className="mt-8 px-3 text-xs text-subtle">Signed in as {session.user}</p>
        </aside>
        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
          {panel === "overview" && <Overview go={go} />}
          {section && <SectionEditor key={section.id} section={section} onDirtyChange={setDirty} />}
          {panel === "files" && <FilesPanel />}
          {panel === "history" && <HistoryPanel />}
        </main>
      </div>
    </div>
  );
}
