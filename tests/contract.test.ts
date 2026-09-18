// Contract gate (agent-04, TODO #14) — the cross-file consistency check.
// Runs from the repo root (work/shared/app):
//   node --experimental-strip-types --test "tests/*.test.ts"
// Ratchet design: a file that does not exist yet is skipped, a file that exists
// and breaks the contract fails. Red means a landed file violates CONTRACT.md.
// ponytail: text-parses .tsx/.ts sources instead of importing them (node's
// --experimental-strip-types cannot load .tsx). Upgrade to a real import if the
// registry ever gains behaviour worth asserting.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";

const CONTRACT_SLUGS = [
  "every-website",
  "not-a-robot",
  "cursor-chaos",
  "guestbook",
  "dialup-karaoke",
  "slop-machine",
];
const ACCENTS = ["blue", "pink", "lime", "amber"];
const EM_DASH = "\u2014";
const LIB_EXPORTS = ["slopify", "nextSpawnRound", "captchaVerdict"];
const COPY_DIRS = ["src/content", "src/toys"];
const CODE_DIRS = ["src/lib", "src/toys", "src/components"];

const read = (p: string) => readFileSync(p, "utf8");

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = `${dir}/${name}`;
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const codeFiles = CODE_DIRS.flatMap(walk).filter((p) => /\.(ts|tsx)$/.test(p));

test("registry lists exactly the six contract slugs", () => {
  const f = "src/toys/index.ts";
  if (!existsSync(f)) return; // not landed yet
  const src = read(f);
  const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(
    [...slugs].sort(),
    [...CONTRACT_SLUGS].sort(),
    `src/toys/index.ts slugs != CONTRACT.md: got ${JSON.stringify(slugs)}`,
  );
});

test("every slug the registry imports from ./ has a toy file", () => {
  const f = "src/toys/index.ts";
  if (!existsSync(f)) return;
  // A missing toy file is only a bug when the registry actually imports it.
  // Entries still on the PendingToy placeholder are agent-02's freeze work, not
  // a contract break (the freeze gate greps that separately).
  const src = read(f);
  for (const m of src.matchAll(/import\s+(\w+)\s+from\s+"\.\/([\w-]+)"/g)) {
    assert.ok(existsSync(`src/toys/${m[2]}.tsx`), `src/toys/${m[2]}.tsx missing but imported as ${m[1]}`);
  }
});

test("card blurbs are <= 70 chars and contain no em dash", () => {
  const f = "src/toys/index.ts";
  if (!existsSync(f)) return;
  const src = read(f);
  const blurbs = [...src.matchAll(/blurb:\s*"([^"]*)"/g)].map((m) => m[1]);
  assert.equal(
    blurbs.length,
    [...src.matchAll(/slug:\s*"/g)].length,
    "every registry entry needs a blurb",
  );
  for (const b of blurbs) {
    assert.ok(b.length <= 70, `blurb over 70 chars (${b.length}): ${b}`);
    assert.ok(!b.includes(EM_DASH), `em dash in blurb: ${b}`);
  }
});

test("registry accents are token names from the contract list", () => {
  const f = "src/toys/index.ts";
  if (!existsSync(f)) return;
  for (const m of read(f).matchAll(/accent:\s*"([^"]+)"/g)) {
    assert.ok(ACCENTS.includes(m[1]), `accent "${m[1]}" not in ${ACCENTS}`);
  }
});

test("src/lib exports the three contract functions and no React", () => {
  const files = walk("src/lib");
  if (files.length === 0) return;
  const src = files.map(read).join("\n");
  for (const fn of LIB_EXPORTS) {
    assert.ok(
      new RegExp(`export\\s+(async\\s+)?(function|const)\\s+${fn}\\b`).test(src),
      `src/lib does not export ${fn}()`,
    );
  }
  for (const p of files) {
    assert.ok(
      !/from\s+"react"|from\s+'react'/.test(read(p)),
      `${p} imports React; src/lib must stay framework-free`,
    );
  }
});

test("no em dash in user-facing copy (src/toys/**, src/content/**)", () => {
  for (const p of COPY_DIRS.flatMap(walk).filter((f) => /\.(ts|tsx)$/.test(f))) {
    assert.ok(!read(p).includes(EM_DASH), `em dash in copy: ${p}`);
  }
});

test("no network, no asset files, no runtime API calls", () => {
  for (const p of codeFiles) {
    const src = read(p);
    assert.ok(!/\bfetch\s*\(/.test(src), `fetch() in ${p}: contract says no network`);
    assert.ok(
      !/from\s+"next\/image"|\.(png|jpe?g|gif|webp|svg|mp3|wav|woff2?)"/.test(src),
      `asset or next/image import in ${p}: contract says no asset files`,
    );
  }
});
