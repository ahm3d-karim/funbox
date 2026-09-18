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
