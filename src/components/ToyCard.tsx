"use client";

import type { CSSProperties } from "react";
import type { Toy } from "@/toys";
import { ToyArt } from "@/components/ToyArt";

export default function ToyCard({
  toy,
  index,
  onOpen,
}: {
  toy: Toy;
  index: number;
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
        {/* agent-01's ToyArt motif. It renders null for an unknown slug, and the
            numeral and title do not depend on it, so a missing motif can never
            leave an empty box. */}
        <span className="toy-art">
          <ToyArt slug={toy.slug} />
        </span>
        <span className="toy-card__head">
          <span className="toy-card__index">{String(index + 1).padStart(2, "0")}</span>
          <span className="toy-card__title">{toy.title}</span>
        </span>
      </span>
      <span className="toy-card__blurb line-clamp-2">{toy.blurb}</span>
    </button>
  );
}
