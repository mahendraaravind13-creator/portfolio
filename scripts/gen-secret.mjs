#!/usr/bin/env node
// Prints a random SESSION_SECRET (48 bytes, base64url).
import { randomBytes } from "node:crypto";
console.log(randomBytes(48).toString("base64url"));
