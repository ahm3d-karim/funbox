# FUNBOX

Six small hand-made toys on one page. No signup, no accounts, no tracking, no
backend, no runtime API calls, no asset files. Open the page, pick a toy,
something happens.

**Live:** https://funbox-ahm3dkarim.vercel.app

Built for GDG "Chai n Code", September 2026. Theme: **make internet fun**.

## What this is

The internet stopped being fun because every page became a funnel. FUNBOX is the
opposite: one static page, six toys, zero data collected, works offline after the
first load. There is nothing to sign into and nothing to sell you, and the biggest
toy is a parody of exactly what killed the fun: it ends by showing the same page
the way it should have looked, with nothing on it.

One route (`/`), a wall of six tiles, and each tile takes over the screen while you
play. Close it and you are back at the wall.

## The toys

| Toy | What it does |
|-----|--------------|
| every-website | A fake 2026 article that drowns itself: consent banner, newsletter modal, chat bubble, autoplay video, countdown offer. Dismissing them spawns more. When the pile hits the cap, the page cleans itself up and shows the same article with nothing on it. Ships a "stop the madness" control so the parody never traps a keyboard user. |
| not-a-robot | A captcha with real deterministic pass logic, absurd prompts, and a slider that snaps back. Give up and it verifies you anyway, probably. |
| cursor-chaos | Sparkle trail, marquee, hit counter, and a button that runs away from your pointer. Respects reduced motion. |
| guestbook | Sign it. Entries stay in your browser (localStorage), seeded with six 1998-era entries that are tagged as seeds. |
| dialup-karaoke | A 12-key dial pad that sends real DTMF frequency pairs (ITU-T Q.23), then dials the number and synthesizes the modem handshake live with WebAudio, with an ASCII log you sing along to. No audio files. |
| slop-machine | Paste a sentence, get it back in LinkedIn-bait, SEO-blog and engagement-farm dialects at once, plus a slop score that counts markers in your own text, in your browser. Templates, no LLM. |

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Build and check:

```bash
npm run build
npx tsc --noEmit
npm run lint
node --experimental-strip-types --test "tests/*.test.ts"
```

## Repo layout

```
src/app/         the one route: layout, page, tokens (globals.css)
src/components/  ToyStage (takeover, focus trap, Esc) and ToyCard
src/toys/        one client component per toy + the registry in index.ts
src/lib/         shared pure logic: engine, sound synthesis
src/content/     every user-facing string, kept out of the components
tests/           node:test harness for the engines and the data contract
```

## Stack

Next.js (App Router) + TypeScript + Tailwind. One route, `/`. The registry in
`src/toys/index.ts` is the single list of toys: six entries, one component each.
No database, no auth, no env vars: the repo deploys with an empty environment, and
`.env.example` documents that (there is nothing to put in it).

## Design

Navy and gold, taken from the LUMS Religious Society site's own stylesheet rather
than invented: base `#0b101b`, cards `#131c2d`, gold `#c5a059` with `#e5c97b` and
`#9a781d`, plus one accent colour per toy inside its stage. Tiles are a 15px radius
wall with a gold hairline and a gold index numeral, a hand-authored inline SVG
wordmark, and a 70ms snap on hover. Contrast ratios are measured with a script, not
recalled from memory.

## Honesty

Nothing is faked: no fake user counts, no fake "AI", no invented statistics. The
dark patterns in every-website are real patterns (pre-ticked boxes, 6px grey reject
text, countdown timers), labelled as a parody in the footer. Nothing is sent
anywhere: the guestbook lives in your browser and there is no analytics of any kind.

## Accessibility

Keyboard operable, visible focus rings, Esc always closes the top layer, focus
returns to the card you came from, text contrast checked with a contrast checker,
and reduced motion disables the trail, the marquee and the shake.
