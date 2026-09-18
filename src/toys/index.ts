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
  Component: ComponentType;
};

// Six entries. Six is the ceiling: a seventh card has to displace one.
// Accent purpose: each toy owns one accent, so the grid reads as six toys
// instead of one tile copied six times, and the accent follows the toy into its
// own stage (R-14, R-29).
// No art in the registry: the tile shows a gold hairline and a gold index
// numeral built from array order, so deleting the emoji left nothing to redraw.
export const toys: Toy[] = [
  {
    slug: "every-website",
    title: "Every website",
    blurb: "A page that drowns in its own popups, then cleans up.",
    accent: "blue",
    Component: EveryWebsite,
  },
  {
    slug: "not-a-robot",
    title: "Not a robot",
    blurb: "A captcha that takes itself very seriously.",
    accent: "pink",
    Component: NotARobot,
  },
  {
    slug: "cursor-chaos",
    title: "Cursor chaos",
    blurb: "1998 called. Your cursor answered.",
    accent: "lime",
    Component: CursorChaos,
  },
  {
    slug: "guestbook",
    title: "Guestbook",
    blurb: "Sign it. Entries stay in your browser, as it says.",
    accent: "amber",
    Component: Guestbook,
  },
  {
    slug: "dialup-karaoke",
    title: "Dial-up karaoke",
    blurb: "Sing along with a modem handshake made of code.",
    accent: "blue",
    Component: DialupKaraoke,
  },
  {
    slug: "slop-machine",
    title: "Slop machine",
    blurb: "Paste a sentence, get it back as LinkedIn bait.",
    accent: "pink",
    Component: SlopMachine,
  },
];
