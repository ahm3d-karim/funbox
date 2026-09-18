// Harness for src/lib (agent-04, TODO #12). Run from work/shared/app:
//   node --experimental-strip-types --test "tests/*.test.ts"
import { test } from "node:test";
import assert from "node:assert/strict";
import { slopify, nextSpawnRound, captchaVerdict, type Grid } from "../src/lib/engine.ts";

test("slopify: non-empty, differs from input, deterministic", () => {
  const input = "I fixed a bug today";
  const out = slopify(input, "linkedin");
  assert.ok(out.trim().length > 0, "slopify returned empty");
  assert.notEqual(out, input);
  assert.ok(out.includes(input), "the user's own words must survive the slop");
  assert.equal(out, slopify(input, "linkedin"), "slopify must be deterministic");
});

test("slopify: the three dialects differ from each other", () => {
  const input = "I fixed a bug today";
  const [a, b, c] = (["linkedin", "seo", "engagement"] as const).map((d) => slopify(input, d));
  assert.notEqual(a, b);
  assert.notEqual(b, c);
  assert.notEqual(a, c);
});

test("slopify: empty input still produces a joke, never blank", () => {
  assert.ok(slopify("   ", "seo").trim().length > 0);
});

test("nextSpawnRound: round 0 is the entry banner, then it doubles", () => {
  assert.equal(nextSpawnRound(0, 64), 1);
  assert.equal(nextSpawnRound(1, 64), 2);
  assert.equal(nextSpawnRound(2, 64), 4);
  assert.equal(nextSpawnRound(3, 64), 8);
});

test("nextSpawnRound: escalates monotonically and caps", () => {
  const cap = 12;
  let prev = -1;
  for (let r = 0; r <= 20; r++) {
    const n = nextSpawnRound(r, cap);
    assert.ok(n >= prev, `round ${r} went backwards: ${n} < ${prev}`);
    assert.ok(n <= cap, `round ${r} exceeded cap: ${n} > ${cap}`);
    prev = n;
  }
  assert.equal(nextSpawnRound(50, cap), cap, "high rounds must sit at the cap");
});

test("nextSpawnRound: junk input is clamped, never NaN or negative", () => {
  for (const [r, cap] of [
    [-3, 8],
    [2.7, 8],
    [2, 0],
    [2, -4],
  ] as const) {
    const n = nextSpawnRound(r, cap);
    assert.ok(Number.isInteger(n) && n >= 1, `nextSpawnRound(${r},${cap}) = ${n}`);
  }
});

// Known grid: the contract's "known grid" for captchaVerdict.
const grid: Grid = {
  cells: [
    { id: 1, label: "a bus", correct: true },
    { id: 2, label: "a fire hydrant", correct: false },
    { id: 3, label: "a bus", correct: true },
    { id: 4, label: "my hopes", correct: true },
  ],
};

test("captchaVerdict: all correct tiles selected passes", () => {
  const v = captchaVerdict([1, 3, 4], grid);
  assert.equal(v.pass, true, v.reason);
  assert.ok(v.reason.length > 0);
});

test("captchaVerdict: a wrong tile fails and says so", () => {
  const v = captchaVerdict([1, 2, 3, 4], grid);
  assert.equal(v.pass, false);
  assert.match(v.reason, /wrong/i);
});

test("captchaVerdict: a missing correct tile fails and says so", () => {
  const v = captchaVerdict([1], grid);
  assert.equal(v.pass, false);
  assert.match(v.reason, /missing|still/i);
});

test("captchaVerdict: an off-grid id fails instead of passing by accident", () => {
  const v = captchaVerdict([1, 3, 4, 99], grid);
  assert.equal(v.pass, false);
  assert.match(v.reason, /99/);
});

test("captchaVerdict: duplicate picks do not double-count", () => {
  assert.equal(captchaVerdict([1, 1, 3, 3, 4], grid).pass, true);
  assert.equal(captchaVerdict([], grid).pass, false, "empty selection must not pass");
});
