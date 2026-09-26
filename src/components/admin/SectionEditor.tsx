"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { validateSection, type Section } from "@/lib/schema";
import { api, ApiError } from "./api";
import { FieldsEditor, ObjectListEditor } from "./FieldEditor";
import PublishStatus, { type Publish } from "./PublishStatus";

type Obj = Record<string, unknown>;

export default function SectionEditor({ section, onDirtyChange }: { section: Section; onDirtyChange?: (dirty: boolean) => void }) {
  const [original, setOriginal] = useState<string>("");
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [publish, setPublish] = useState<Publish>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.getContent<unknown>(section.id);
      setData(data);
      setOriginal(JSON.stringify(data));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Could not load this section.");
    } finally {
      setLoading(false);
    }
  }, [section.id]);

  useEffect(() => {
    setPublish(null);
    setProblems([]);
    setSaveError("");
    load();
  }, [load]);

  const dirty = useMemo(() => data !== null && JSON.stringify(data) !== original, [data, original]);
  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    const errs = validateSection(section, data);
    setProblems(errs);
    setSaveError("");
    if (errs.length) return;
    setSaving(true);
    try {
      const res = await api.saveContent(section.id, data);
      setOriginal(JSON.stringify(data));
      setPublish({ sha: res.sha, devMode: res.devMode, label: section.label });
    } catch (e) {
      if (e instanceof ApiError && e.problems.length) setProblems(e.problems);
      setSaveError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{section.label}</h1>
        <p className="mt-1 text-muted">{section.description}</p>
      </header>

      {loading && <p className="text-muted">Loading…</p>}
      {loadError && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm">
          <p className="font-semibold text-danger">{loadError}</p>
          <button onClick={load} className="mt-2 font-medium text-accent hover:underline">
            Try again
          </button>
        </div>
      )}

      {!loading && !loadError && data !== null && (
        <>
          <div className="space-y-6 pb-28">
            {section.kind === "list" ? (
              <ObjectListEditor
                fields={section.fields}
                itemTitle={section.itemTitle ?? "title"}
                addLabel={section.addLabel}
                value={data as Obj[]}
                onChange={setData}
                idPrefix={section.id}
              />
            ) : (
              <div className="rounded-2xl border border-line bg-bg p-5 sm:p-6">
                <FieldsEditor fields={section.fields} value={data as Obj} onChange={setData} idPrefix={section.id} />
              </div>
            )}
            <PublishStatus publish={publish} />
          </div>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 backdrop-blur lg:left-64">
            <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="min-w-0 text-sm">
                {problems.length > 0 ? (
                  <details className="text-danger">
                    <summary className="cursor-pointer font-semibold">
                      {problems.length} problem{problems.length > 1 ? "s" : ""} to fix before saving
                    </summary>
                    <ul className="mt-1 max-h-32 list-disc overflow-auto pl-5">
                      {problems.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </details>
                ) : saveError ? (
                  <span className="font-semibold text-danger">{saveError}</span>
                ) : dirty ? (
                  <span className="font-medium text-warn">● Unsaved changes</span>
                ) : (
                  <span className="text-subtle">All changes saved</span>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={!dirty || saving}
                  onClick={() => {
                    if (confirm("Discard your unsaved changes?")) {
                      setData(JSON.parse(original));
                      setProblems([]);
                    }
                  }}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-semibold transition hover:bg-surface disabled:opacity-40"
                >
                  Discard
                </button>
                <button
                  type="button"
                  disabled={!dirty || saving}
                  onClick={save}
                  className="rounded-lg bg-ok px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                >
                  {saving ? "Publishing…" : "Save & publish"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
