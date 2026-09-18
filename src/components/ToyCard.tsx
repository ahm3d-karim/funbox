"use client";

import type { CSSProperties } from "react";
import type { Toy } from "@/toys";

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
      <span className="toy-card__top">
        {/* Decorative: the title below is the accessible name, so the glyph is
            hidden from assistive tech rather than read out as "cookie". */}
        <span className="toy-card__glyph" aria-hidden="true">
          {toy.glyph}
        </span>
        <span className="toy-card__title">{toy.title}</span>
      </span>
      <span className="toy-card__blurb line-clamp-2">{toy.blurb}</span>
    </button>
  );
}
