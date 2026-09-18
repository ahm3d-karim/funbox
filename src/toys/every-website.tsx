"use client";

// every-website: a fake 2026 article page that drowns itself in exactly the
// overlays the internet actually uses, then cleans up and shows the article.
// DEMO PATH, never cut (brief.md). Copy comes from src/content/everyWebsite.ts
// (agent-03); the escalation rule comes from src/lib/engine.ts (agent-01).
//
// It is a fight, not a video: the HUD counts what complying cost you (consents)
// against what resisting won (dismissed, reads), the pile dodges once when you
// reach for it, Esc kills the banner under your focus instead of the toy, and
// the cleanup reveal offers a harder level.
//
// Escalation: round 0 is the banner you get on arrival, then Accept/dismiss
// spawns nextSpawnRound(round, cap) = 1, 2, 4, 8 ... overlays. Level 1 caps at
// BASE_CAP and is the exact demo path: 3 Accepts -> 2, then 5, then the cap ->
// cleanup reveal. Levels raise the cap by two and drip banners on a timer.
// ponytail: pile is a flat array, n <= cap by design. Upgrade path if the cap
// ever grows past a screenful: virtualise the pile instead of stacking it.

import { useEffect, useRef, useState } from "react";
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

const BASE_CAP = 12;
const ORDER: OverlayKind[] = ["consent", "newsletter", "chat", "video", "offer"];
const DODGE_PX = 16;

// The toy's own scoreboard words. agent-03 owns the widget copy in src/content;
// these four are the game's chrome and can move there whenever it is convenient.
const hud = { level: "level", dismissed: "banners dismissed", consents: "consents given", reads: "article reads" };
const readLabel = "Read the article";
const harderLabel = "Run it again, harder";

type Item = { key: number; copy: OverlayCopy };
type Kind = "consent" | "dismiss";

// Deterministic: the nth banner is always the same banner.
function pick(n: number): OverlayCopy {
  const bank = overlays[ORDER[n % ORDER.length]];
  return bank[Math.floor(n / ORDER.length) % bank.length];
}

function nextKey(items: Item[]): number {
  return items.reduce((max, item) => Math.max(max, item.key), 0) + 1;
}

function mmss(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function Overlay({ item, left, onAct }: { item: OverlayCopy; left: number; onAct: (kind: Kind) => void }) {
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
          onClick={() => onAct("consent")}
          className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--toy)] px-4 text-sm font-semibold text-bg"
        >
          {item.accept}
        </button>
        {/* the grey reject text, 6px, contrast measured not guessed */}
        <button
          type="button"
          onClick={() => onAct("dismiss")}
          className="text-ink-dim underline"
          style={{ fontSize: "6px" }}
        >
          {item.decline}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onAct("dismiss")}
        className="mt-3 text-xs text-ink-dim underline"
      >
        {overlayClose}
      </button>
    </div>
  );
}

export default function EveryWebsite() {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(0);
  const [pile, setPile] = useState<Item[]>([{ key: 1, copy: pick(0) }]);
  const [dodged, setDodged] = useState<number[]>([]);
  const [clean, setClean] = useState(false);
  const [left, setLeft] = useState(599);
  const [consents, setConsents] = useState(0);
  const [dismissed, setDismissed] = useState(0);
  const [reads, setReads] = useState(0);

  const cap = BASE_CAP + 2 * (level - 1);
  const counting = pile.some((item) => item.copy.kind === "offer");

  // one pointer handler for the whole pile: a banner dodges the first time the
  // pointer reaches it, then stands still and takes it.
  function dodge(key: number) {
    setDodged((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  function act(key: number, kind: Kind) {
    const next = round + 1;
    const count = nextSpawnRound(next, cap);
    const rest = pile.filter((item) => item.key !== key);
    const base = nextKey(rest) - 1;
    const grown = [
      ...rest,
      ...Array.from({ length: count }, (_, n) => ({ key: base + n + 1, copy: pick(base + n + 1) })),
    ];
    setRound(next);
    if (kind === "consent") setConsents((n) => n + 1);
    else setDismissed((n) => n + 1);
    if (grown.length >= cap) {
      setPile([]);
      setClean(true);
    } else {
      setPile(grown);
    }
  }

  // the one control that is on your side: it clears a banner instead of paying
  // for it, and clearing the last one gives you the page you came for.
  function readArticle() {
    const rest = pile.slice(0, -1);
    setReads((n) => n + 1);
    if (rest.length === 0) {
      setPile([]);
      setClean(true);
    } else {
      setPile(rest);
    }
  }

  function harder() {
    setLevel((l) => l + 1);
    setPile([{ key: 1, copy: pick(0) }]);
    setDodged([]);
    setRound(0);
    setClean(false);
  }

  // Esc: the banner under your focus dies, otherwise the key belongs to the
  // stage. The stage listens on document in the CAPTURE phase, so this has to be
  // a capture listener registered first (child effects run before the stage's)
  // plus stopImmediatePropagation, not a React onKeyDown, which fires too late.
  const esc = useRef<(key: number) => void>(() => {});
  useEffect(() => {
    esc.current = (key: number) => act(key, "dismiss");
  });
  const stopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const active = document.activeElement;
      const card = active instanceof Element ? active.closest("[data-banner]") : null;
      if (!card) return; // no banner has focus: let the stage close the toy
      event.stopImmediatePropagation();
      event.preventDefault();
      esc.current(Number(card.getAttribute("data-banner")));
      stopRef.current?.focus();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, []);

  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setLeft((s) => (s <= 1 ? 599 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [counting]);

  // level 2+: banners arrive on their own, and each level arrives sooner.
  useEffect(() => {
    if (level < 2 || clean) return;
    const id = setInterval(() => {
      setPile((prev) => {
        if (prev.length >= cap) return prev;
        const key = nextKey(prev);
        return [...prev, { key, copy: pick(key) }];
      });
    }, Math.round(6000 / level));
    return () => clearInterval(id);
  }, [level, clean, cap, pile]);

  return (
    <div className="min-h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
        <span className="text-xs text-ink-dim">{stopTheMadness.hint}</span>
        <button
          ref={stopRef}
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

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-4 py-2 text-xs text-ink-dim">
        <span>
          {hud.level} <span className="font-semibold text-ink">{level}</span>
        </span>
        <span>
          {hud.dismissed} <span className="font-semibold text-ink">{dismissed}</span>
        </span>
        <span>
          {hud.consents} <span className="font-semibold text-ink">{consents}</span>
        </span>
        <span>
          {hud.reads} <span className="font-semibold text-ink">{reads}</span>
        </span>
        {counting && <span className="text-[var(--toy)]">offer expires in {mmss(left)}</span>}
        <button
          type="button"
          onClick={readArticle}
          className="ml-auto min-h-11 rounded-[var(--radius-sm)] border border-line px-3 text-xs font-semibold text-ink"
        >
          {readLabel}
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
            data-banner={item.key}
            onPointerEnter={() => dodge(item.key)}
            className="absolute inset-x-3 transition-transform duration-200 motion-reduce:transition-none"
            style={{
              top: 8 + (i % 5) * 6,
              zIndex: 10 + i,
              transform: dodged.includes(item.key)
                ? `translateX(${item.key % 2 === 0 ? DODGE_PX : -DODGE_PX}px)`
                : undefined,
            }}
          >
            <Overlay item={item.copy} left={left} onAct={(kind) => act(item.key, kind)} />
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
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={harder}
                className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--toy)] px-4 text-sm font-semibold text-bg"
              >
                {harderLabel}
              </button>
              <span className="text-xs text-ink-dim">
                level {level + 1} raises the cap to {BASE_CAP + 2 * level} and starts them arriving on their own.
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
