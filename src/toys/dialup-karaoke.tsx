"use client";

import { useEffect, useRef, useState } from "react";

import { karaokeUi, modemSteps } from "@/content/modem";
import { playTone, stop } from "@/lib/sound";

// Whole run, in ms, from the script in src/content/modem.ts.
const TOTAL = modemSteps.reduce((longest, step) => Math.max(longest, step.at + step.ms), 0);

// House tokens only (agent-02 owns globals.css); the stage sets --toy to this toy's
// accent (blue). No animation here, so reduced motion has nothing to disable; the
// progress bar only moves when the state changes.

export default function DialupKaraoke() {
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
      stop();
    },
    [],
  );

  function quiet() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    stop();
    setPlaying(false);
  }

  function play() {
    quiet();
    setPlaying(true);
    modemSteps.forEach((step, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setIndex(i);
          step.tones.forEach((freq) => playTone(freq, step.ms));
        }, step.at),
      );
    });
    timers.current.push(
      window.setTimeout(() => {
        setPlaying(false);
      }, TOTAL + 150),
    );
  }

  const current = index >= 0 ? modemSteps[index] : null;
  const progress = current ? Math.min(100, Math.round(((current.at + current.ms) / TOTAL) * 100)) : 0;
  const seconds = `${(TOTAL / 1000).toFixed(1)} s`;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 p-4 text-ink sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--toy)] px-4 py-2 font-semibold text-bg"
          onClick={play}
          type="button"
        >
          {index < modemSteps.length - 1 ? karaokeUi.play : karaokeUi.again}
        </button>
        <button
          className="min-h-11 rounded-[var(--radius-sm)] border border-line px-4 py-2 text-sm font-medium text-ink disabled:opacity-60"
          disabled={!playing}
          onClick={quiet}
          type="button"
        >
          {karaokeUi.stop}
        </button>
        <span className="text-xs text-ink-dim">
          {seconds} {karaokeUi.totalLabel}
        </span>
      </div>

      {current ? (
        <div aria-live="polite" className="rounded-[var(--radius)] border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-ink-dim">{karaokeUi.readingLabel}</p>
          <p className="mt-1 font-mono text-xl text-[color:var(--toy)] sm:text-2xl">{current.label || "..."}</p>
          <p className="mt-2 text-lg leading-snug text-ink">{current.lyric}</p>
          <p className="mt-2 font-mono text-xs text-ink-dim">
            {karaokeUi.toneLabel} {current.tones.join(" + ")} {karaokeUi.hzLabel} / {current.ms} ms
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-line">
            <div className="h-1.5 rounded-full bg-[var(--toy)]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <div className="rounded-[var(--radius)] border border-dashed border-line bg-surface p-4">
          <p className="text-sm text-ink-dim">{karaokeUi.audioNote}</p>
        </div>
      )}

      <ul className="flex flex-col gap-1 font-mono text-sm">
        {modemSteps.map((step, i) => (
          <li
            className={`flex gap-3 border-l-2 py-0.5 pl-3 ${
              i === index ? "border-l-[color:var(--toy)] text-ink" : "border-l-line text-ink-dim"
            }`}
            key={`${step.at}-${step.label}`}
          >
            <span className="w-12 shrink-0 text-right tabular-nums">{step.at}</span>
            <span className="w-28 shrink-0 truncate">{step.label || "..."}</span>
            <span className="min-w-0 break-words">{step.lyric}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-ink-dim">{karaokeUi.engineNote}</p>
      <p className="text-xs text-ink-dim">{karaokeUi.sourceNote}</p>
    </div>
  );
}
