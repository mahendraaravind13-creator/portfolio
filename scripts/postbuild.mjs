#!/usr/bin/env node
// Runs after `next build`:
//  1. writes out/version.json with the deployed commit, so the admin portal can tell when a change is live;
//  2. copies the pdf.js worker (used by "Sync skills from resume") into the output.
import { copyFile, writeFile } from "node:fs/promises";

const sha = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || "local";
await writeFile(new URL("../out/version.json", import.meta.url), JSON.stringify({ sha, builtAt: new Date().toISOString() }) + "\n");

await copyFile(
  new URL("../node_modules/pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
  new URL("../out/pdf.worker.min.mjs", import.meta.url),
);
console.log(`postbuild: version ${sha.slice(0, 7)}`);
