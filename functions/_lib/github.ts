import type { Env } from "./env";
import { b64decode, b64encode } from "./auth";

/** Thin wrapper over the GitHub REST API. Content lives in the repo, so every save is a commit (free backup + undo). */
export class GitHub {
  private branch: string;
  constructor(private env: Env) {
    this.branch = (env.GITHUB_BRANCH ?? "").trim() || "main";
  }

  private get token() {
    return (this.env.GITHUB_TOKEN ?? "").trim();
  }
  private get repo() {
    return (this.env.GITHUB_REPO ?? "").trim().replace(/^https:\/\/github\.com\//, "").replace(/\.git$/, "").replace(/\/$/, "");
  }

  get configured() {
    return Boolean(this.token && this.repo);
  }

  /** Human-readable list of missing settings (names only). */
  get missing(): string {
    return [!this.token && "GITHUB_TOKEN", !this.repo && "GITHUB_REPO"].filter(Boolean).join(" and ");
  }

  private async api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`https://api.github.com/repos/${this.repo}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${this.token}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "portfolio-admin",
        ...(init.body ? { "content-type": "application/json" } : {}),
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new GitHubError(res.status, `GitHub ${init.method ?? "GET"} ${path} → ${res.status}: ${body.slice(0, 300)}`);
    }
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
  }

  /** Reads a text file from the branch (or from a past commit when `ref` is given). */
  async readText(path: string, ref = this.branch): Promise<string | null> {
    try {
      const file = await this.api<{ content: string; encoding: string }>(`/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`);
      return new TextDecoder().decode(b64decode(file.content.replace(/\n/g, "")));
    } catch (e) {
      if (e instanceof GitHubError && e.status === 404) return null;
      throw e;
    }
  }

  /** Commits one or more files in a single atomic commit and returns the new commit SHA. */
  async commit(files: { path: string; bytes: Uint8Array }[], message: string): Promise<string> {
    const ref = await this.api<{ object: { sha: string } }>(`/git/ref/heads/${this.branch}`);
    const parent = await this.api<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
    const tree = await Promise.all(
      files.map(async (f) => {
        const blob = await this.api<{ sha: string }>(`/git/blobs`, {
          method: "POST",
          body: JSON.stringify({ content: b64encode(f.bytes), encoding: "base64" }),
        });
        return { path: f.path, mode: "100644", type: "blob", sha: blob.sha };
      }),
    );
    const newTree = await this.api<{ sha: string }>(`/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
    });
    const commit = await this.api<{ sha: string }>(`/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
    });
    await this.api(`/git/refs/heads/${this.branch}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });
    return commit.sha;
  }

  async history(paths: string[], limit = 30) {
    type C = { sha: string; commit: { message: string; author: { name: string; date: string } } };
    const lists = await Promise.all(
      paths.map((p) => this.api<C[]>(`/commits?sha=${this.branch}&path=${encodeURIComponent(p)}&per_page=${limit}`)),
    );
    const seen = new Set<string>();
    return lists
      .flat()
      .filter((c) => (seen.has(c.sha) ? false : (seen.add(c.sha), true)))
      .map((c) => ({ sha: c.sha, message: c.commit.message.split("\n")[0], author: c.commit.author.name, date: c.commit.author.date }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
  }
}

export class GitHubError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const encodePath = (p: string) => p.split("/").map(encodeURIComponent).join("/");
export const utf8 = (s: string) => new TextEncoder().encode(s);
