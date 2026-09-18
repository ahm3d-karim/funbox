"use client";

import { useEffect, useRef, useState } from "react";

import { dialKeys, dialPadUi, karaokeUi, modemSteps, type ModemStep } from "@/content/modem";
import { playTone, stop } from "@/lib/sound";

// House tokens only (agent-02 owns globals.css); the stage sets --toy to this toy's
// accent (blue). No CSS animation anywhere, so reduced motion has nothing to disable.
//
// Dialling reuses the handshake script instead of a second player: the typed digits
// become DTMF steps at the front of modemSteps, and the handshake slides forward by
// however long the dialling took. One driver, one rail, one Stop.

const KEY_MS = 120;
const KEY_GAP = 140;
const DIAL_LEAD = 260;
const NUMBER_CAP = 12;

function tonesFor(key: string): number[] {
  return dialKeys.find((entry) => entry.key === key)?.tones ?? [];
}

function totalOf(steps: ModemStep[]): number {
  return steps.reduce((longest, step) => Math.max(longest, step.at + step.ms), 0);
}

function scriptFor(digits: string): ModemStep[] {
  const dial: ModemStep[] = [...digits].map((digit, i) => ({
    at: DIAL_LEAD + i * KEY_GAP,
    label: digit,
    lyric: `${dialPadUi.dialling} ${digit}`,
    tones: tonesFor(digit),
    ms: KEY_MS,
  }));
  const offset = digits.length > 0 ? DIAL_LEAD + digits.length * KEY_GAP + 180 : 0;
  return [...dial, ...modemSteps.map((step) => ({ ...step, at: step.at + offset }))];
}

export default function DialupKaraoke() {
  const [digits, setDigits] = useState("");
  const [script, setScript] = useState<ModemStep[]>(modemSteps);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<number[]>([]);
  const total = totalOf(script);

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

  function run(steps: ModemStep[]) {
    quiet();
    setScript(steps);
    setPlaying(true);
    steps.forEach((step, i) => {
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
      }, totalOf(steps) + 150),
    );
  }

  function press(key: string) {
    setDigits((current) => (current.length >= NUMBER_CAP ? current : current + key));
    tonesFor(key).forEach((freq) => playTone(freq, KEY_MS));
  }

  const current = index >= 0 ? script[index] : null;
  const progress = current ? Math.min(100, Math.round(((current.at + current.ms) / total) * 100)) : 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 p-4 text-ink sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="flex flex-col gap-2">
          <div
            aria-label={dialPadUi.label}
            className="grid grid-cols-3 gap-1.5"
            role="group"
          >
            {dialKeys.map((entry) => (
              <button
                aria-label={`${dialPadUi.label}: ${entry.key}`}
                className="min-h-11 min-w-11 rounded-[var(--radius-sm)] border border-line bg-surface py-2 font-mono text-lg text-ink hover:border-[color:var(--toy)]"
                key={entry.key}
                onClick={() => press(entry.key)}
                title={`${entry.tones.join(" + ")} ${karaokeUi.hzLabel}`}
                type="button"
              >
                {entry.key}
              </button>
            ))}
          </div>
          <p className="max-w-56 text-xs text-ink-dim">{dialPadUi.hint}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-[var(--radius)] border border-line bg-surface p-3">
            <p className="text-xs uppercase tracking-wide text-ink-dim">{dialPadUi.numberLabel}</p>
            <output className="mt-1 block font-mono text-2xl break-all text-[color:var(--toy)]">
              {digits || dialPadUi.empty}
            </output>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--toy)] px-4 py-2 font-semibold text-bg"
              onClick={() => run(scriptFor(digits))}
              type="button"
            >
              {dialPadUi.connect}
            </button>
            <button
              className="min-h-11 rounded-[var(--radius-sm)] border border-line px-3 py-2 text-sm text-ink disabled:opacity-60"
              disabled={!playing}
              onClick={quiet}
              type="button"
            >
              {karaokeUi.stop}
            </button>
            <button
              className="min-h-11 rounded-[var(--radius-sm)] border border-line px-3 py-2 text-sm text-ink disabled:opacity-60"
              disabled={digits.length === 0}
              onClick={() => setDigits((current) => current.slice(0, -1))}
              type="button"
            >
              {dialPadUi.backspace}
            </button>
            <button
              className="min-h-11 rounded-[var(--radius-sm)] border border-line px-3 py-2 text-sm text-ink disabled:opacity-60"
              disabled={digits.length === 0}
              onClick={() => setDigits("")}
              type="button"
            >
              {dialPadUi.clear}
            </button>
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
        </div>
      </div>

      <ul className="flex flex-col gap-1 font-mono text-sm">
        {script.map((step, i) => (
          <li
            className={`flex gap-3 border-l-2 py-0.5 pl-3 ${
              i === index ? "border-l-[color:var(--toy)] text-ink" : "border-l-line text-ink-dim"
            }`}
            key={`${step.at}-${step.label}-${i}`}
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
