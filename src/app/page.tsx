"use client";

import { useCallback, useRef, useState } from "react";
import { toys } from "@/toys";
import ToyCard from "@/components/ToyCard";
import ToyStage from "@/components/ToyStage";
import { shell, footer } from "@/content/footer";

export default function Home() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = toys.find((t) => t.slug === openSlug) ?? null;

  const close = useCallback(() => {
    setOpenSlug(null);
    opener.current?.focus(); // focus goes back to the card that was clicked (R-32)
    opener.current = null;
  }, []);

  const start = useCallback((slug: string, trigger: HTMLElement) => {
    opener.current = trigger;
    setOpenSlug(slug);
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <header className="py-12 sm:py-16">
        <h1>
          <svg
            className="wordmark"
            viewBox="0 0 220 36"
            aria-hidden="true"
            focusable="false"
            role="presentation"
          >
            {/* hand-authored, vector only: a gold lozenge with a solid gold core */}
            <path d="M18 3 L33 18 L18 33 L3 18 Z" fill="none" stroke="var(--gold)" strokeWidth="2" />
            <path d="M18 11.5 L24.5 18 L18 24.5 L11.5 18 Z" fill="var(--gold)" />
            <text
              x="46"
              y="27"
              fontSize="28"
              fontWeight="700"
              letterSpacing="3.5"
              fill="var(--ink)"
            >
              FUNBOX
            </text>
          </svg>
          <span className="sr-only">{shell.title}</span>
        </h1>
        <p className="mt-3 max-w-xl text-lg text-ink-dim">{shell.tagline}</p>
      </header>

      {toys.length === 0 ? (
        // Empty state: every card cut. Honest, and it names the one rule.
        <p className="max-w-xl text-ink-dim">{shell.cutNote}</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-dim">{shell.cardHint}</p>
          <ul className="toy-grid">
            {toys.map((toy, i) => (
              <li key={toy.slug}>
                <ToyCard toy={toy} index={i} onOpen={start} />
              </li>
            ))}
          </ul>
        </>
      )}

      <footer className="mt-16 border-t border-line pt-6 text-sm leading-relaxed text-ink-dim">
        <p className="max-w-2xl">{footer.parody}</p>
        <p className="mt-3 max-w-2xl">{footer.data}</p>
        <p className="mt-3 max-w-2xl">{footer.offline}</p>
        <p className="mt-3 max-w-2xl">{footer.sources}</p>
        <p className="mt-3">{footer.built}</p>
      </footer>

      {open && (
        <ToyStage title={open.title} blurb={open.blurb} accent={open.accent} onClose={close}>
          <open.Component />
        </ToyStage>
      )}
    </main>
  );
}
