"use client";

import type { CSSProperties } from "react";
import type { Toy } from "@/toys";
import { shell } from "@/content/footer";

export default function ToyCard({
  toy,
  onOpen,
}: {
  toy: Toy;
  onOpen: (slug: string, trigger: HTMLElement) => void;
}) {
  return (
    <button
      type="button"
      className="toy-card"
      style={{ "--toy": `var(--accent-${toy.accent})` } as CSSProperties}
      onClick={(e) => onOpen(toy.slug, e.currentTarget)}
    >
      <span className="toy-card__bar" aria-hidden="true" />
      <span className="toy-card__title">{toy.title}</span>
      <span className="toy-card__blurb">{toy.blurb}</span>
      <span className="toy-card__open">{shell.cardHint}</span>
    </button>
  );
}
