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
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">{shell.title}</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-dim">{shell.tagline}</p>
      </header>

      {toys.length === 0 ? (
        // Empty state: every card cut. Honest, and it names the one rule.
        <p className="max-w-xl text-ink-dim">{shell.cutNote}</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-dim">{shell.cardHint}</p>
          <ul className="toy-grid">
            {toys.map((toy) => (
              <li key={toy.slug}>
                <ToyCard toy={toy} onOpen={start} />
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
