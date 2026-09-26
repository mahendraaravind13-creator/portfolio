"use client";

import { useEffect, useState } from "react";
import { api, type Commit } from "./api";
import PublishStatus, { type Publish } from "./PublishStatus";

export default function HistoryPanel() {
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [publish, setPublish] = useState<Publish>(null);

  useEffect(() => {
    api.history().then((r) => setCommits(r.commits)).catch((e) => setError(e.message));
  }, []);

  async function restore(c: Commit) {
    if (!confirm(`Restore all content to how it was on ${new Date(c.date).toLocaleString()}?\n\nThis creates a new version — nothing is deleted, so you can undo it later.`)) return;
    setBusy(c.sha);
    setError("");
    try {
      const res = await api.restore(c.sha);
      setPublish({ sha: res.sha, devMode: res.devMode, label: "Restored version" });
      const r = await api.history();
      setCommits(r.commits);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-muted">Every save is kept. Restore any earlier version of your content with one click.</p>
      </header>
      {error && <p className="mb-4 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm font-medium text-danger">{error}</p>}
      {publish && (
        <div className="mb-6">
          <PublishStatus publish={publish} />
        </div>
      )}
      {!commits && !error && <p className="text-muted">Loading…</p>}
      {commits && (
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-bg">
          {commits.map((c, i) => (
            <li key={c.sha} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {c.message}
                  {i === 0 && <span className="ml-2 rounded bg-ok/10 px-1.5 py-0.5 text-xs font-semibold text-ok">current</span>}
                </p>
                <p className="mt-0.5 text-sm text-subtle">
                  {new Date(c.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · <span className="font-mono">{c.sha.slice(0, 7)}</span>
                </p>
              </div>
              {i > 0 && (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => restore(c)}
                  className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:bg-surface disabled:opacity-40"
                >
                  {busy === c.sha ? "Restoring…" : "Restore this version"}
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
