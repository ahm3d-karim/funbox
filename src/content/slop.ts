// slop-machine copy + dialect labels (agent-03 owns the toy that renders these).
//
// WHERE THE TEMPLATES LIVE: src/lib/engine.ts (agent-01). That file is deliberately
// import-free so agent-04's `node --experimental-strip-types` harness resolves it
// without the @/* alias, which means the lib side cannot import from src/content.
// So the template bank has exactly ONE home: engine.ts. Do not paste a second bank
// here, a fork means the toy shows something the harness never tested.
//
// Honesty: templates are parodies of an observable style, never quotes from real
// posts, never a real person's name, and no invented statistics.

import type { Dialect } from "@/lib/engine";

export const dialects: Dialect[] = ["linkedin", "seo", "engagement"];

export const dialectLabels: Record<Dialect, { label: string; tagline: string }> = {
  linkedin: { label: "LinkedIn bait", tagline: "Your sentence, wearing a blazer" },
  seo: { label: "SEO blog", tagline: "Written for a robot. Read by a person, unfortunately" },
  engagement: { label: "Engagement farm", tagline: "It ends in a question, because a question is a machine" },
};

export const slopUi = {
  inputLabel: "Your plain sentence",
  inputPlaceholder: "i made a spreadsheet of my cat's naps",
  button: "Slopify",
  buttonAgain: "Slopify something else",
  empty: "Type something first. Even a few words works.",
  tooLong: "Keep it under 300 characters. The internet has limits, but only for you.",
  outputLabel: "Slopified",
  copy: "Copy",
  copied: "Copied",
  example: "Try an example",
  examples: [
    "i made a spreadsheet of my cat's naps",
    "my team stopped having standups",
    "the printer works now",
    "i learned to make good chai",
  ],
  noNetwork: "Three dialects, templates only. No model, no API, no network. Same input, same output, every time.",
};

// ---------- the slop score ----------
//
// What this is: a joke meter over YOUR text, computed in the toy, in this browser.
// What it is NOT: a claim about writing, an AI judgement, or anything measured about
// you. The weights below are arbitrary on purpose and the UI says so out loud, so
// nobody can mistake a number we invented for a number we measured.
// Markers are stems, so they fire while you are still typing the word ("leverag" hits
// leverage and leveraging) and the score visibly moves as you type.

export type SlopMarker = { term: string; weight: number };

export const slopMarkers: SlopMarker[] = [
  { term: "leverag", weight: 8 },
  { term: "synerg", weight: 10 },
  { term: "humbled", weight: 8 },
  { term: "thrilled", weight: 6 },
  { term: "excited to share", weight: 9 },
  { term: "journey", weight: 7 },
  { term: "unlock", weight: 7 },
  { term: "seamless", weight: 9 },
  { term: "game-chang", weight: 11 },
  { term: "disrupt", weight: 8 },
  { term: "thought leader", weight: 10 },
  { term: "at scale", weight: 6 },
  { term: "circle back", weight: 6 },
  { term: "low-hanging fruit", weight: 7 },
  { term: "deep dive", weight: 5 },
  { term: "bandwidth", weight: 6 },
  { term: "ideat", weight: 6 },
  { term: "pivot", weight: 5 },
  { term: "ecosystem", weight: 5 },
  { term: "value-add", weight: 6 },
  { term: "proactive", weight: 5 },
  { term: "hustle", weight: 5 },
  { term: "grind", weight: 4 },
  { term: "10x", weight: 5 },
  { term: "ai-powered", weight: 8 },
  { term: "literally", weight: 5 },
  { term: "basically", weight: 4 },
  { term: "actually", weight: 3 },
  { term: "!!", weight: 3 },
];

// Tiers must cover 0 to 100 with no gap. Same rule as the toy: each marker present
// adds its weight, the total is capped at 100, higher is worse.
export const slopTiers = [
  { min: 0, max: 14, label: "just a person talking", line: "Nothing is firing. Say it and move on." },
  { min: 15, max: 39, label: "mildly online", line: "One meeting away from a caption." },
  { min: 40, max: 69, label: "LinkedIn is calling", line: "This is a comment with a photo attached." },
  { min: 70, max: 89, label: "peak slop", line: "This could fund a course." },
  { min: 90, max: 100, label: "maxed out", line: "A keynote is owed. Somewhere, a standing desk trembles." },
];

// The goal, in one button: a sentence stuffed with the heaviest markers above.
export const worstSentence =
  "I am humbled and thrilled to share that I am leveraging a seamless, AI-powered, game-changing journey to unlock synergy at scale, and as a thought leader I will circle back on the low-hanging fruit, pivot the ecosystem, ideate the value-add, add proactive bandwidth to the grind, and 10x the hustle, because I am literally basically actually excited to share!!";

export const slopScoreUi = {
  label: "Slop score",
  of: "of 100",
  higher: "higher is worse",
  worst: "Worst possible sentence",
  worstHint: "Fills the box with a sentence built from the heaviest markers",
  firing: "What is firing",
  clean: "No markers yet. Type something plain, then ruin it.",
  note: "Counted in this page, from your own words: each marker adds its weight, capped at 100. The weights are arbitrary on purpose and nothing is sent anywhere.",
};
