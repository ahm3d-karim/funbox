"use client";

import { useEffect, useRef, useState } from "react";

import { dialectLabels, dialects, slopUi } from "@/content/slop";
import { slopify } from "@/lib/engine";

const MAX = 300;

// House tokens only (agent-02 owns globals.css): --bg/--surface/--line/--ink/--ink-dim
// and --toy, which the stage sets to this toy's accent (pink). Focus rings come from
// the global :focus-visible rule, so no per-element outline classes here.
// Radii: --radius-sm for controls, --radius for panels (no pills, R-11).

type Result = { key: string; label: string; tagline: string; text: string };

function results(text: string): Result[] {
  return dialects.map((dialect) => ({
    key: dialect,
    label: dialectLabels[dialect].label,
    tagline: dialectLabels[dialect].tagline,
    text: slopify(text, dialect),
  }));
}

export default function SlopMachine() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState<Result[] | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  function run() {
    const text = input.trim();
    if (!text) {
      setError(slopUi.empty);
      setOut(null);
      return;
    }
    if (text.length > MAX) {
      setError(slopUi.tooLong);
      return;
    }
    setError("");
    setOut(results(text));
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard can be blocked. The text is selectable, so nothing is lost.
    }
    setCopied(key);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(""), 1400);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4 text-ink sm:p-6">
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          run();
        }}
      >
        <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="slop-input">
          {slopUi.inputLabel}
          <textarea
            id="slop-input"
            className="min-h-24 w-full resize-y rounded-[var(--radius-sm)] border border-ink-dim bg-surface p-3 text-base text-ink placeholder:text-ink-dim"
            maxLength={MAX + 1}
            onChange={(event) => setInput(event.target.value)}
            placeholder={slopUi.inputPlaceholder}
            value={input}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="min-h-11 rounded-[var(--radius-sm)] bg-[var(--toy)] px-4 py-2 font-semibold text-bg"
            type="submit"
          >
            {out ? slopUi.buttonAgain : slopUi.button}
          </button>

          <span className="text-xs text-ink-dim">{slopUi.example}</span>
          {slopUi.examples.map((example) => (
            <button
              className="min-h-9 rounded-[var(--radius-sm)] border border-line px-3 py-1 text-xs text-ink-dim hover:border-[color:var(--toy)]"
              key={example}
              onClick={() => {
                setInput(example);
                setError("");
                setOut(results(example));
              }}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>

        {error ? (
          <p
            className="rounded-[var(--radius-sm)] border border-line border-l-4 border-l-[color:var(--toy)] bg-surface px-3 py-2 text-sm text-ink"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </form>

      <section aria-live="polite" className="grid gap-3 md:grid-cols-3">
        {out
          ? out.map((result) => (
              <article
                className="flex flex-col gap-2 rounded-[var(--radius)] border border-line bg-surface p-3"
                key={result.key}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-ink">{result.label}</h3>
                    <p className="text-xs text-ink-dim">{result.tagline}</p>
                  </div>
                  <button
                    className="min-h-9 rounded-[var(--radius-sm)] border border-line px-2 py-1 text-xs text-ink-dim hover:border-[color:var(--toy)]"
                    onClick={() => void copy(result.text, result.key)}
                    type="button"
                  >
                    {copied === result.key ? slopUi.copied : slopUi.copy}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-ink">
                  {result.text}
                </pre>
              </article>
            ))
          : null}
      </section>

      <p className="text-xs text-ink-dim">{slopUi.noNetwork}</p>
    </div>
  );
}
