"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { guestbookSeeds, guestbookUi, type GuestEntry } from "@/content/guestbook";

const KEY = "funbox.guestbook.v1";

// localStorage is an external store, so it is read through useSyncExternalStore
// instead of an effect. Side benefit: the server snapshot is "not read yet",
// which gives a real loading state instead of a fake one.
type Snap = { entries: GuestEntry[]; blocked: boolean; ready: boolean };

let snap: Snap = { entries: [], blocked: false, ready: false };
const subs = new Set<() => void>();
const SERVER: Snap = { entries: [], blocked: false, ready: false };

function getSnapshot(): Snap {
  if (!snap.ready) {
    try {
      snap = {
        entries: JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as GuestEntry[],
        blocked: false,
        ready: true,
      };
    } catch {
      snap = { entries: [], blocked: true, ready: true }; // private mode, or corrupt JSON
    }
  }
  return snap;
}

function getServerSnapshot(): Snap {
  return SERVER;
}

function subscribe(cb: () => void) {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

function commit(next: GuestEntry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    snap = { entries: next, blocked: false, ready: true };
  } catch {
    snap = { entries: snap.entries, blocked: true, ready: true };
  }
  subs.forEach((f) => f());
}

export default function Guestbook() {
  const { entries: mine, blocked, ready } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (!cleanName) return setError(guestbookUi.missingName);
    if (!cleanMessage) return setError(guestbookUi.missingMessage);
    if (cleanMessage.length > 200) return setError(guestbookUi.tooLong);
    setError("");
    setNote("");
    commit([
      {
        name: cleanName,
        message: cleanMessage,
        date: new Date().toISOString().slice(0, 10),
        seeded: false,
      },
      ...mine,
    ]);
    setName("");
    setMessage("");
  };

  const entries = [...mine, ...guestbookSeeds];

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <p className="max-w-2xl text-sm text-ink-dim">{guestbookUi.blurb}</p>
      <p className="max-w-2xl text-sm text-ink-dim">{guestbookUi.storageNote}</p>

      {!ready && <p className="text-sm text-ink-dim">Opening the guestbook...</p>}

      {blocked && (
        <p className="max-w-2xl rounded-[10px] border border-[var(--toy)] bg-surface p-4 text-sm">
          This browser is blocking local storage, so a new entry cannot be saved. The entries below
          still read fine, and nothing typed here would be sent anywhere in any case.
        </p>
      )}

      {ready && !blocked && (
        <form onSubmit={submit} className="flex max-w-2xl flex-col gap-3" noValidate>
          <label className="flex flex-col gap-1 text-sm">
            {guestbookUi.nameLabel}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={guestbookUi.namePlaceholder}
              maxLength={40}
              className="min-h-11 rounded-[6px] border border-ink-dim bg-bg px-3 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            {guestbookUi.messageLabel}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={guestbookUi.messagePlaceholder}
              rows={3}
              className="rounded-[6px] border border-ink-dim bg-bg p-3 text-ink"
            />
          </label>
          <p className="text-xs text-ink-dim">{message.length} / 200</p>
          {error && (
            <p role="alert" className="text-sm text-[var(--toy)]">
              {error}
            </p>
          )}
          {note && <p className="text-sm text-ink-dim">{note}</p>}
          <div>
            <button
              type="submit"
              className="min-h-11 rounded-[6px] border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-[var(--toy)]"
            >
              {guestbookUi.submit}
            </button>
          </div>
        </form>
      )}

      <p className="text-sm text-ink-dim">{guestbookUi.seedNote}</p>

      {entries.length === 0 ? (
        <p className="text-ink-dim">{guestbookUi.empty}</p>
      ) : (
        <ul className="flex list-none flex-col gap-3">
          {entries.map((entry, i) => (
            <li
              key={`${entry.name}-${entry.date}-${i}`}
              className="rounded-[10px] border border-line bg-surface p-4"
            >
              <p className="text-sm">
                <span className="font-semibold text-[var(--toy)]">{entry.name}</span>{" "}
                <span className="text-ink-dim">{entry.date}</span>
                {entry.seeded && (
                  <span className="ml-2 border border-line px-1.5 py-0.5 text-xs text-ink-dim">
                    {guestbookUi.seededTag}
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm">{entry.message}</p>
              {entry.home && <p className="mt-1 text-xs text-ink-dim">{entry.home}</p>}
            </li>
          ))}
        </ul>
      )}

      {mine.length > 0 && (
        <div>
          <button
            type="button"
            className="min-h-11 rounded-[6px] border border-line px-4 py-2 text-sm hover:border-[var(--toy)]"
            onClick={() => {
              commit([]);
              setNote(guestbookUi.cleared);
            }}
          >
            {guestbookUi.clear}
          </button>
        </div>
      )}
    </div>
  );
}
