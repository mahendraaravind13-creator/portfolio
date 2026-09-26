#!/usr/bin/env node
// Creates the ADMIN_PASSWORD_HASH value. Your plain password is never stored anywhere.
// Usage: npm run hash-password          (prompts, input hidden)
//        npm run hash-password -- "pw"  (non-interactive)
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline";

const ITERATIONS = 100_000; // Cloudflare Workers' PBKDF2 maximum

function hash(pw) {
  const salt = randomBytes(16);
  const key = pbkdf2Sync(pw, salt, ITERATIONS, 32, "sha256");
  return `pbkdf2-sha256$${ITERATIONS}$${salt.toString("base64")}$${key.toString("base64")}`;
}

function check(pw) {
  if (pw.length < 12) {
    console.error("Use at least 12 characters (a short sentence works well).");
    process.exit(1);
  }
}

const arg = process.argv[2];
if (arg) {
  check(arg);
  console.log(hash(arg));
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  rl._writeToOutput = (s) => rl.output.write(s.includes("Password") ? s : "*");
  rl.question("Password: ", (pw) => {
    rl.close();
    console.log();
    check(pw);
    console.log("\nADMIN_PASSWORD_HASH =\n" + hash(pw) + "\n");
  });
}
