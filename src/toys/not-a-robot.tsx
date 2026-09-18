"use client";

// not-a-robot: a captcha whose pass rule is real and deterministic, with absurd
// prompts and a slider that always snaps back. Copy: src/content/captcha.ts
// (agent-03). Verdict: captchaVerdict in src/lib/engine.ts (agent-01).
// The three steps stack on the page so the slider can never trap anyone: the
// grid is the real path through, and the give-up control always works.

import { useEffect, useRef, useState } from "react";
import { captchaVerdict, type Grid, type Verdict } from "@/lib/engine";
import { captchaGiveUp, captchaPrompts, captchaUi } from "@/content/captcha";

// Fixed tile bank. Labels repeat on purpose: "one bicycle is not a bicycle".
const TILES = [
  "traffic light",
  "crosswalk",
  "hydrant",
  "bus",
  "bicycle",
  "street sign",
  "traffic light",
  "crosswalk",
  "bus",
];

// Deterministic grid per challenge: 3 correct tiles, always the same ones.
function gridFor(challenge: number): Grid {
  return { cells: TILES.map((label, id) => ({ id, label, correct: (id + challenge) % 3 === 0 })) };
}

export default function NotARobot() {
  const [checking, setChecking] = useState(false);
  const [human, setHuman] = useState(false);
  const [slide, setSlide] = useState(0);
  const [snaps, setSnaps] = useState(0);
  const [challenge, setChallenge] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const grid = gridFor(challenge);

  function check() {
    setChecking(true);
    timer.current = window.setTimeout(() => {
      setChecking(false);
      setHuman(true);
    }, 700);
  }

  function snapBack() {
    setSlide(0);
    setSnaps((n) => n + 1);
  }

  function toggle(id: number) {
    setVerdict(null);
    setPicked((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function nextChallenge() {
    setChallenge((c) => c + 1);
    setPicked([]);
    setVerdict(null);
  }

  function giveUp() {
    setPicked(grid.cells.filter((cell) => cell.correct).map((cell) => cell.id));
    setVerdict({ pass: true, reason: "human, by request" });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h2 className="text-xl font-semibold">{captchaUi.heading}</h2>
      <p className="mt-1 text-sm text-ink-dim">{captchaUi.blurb}</p>

      <div className="mt-6 flex items-center gap-3 rounded-[var(--radius)] border border-line bg-surface p-4">
        <input
          id="not-a-robot-check"
          type="checkbox"
          checked={human}
          onChange={() => (human ? setHuman(false) : check())}
        />
        <label htmlFor="not-a-robot-check" className="text-sm">
          {checking ? captchaUi.checkboxWorking : human ? captchaUi.checkboxDone : captchaUi.checkbox}
        </label>
      </div>

      {human && (
        <div className="mt-4 rounded-[var(--radius)] border border-line bg-surface p-4">
          <label htmlFor="not-a-robot-slider" className="text-sm font-semibold">
            {captchaUi.sliderLabel}
          </label>
          <p className="mt-1 text-xs text-ink-dim">{captchaUi.sliderHint}</p>
          <input
            id="not-a-robot-slider"
            type="range"
            min={0}
            max={100}
            value={slide}
            onChange={(event) => setSlide(Number(event.target.value))}
            onPointerUp={snapBack}
            onKeyUp={snapBack}
            className="mt-3 w-full"
          />
          {snaps > 0 && (
            <p className="mt-2 text-xs text-ink-dim" role="status">
              {snaps % 2 === 0 ? captchaUi.snapBack : captchaUi.snapBackAgain}
            </p>
          )}
        </div>
      )}

      {human && (
        <div className="mt-4 rounded-[var(--radius)] border border-line bg-surface p-4">
          <p className="text-sm font-semibold">{captchaUi.gridLabel}</p>
          <p className="mt-1 text-sm text-[var(--toy)]">{captchaPrompts[challenge % captchaPrompts.length]}</p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {grid.cells.map((cell) => (
              <button
                key={cell.id}
                type="button"
                aria-pressed={picked.includes(cell.id)}
                onClick={() => toggle(cell.id)}
                className={`min-h-11 rounded-[var(--radius-sm)] border px-2 text-xs ${
                  picked.includes(cell.id) ? "border-[var(--toy)] text-[var(--toy)]" : "border-line text-ink-dim"
                }`}
              >
                {cell.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setVerdict(captchaVerdict(picked, grid));
              }}
              className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--toy)] px-4 text-sm font-semibold text-bg"
            >
              {captchaUi.verifyButton}
            </button>
            <button
              type="button"
              onClick={nextChallenge}
              className="min-h-11 rounded-[var(--radius-sm)] border border-line px-4 text-sm"
            >
              {captchaUi.newChallenge}
            </button>
          </div>
        </div>
      )}

      {/* Always on screen, before the checkbox: the escape hatch must never be
          behind the puzzle it escapes. */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={giveUp}
          className="min-h-11 rounded-[var(--radius-sm)] border border-[var(--toy)] px-4 text-sm font-semibold"
        >
          {captchaGiveUp}
        </button>
        {verdict && (
          <p className="text-sm" role="status">
            {verdict.pass ? captchaUi.success : `${captchaUi.failure} ${verdict.reason}.`}
          </p>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink-dim">{captchaUi.giveUpNote}</p>
    </div>
  );
}
