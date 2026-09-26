"use client";

import { useEffect, useState } from "react";
import { waitForDeploy } from "./api";

export type Publish = { sha: string; devMode?: boolean; label: string } | null;

// Shows the journey of a saved change: saved → site rebuilding → live.
export default function PublishStatus({ publish, onDone }: { publish: Publish; onDone?: () => void }) {
  const [state, setState] = useState<"building" | "live" | "slow">("building");
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (!publish || publish.devMode) return;
    let cancelled = false;
    setState("building");
    setSecs(0);
    waitForDeploy(publish.sha, (s) => !cancelled && setSecs(s)).then((ok) => {
      if (cancelled) return;
      setState(ok ? "live" : "slow");
      if (ok) onDone?.();
    });
    return () => {
      cancelled = true;
    };
  }, [publish, onDone]);

  if (!publish) return null;

  if (publish.devMode) {
    return (
      <div role="status" className="rounded-xl border border-warn/40 bg-warn/10 p-4 text-sm">
        <p className="font-semibold text-warn">Local preview mode — nothing was saved.</p>
        <p className="mt-1 text-muted">Your changes passed validation. Once the site is deployed, the same button saves and publishes them.</p>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-line bg-surface p-4 text-sm">
      <ol className="space-y-2">
        <li className="flex items-center gap-2">
          <span className="text-ok">✓</span> <span>{publish.label} saved</span>
          <span className="font-mono text-xs text-subtle">({publish.sha.slice(0, 7)})</span>
        </li>
        <li className="flex items-center gap-2">
          {state === "building" ? <span className="inline-block size-3 animate-spin rounded-full border-2 border-accent border-t-transparent" /> : <span className="text-ok">✓</span>}
          <span>{state === "building" ? `Updating your public website… ${secs ? `(${secs}s)` : ""}` : "Website rebuilt"}</span>
        </li>
        <li className="flex items-center gap-2">
          {state === "live" ? <span className="text-ok">✓</span> : <span className="inline-block size-3 rounded-full border-2 border-line" />}
          <span className={state === "live" ? "font-semibold text-ok" : "text-muted"}>
            {state === "live" ? "Live now" : state === "slow" ? "Taking longer than usual — it will appear shortly." : "Goes live in about 1–2 minutes"}
          </span>
          {state === "live" && (
            <a href="/" target="_blank" className="ml-auto text-accent hover:underline">
              View site ↗
            </a>
          )}
        </li>
      </ol>
    </div>
  );
}
