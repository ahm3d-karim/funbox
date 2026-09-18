// ToyArt: six monoline motifs, one per toy card. agent-01.
// Every motif is one <svg viewBox="0 0 48 48">, currentColor, no fill, 2px,
// round caps and joins, 2-5 paths, no text. Geometry only, drawn for 40px.
// ponytail: one wrapper + one record, no per-motif component and no size prop
// until a caller actually needs a different size.

import type { ReactNode } from "react";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

// every-website: three banners stacked on top of each other, the top one with
// the button you cannot see past.
const everyWebsite = (
  <>
    <rect x="14" y="11" width="28" height="12" rx="2" />
    <rect x="10" y="18" width="28" height="12" rx="2" />
    <rect x="6" y="25" width="28" height="12" rx="2" />
    <path d="M10 31h12" />
  </>
);

// not-a-robot: a checkbox grid where the last tick leaves its square.
const notARobot = (
  <>
    <path d="M5 5h14v14H5zM29 5h14v14H29zM5 29h14v14H5zM29 29h14v14H29z" />
    <path d="M9 12l3.5 3.5L19 9" />
    <path d="M32 37l4 4 9-11" />
  </>
);

// cursor-chaos: a trail that loops once on its way past, with two sparkles.
const cursorChaos = (
  <>
    <path d="M14 30c-8-2-8-12 0-12s8 8 0 10c8 4 18 6 26 2" />
    <path d="M34 10v11M28.5 15.5h11M14 13v6M11 16h6" />
  </>
);

// guestbook: an open book, spine down the middle, a pen laid across it.
const guestbook = (
  <>
    <path d="M8 13c6-1 12 0 16 3 4-3 10-4 16-3v20c-6-1-12 0-16 3-4-3-10-4-16-3z" />
    <path d="M24 16v20" />
    <path d="M33 11L23 21" />
    <path d="M23 21l-2 5M23 21l5 2" />
  </>
);

// slop-machine: a tin can, lid rim and a two-line label.
const slopMachine = (
  <>
    <path d="M14 16v16c0 2.2 4.5 4 10 4s10-1.8 10-4V16" />
    <path d="M34 16c0 2.2-4.5 4-10 4s-10-1.8-10-4 4.5-4 10-4 10 1.8 10 4z" />
    <path d="M19 26h10M19 30h6" />
  </>
);

// dialup-karaoke: a coiled cord between two plugs.
const dialupKaraoke = (
  <>
    <path d="M8 20H4v8h4" />
    <path d="M40 20h-4v8h4" />
    <path d="M8 24c0-5 5-5 5 0s5 5 5 0 5-5 5 0 5 5 5 0h8" />
  </>
);

const art: Record<string, ReactNode> = {
  "every-website": everyWebsite,
  "not-a-robot": notARobot,
  "cursor-chaos": cursorChaos,
  guestbook: guestbook,
  "slop-machine": slopMachine,
  "dialup-karaoke": dialupKaraoke,
};

export const toyArtSlugs = Object.keys(art);

export function ToyArt({ slug }: { slug: string }) {
  const motif = art[slug];
  return motif ? <Frame>{motif}</Frame> : null;
}
