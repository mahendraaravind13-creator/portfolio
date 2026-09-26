/// <reference types="@cloudflare/workers-types" />

/** Environment variables configured in Cloudflare Pages → Settings → Variables and Secrets (or .dev.vars locally). */
export interface Env {
  /** Admin login name. */
  ADMIN_USERNAME: string;
  /** Output of `npm run hash-password` — never the plain password. */
  ADMIN_PASSWORD_HASH: string;
  /** Long random string used to sign session cookies (`npm run gen-secret`). */
  SESSION_SECRET: string;
  /** Fine-grained GitHub token: this repo only, "Contents: Read and write". */
  GITHUB_TOKEN: string;
  /** "owner/repo", e.g. "mahendraaravind13-creator/portfolio". */
  GITHUB_REPO: string;
  /** Branch Cloudflare deploys from. Defaults to "main". */
  GITHUB_BRANCH?: string;
  /** Optional KV namespace for login rate limiting (strongly recommended). */
  LOGIN_KV?: KVNamespace;
  /** "true" only in local .dev.vars: reads bundled content and does not commit. */
  DEV_MODE?: string;
}

export type Data = { user?: string };
