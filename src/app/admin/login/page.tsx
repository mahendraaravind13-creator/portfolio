"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/components/admin/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("expired")) setNotice("Your session ended. Please sign in again.");
    // Already signed in? Go straight to the dashboard.
    api.session().then(() => window.location.replace("/admin/")).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.login(username, password);
      window.location.replace("/admin/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-fg text-lg font-bold text-bg">🔒</span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Admin sign-in</h1>
          <p className="mt-1 text-sm text-muted">Manage your portfolio content</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-bg p-6 shadow-sm">
          {notice && !error && <p className="rounded-lg bg-warn/10 p-3 text-sm text-warn">{notice}</p>}
          {error && (
            <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 pr-16 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-muted hover:text-fg">
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-lg bg-fg px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="hover:text-fg">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
