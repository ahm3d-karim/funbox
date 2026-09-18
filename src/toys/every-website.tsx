"use client";

// every-website: a fake 2026 article page that drowns itself in exactly the
// overlays the internet actually uses, then cleans up and shows the article.
// DEMO PATH, never cut (brief.md). Copy comes from src/content/everyWebsite.ts
// (agent-03); the escalation rule comes from src/lib/engine.ts (agent-01).
//
// Escalation: round 0 is the banner you get on arrival, then Accept/dismiss
// spawns nextSpawnRound(round, CAP) = 1, 2, 4, 8 ... overlays. The 3rd Accept
// takes the pile to the cap, which is when the page cleans itself up.
// ponytail: pile is a flat array with O(n) spawn per click, n <= 12 by design.
// Upgrade path if the cap ever grows: spawn ids from a ref instead of state.

import { useEffect, useState } from "react";
import { nextSpawnRound } from "@/lib/engine";
import {
  article,
  cleanupReveal,
  overlayClose,
  overlays,
  stopTheMadness,
  type OverlayCopy,
  type OverlayKind,
} from "@/content/everyWebsite";

const CAP = 12;
const ORDER: OverlayKind[] = ["consent", "newsletter", "chat", "video", "offer"];

type Item = { key: number; copy: OverlayCopy };

// Deterministic: the nth overlay ever spawned is always the same overlay.
function pick(n: number): OverlayCopy {
  const bank = overlays[ORDER[n % ORDER.length]];
  return bank[Math.floor(n / ORDER.length) % bank.length];
}

function mmss(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function Overlay({ item, left, onAct }: { item: OverlayCopy; left: number; onAct: () => void }) {
  return (
    <div className="mx-auto max-w-[22rem] rounded-[var(--radius)] border border-line bg-surface p-4">
      <p className="text-sm font-semibold">{item.heading}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-dim">{item.body}</p>

      {item.kind === "offer" && (
        <p className="mt-2 font-mono text-sm text-[var(--toy)]">{mmss(left)} left</p>
      )}

      {item.kind === "video" && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded bg-line">
          <div className="h-full w-1/3 bg-[var(--toy)]" />
        </div>
      )}

      {item.checkbox && (
        <label className="mt-2 flex items-start gap-2 text-xs text-ink-dim">
          <input type="checkbox" defaultChecked className="mt-0.5" />
          <span>{item.checkbox}</span>
        </label>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onAct}
          className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--toy)] px-4 text-sm font-semibold text-bg"
        >
          {item.accept}
        </button>
        {/* the grey reject text, 6px, contrast measured not guessed */}
        <button type="button" onClick={onAct} className="text-ink-dim underline" style={{ fontSize: "6px" }}>
          {item.decline}
        </button>
      </div>

      <button type="button" onClick={onAct} className="mt-3 text-xs text-ink-dim underline">
        {overlayClose}
      </button>
    </div>
  );
}

export default function EveryWebsite() {
  const [round, setRound] = useState(0);
  const [spawned, setSpawned] = useState(1);
  const [pile, setPile] = useState<Item[]>([{ key: 0, copy: pick(0) }]);
  const [clean, setClean] = useState(false);
  const [left, setLeft] = useState(599);

  const counting = pile.some((item) => item.copy.kind === "offer");

  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setLeft((s) => (s <= 1 ? 599 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [counting]);

  function act(key: number) {
    const next = round + 1;
    const count = nextSpawnRound(next, CAP);
    const grown = [
      ...pile.filter((item) => item.key !== key),
      ...Array.from({ length: count }, (_, n) => ({ key: spawned + n, copy: pick(spawned + n) })),
    ];
    setRound(next);
    setSpawned(spawned + count);
    if (grown.length >= CAP) {
      setPile([]);
      setClean(true);
    } else {
      setPile(grown);
    }
  }

  return (
    <div className="min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
        <span className="text-xs text-ink-dim">{stopTheMadness.hint}</span>
        <button
          type="button"
          onClick={() => {
            setPile([]);
            setClean(true);
          }}
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--toy)] px-3 text-sm font-semibold"
        >
          {stopTheMadness.label}
        </button>
      </div>

      <div className="relative">
        <article className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-xs uppercase tracking-widest text-ink-dim">{article.kicker}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{article.title}</h2>
          <p className="mt-2 text-ink-dim">{article.dek}</p>
          <p className="mt-4 text-xs text-ink-dim">
            {article.byline} / {article.date}
          </p>
          {article.body.map((para) => (
            <p key={para} className="mt-4 leading-relaxed">
              {para}
            </p>
          ))}
        </article>

        {pile.map((item, i) => (
          <div
            key={item.key}
            className="absolute inset-x-3"
            style={{ top: 8 + (i % 5) * 6, zIndex: 10 + i }}
          >
            <Overlay item={item.copy} left={left} onAct={() => act(item.key)} />
          </div>
        ))}
      </div>

      {clean && (
        <section className="mx-auto max-w-2xl px-4 pb-10">
          <div className="rounded-[var(--radius)] border border-[var(--toy)] p-5">
            <h3 className="text-lg font-semibold">{cleanupReveal.heading}</h3>
            <p className="mt-1 text-[var(--toy)]">{cleanupReveal.line}</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-ink-dim">
              {cleanupReveal.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-dim">{cleanupReveal.footnote}</p>
          </div>
        </section>
      )}
    </div>
  );
}
