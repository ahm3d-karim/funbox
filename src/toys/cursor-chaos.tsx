"use client";

import { useEffect, useRef, useState } from "react";

// The joke is 1998, so the marquee text is 1998's actual vocabulary, not a
// modern parody of it. Stars, not emoji: this page was made in Notepad.
const MARQUEE =
  "* WELCOME TO MY PAGE * BEST VIEWED IN 800x600 * SIGN MY GUESTBOOK * THIS SITE IS UNDER CONSTRUCTION FOREVER * TELL YOUR FRIENDS *";

const MAX_MOVES = 6;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function CursorChaos() {
  const [hits, setHits] = useState(0);
  const [dodges, setDodges] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrolling, setScrolling] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const pen = useRef<HTMLDivElement>(null);
  const runButton = useRef<HTMLButtonElement>(null);
  // Where the button was when the finger went down, so a tap that landed on it
  // can still win after the button has moved out from under the finger.
  const landedTap = useRef<DOMRect | null>(null);

  const caught = dodges >= MAX_MOVES;

  // reduceMotion gates MOTION ONLY: the sparkle trail and the marquee. It must
  // never gate interaction. Gating the dodge here is what made this toy dead on
  // a machine with reduced motion on.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Sparkle trail. Plain DOM nodes, throttled: no canvas, no rAF loop.
  useEffect(() => {
    if (reduceMotion) return;
    let last = 0;
    const onMove = (e: PointerEvent) => {
      const now = Date.now();
      if (now - last < 45) return;
      last = now;
      const star = document.createElement("span");
      star.className = "cc-sparkle";
      star.textContent = "*";
      star.style.left = `${e.clientX + 6}px`;
      star.style.top = `${e.clientY + 6}px`;
      document.body.appendChild(star);
      window.setTimeout(() => star.remove(), 700);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.querySelectorAll(".cc-sparkle").forEach((n) => n.remove());
    };
  }, [reduceMotion]);

  const dodge = () => {
    if (caught) return;
    const box = pen.current?.getBoundingClientRect();
    const el = runButton.current?.getBoundingClientRect();
    if (!box || !el) return;
    // The hop is capped at 40 percent of the pen each way AND clamped to the
    // slack actually left on that side, measured from the button's current
    // rect (which already includes the applied transform). So the button can
    // never leave the pen, and therefore never leaves the visible stage.
    const capX = box.width * 0.4;
    const capY = box.height * 0.4;
    const left = Math.min(Math.max(0, el.left - box.left), capX);
    const right = Math.min(Math.max(0, box.right - el.right), capX);
    const up = Math.min(Math.max(0, el.top - box.top), capY);
    const down = Math.min(Math.max(0, box.bottom - el.bottom), capY);
    setOffset((o) => ({ x: o.x + rand(-left, right), y: o.y + rand(-up, down) }));
    setDodges(dodges + 1);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    landedTap.current = e.currentTarget.getBoundingClientRect();
    dodge(); // touch has no hover, so the press has to count
  };

  const catchIt = () => {
    if (caught) return;
    setDodges(MAX_MOVES);
  };

  // A tap that landed wins: the finger went down on the button, even though the
  // button then moved out from under it.
  useEffect(() => {
    const onUp = (e: PointerEvent) => {
      const r = landedTap.current;
      landedTap.current = null;
      if (!r || caught) return;
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        setDodges(MAX_MOVES);
      }
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [caught]);

  const reset = () => {
    setDodges(0);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div className="cc-marquee" aria-hidden={!scrolling}>
        <span className={scrolling ? "" : "cc-paused"}>{MARQUEE}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="min-h-11 rounded-[6px] border border-line px-4 py-2 text-sm text-ink hover:border-[var(--toy)]"
          onClick={() => setScrolling((s) => !s)}
        >
          {scrolling ? "Stop the marquee" : "Let it scroll"}
        </button>
        <p className="text-sm text-ink-dim">
          Moving text needs a stop button. That is the one modern thing on this page.
        </p>
      </div>

      <section className="rounded-[10px] border border-line bg-surface p-5">
        <h3 className="text-lg font-semibold">My hit counter</h3>
        <p className="mt-2 font-mono text-2xl text-[var(--toy)]" aria-live="polite">
          {String(hits).padStart(6, "0")}
        </p>
        <p className="mt-2 text-sm text-ink-dim">
          It counts your clicks, in this tab, and nothing else. No visitor number, no tracking, no
          lie.
        </p>
        <button
          type="button"
          className="mt-4 min-h-11 rounded-[6px] border border-line px-4 py-2 text-sm hover:border-[var(--toy)]"
          onClick={() => setHits((h) => h + 1)}
        >
          Add a hit
        </button>
      </section>

      <section className="rounded-[10px] border border-line bg-surface p-5">
        <h3 className="text-lg font-semibold">The button that runs away</h3>
        <p className="mt-2 text-sm text-ink-dim">
          Point at it, tap it, or press Enter. It moves six times, then it gives up. Keyboard
          players win instantly: it cannot outrun a keyboard.
        </p>
        <div className="cc-pen" ref={pen}>
          <button
            type="button"
            ref={runButton}
            className="cc-run"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            onPointerEnter={dodge}
            onPointerDown={onPointerDown}
            onClick={catchIt}
          >
            {caught ? "You got it. It stopped." : "Catch me"}
          </button>
        </div>
        <p className="mt-3 text-sm text-ink-dim" aria-live="polite">
          Moved {dodges} of {MAX_MOVES}.
        </p>
        {caught && (
          <button
            type="button"
            className="mt-3 min-h-11 rounded-[6px] border border-line px-4 py-2 text-sm hover:border-[var(--toy)]"
            onClick={reset}
          >
            Reset, let it loose again
          </button>
        )}
      </section>

      {reduceMotion && (
        <p className="text-sm text-ink-dim">
          Your system asks for less motion, so the sparkle trail and the marquee scroll are off. The
          button still moves when you reach for it, it just jumps instead of sliding.
        </p>
      )}
    </div>
  );
}
