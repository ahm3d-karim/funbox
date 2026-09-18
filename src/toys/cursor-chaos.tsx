"use client";

import { useEffect, useState } from "react";

// The joke is 1998, so the marquee text is 1998's actual vocabulary, not a
// modern parody of it. Stars, not emoji: this page was made in Notepad.
const MARQUEE =
  "* WELCOME TO MY PAGE * BEST VIEWED IN 800x600 * SIGN MY GUESTBOOK * THIS SITE IS UNDER CONSTRUCTION FOREVER * TELL YOUR FRIENDS *";

export default function CursorChaos() {
  const [hits, setHits] = useState(0);
  const [dodges, setDodges] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrolling, setScrolling] = useState(true);
  const [still, setStill] = useState(false);

  // The OS setting is read, not assumed. Brief: reduced motion disables the
  // trail and the marquee.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Sparkle trail. Plain DOM nodes, throttled: no canvas, no rAF loop.
  useEffect(() => {
    if (still) return;
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
  }, [still]);

  const caught = dodges >= 6;

  const flee = () => {
    if (still || caught) return;
    setDodges((d) => d + 1);
    setOffset({ x: (Math.random() * 2 - 1) * 130, y: (Math.random() * 2 - 1) * 70 });
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
          Point at it and it moves. Keyboard users: tab to it and press Enter. It cannot outrun a
          keyboard, and it gives up after six moves.
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="cc-run"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            onPointerEnter={flee}
            onFocus={() => !still && !caught && setDodges(6)}
            onClick={() => setDodges(6)}
          >
            {caught ? "You got it. It stopped." : "Catch me"}
          </button>
        </div>
      </section>

      {still && (
        <p className="text-sm text-ink-dim">
          Your system asks for less motion, so the sparkle trail and the marquee are off. The rest
          still works.
        </p>
      )}
    </div>
  );
}
