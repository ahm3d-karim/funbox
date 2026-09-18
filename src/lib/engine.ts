// FUNBOX engines. Pure, deterministic, ZERO imports on purpose: agent-04's
// harness runs this file through `node --experimental-strip-types`, which does
// not resolve the @/* alias, so the import graph must end here. agent-01.

export type Dialect = "linkedin" | "seo" | "engagement";

export type CaptchaCell = { id: number; label: string; correct: boolean };
export type Grid = { cells: CaptchaCell[] };
export type Verdict = { pass: boolean; reason: string };

// The three dialects, as templates. {text} is the user's sentence.
const SLOP: Record<Dialect, string[]> = {
  linkedin: [
    "I'm humbled to share that {text}",
    "Three years ago I had nothing but a dream and a standing desk. Today: {text}",
    "Reposting this for my network, because {text}",
    "What does this mean for leadership? {text}",
    "#blessed #gratitude #growthmindset #opentowork",
  ],
  seo: [
    "In today's fast-paced digital landscape, {text} (2026 guide)",
    "Quick answer: {text}. Long answer: nine sections and an email capture.",
    "People also ask: what is {text}, is {text} worth it, {text} near me",
    "TL;DR: {text}. Now here is 1,400 words about nothing.",
  ],
  engagement: [
    "You won't BELIEVE what happened next: {text}",
    "TELL ME YOU DIDN'T JUST READ THIS: {text}",
    "Comment YES if you agree and I'll send you the free template. {text}",
    "Nobody is talking about this. {text}",
    "Wait for it... {text}",
  ],
};

export function slopify(text: string, dialect: Dialect): string {
  const source = text.trim() || "you clicked a button on the internet";
  return SLOP[dialect].map((line) => line.split("{text}").join(source)).join("\n");
}

// Overlay pile escalation: round 0 is the banner you get on entry, then 1, 2,
// 4, 8 and so on until the cap. Doubling is the joke; the cap is the cleanup.
export function nextSpawnRound(round: number, cap: number): number {
  const r = Math.max(0, Math.floor(round));
  const c = Math.max(1, Math.floor(cap));
  return Math.min(c, 2 ** r);
}

export function captchaVerdict(picked: number[], grid: Grid): Verdict {
  const known = new Set(grid.cells.map((cell) => cell.id));
  const correct = grid.cells.filter((cell) => cell.correct).map((cell) => cell.id);
  const unique = [...new Set(picked)];

  const unknown = unique.find((id) => !known.has(id));
  if (unknown !== undefined) return { pass: false, reason: `tile ${unknown} is not on this grid` };

  const wrong = unique.filter((id) => !correct.includes(id));
  if (wrong.length > 0) return { pass: false, reason: `wrong tile selected (${wrong.length})` };

  const missing = correct.filter((id) => !unique.includes(id));
  if (missing.length > 0) return { pass: false, reason: `${missing.length} correct tile(s) still missing` };

  return { pass: true, reason: `all ${correct.length} selected` };
}
