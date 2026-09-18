import type { ComponentType } from "react";
import EveryWebsite from "./every-website";
import NotARobot from "./not-a-robot";
import CursorChaos from "./cursor-chaos";
import Guestbook from "./guestbook";
import DialupKaraoke from "./dialup-karaoke";
import SlopMachine from "./slop-machine";

export type Toy = {
  slug: string; // "every-website"
  title: string; // card title, sentence case
  blurb: string; // <= 70 chars, no em dashes
  accent: "blue" | "pink" | "lime" | "amber"; // token name, not a hex
  glyph: string; // decorative emoji, aria-hidden in the UI: the title is the name
  Component: ComponentType;
};

// Six entries. Six is the ceiling: a seventh card has to displace one.
// Accent purpose: each toy owns one accent, so the grid reads as six toys
// instead of one tile copied six times, and the accent follows the toy into its
// own stage (R-14, R-29).
// Glyph purpose: one emoji per tile, chosen for what that toy actually is, not
// for decoration. All six are aria-hidden, so they never enter the accessible
// name.
export const toys: Toy[] = [
  {
    slug: "every-website",
    title: "Every website",
    blurb: "A page that drowns in its own popups, then cleans up.",
    accent: "blue",
    glyph: "🍪",
    Component: EveryWebsite,
  },
  {
    slug: "not-a-robot",
    title: "Not a robot",
    blurb: "A captcha that takes itself very seriously.",
    accent: "pink",
    glyph: "🤖",
    Component: NotARobot,
  },
  {
    slug: "cursor-chaos",
    title: "Cursor chaos",
    blurb: "1998 called. Your cursor answered.",
    accent: "lime",
    glyph: "✨",
    Component: CursorChaos,
  },
  {
    slug: "guestbook",
    title: "Guestbook",
    blurb: "Sign it. Entries stay in your browser, as it says.",
    accent: "amber",
    glyph: "✍️",
    Component: Guestbook,
  },
  {
    slug: "dialup-karaoke",
    title: "Dial-up karaoke",
    blurb: "Sing along with a modem handshake made of code.",
    accent: "blue",
    glyph: "☎️",
    Component: DialupKaraoke,
  },
  {
    slug: "slop-machine",
    title: "Slop machine",
    blurb: "Paste a sentence, get it back as LinkedIn bait.",
    accent: "pink",
    glyph: "🥫",
    Component: SlopMachine,
  },
];
