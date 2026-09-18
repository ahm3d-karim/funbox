"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { shell } from "@/content/footer";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen toy takeover (the critical path: every toy renders inside this).
 * Owns what the toy must never have to think about: focus trap, Esc to close,
 * a visible close control, the accent, and body scroll lock on the page behind.
 * The shell restores focus to the card that opened it.
 */
export default function ToyStage({
  title,
  blurb,
  accent,
  onClose,
  children,
}: {
  title: string;
  blurb: string;
  accent: "blue" | "pink" | "lime" | "amber";
  onClose: () => void;
  children: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;

    // Capture phase, so Esc reaches us before a toy can swallow it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !el.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    el.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      ref={stage}
      role="dialog"
      aria-modal="true"
      aria-labelledby="toy-stage-title"
      className="toy-stage"
      style={{ "--toy": `var(--accent-${accent})` } as CSSProperties}
    >
      <div className="toy-stage__bar">
        <div>
          <h2 id="toy-stage-title" className="toy-stage__title">
            {title}
          </h2>
          <p className="toy-stage__blurb">{blurb}</p>
        </div>
        <button type="button" className="toy-stage__close" onClick={onClose} title={shell.closeHint}>
          {shell.close}
        </button>
      </div>
      <div className="toy-stage__body">{children}</div>
    </div>
  );
}
