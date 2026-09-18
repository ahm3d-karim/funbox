// dialup-karaoke script (agent-03 owns this file and the toy that plays it).
//
// WHAT THIS IS: a fake modem handshake, styled after the real one. The tones are
// APPROXIMATED from published tone plans, not captured from a modem. Verify at the
// source before repeating any frequency as fact:
//   [S1] Precise tone plan (dial tone 350+440 Hz, DTMF pairs, ring 440+480 Hz):
//        https://en.wikipedia.org/wiki/Precise_tone_plan   (checked 2026-09-18)
//   [S2] ITU-T V.34 / V.90 answer and carrier tones, and the V.25 answer tone at
//        2100 Hz: https://www.itu.int/rec/T-REC-V.34   (checked 2026-09-18)
// The handshake a real modem prints varies by modem, line and ISP, so the log lines
// below are karaoke lyrics in modem clothing, not a transcript.
//
// Timing model: each step starts at `at` ms from play, holds `ms`, and lists the
// frequencies to sound. Two frequencies in one step means a chord: the toy calls
// playTone() twice, so agent-01's sound.ts must overlap, not queue.

export type ModemStep = {
  at: number; // ms from the start of the song
  label: string; // left rail, the "official" log line
  lyric: string; // the line you sing
  tones: number[]; // Hz, sounded together
  ms: number; // how long the tones hold
};

export const modemSteps: ModemStep[] = [
  { at: 0, label: "off hook", lyric: "pick up the phone", tones: [350, 440], ms: 1100 },
  { at: 1150, label: "ATDT", lyric: "A. A. T. D. T.", tones: [697, 1209], ms: 110 },
  { at: 1290, label: "", lyric: "a number you will never dial again", tones: [770, 1336], ms: 110 },
  { at: 1430, label: "", lyric: "hold your breath", tones: [852, 1477], ms: 110 },
  { at: 1600, label: "ringing", lyric: "and wait", tones: [440, 480], ms: 1900 },
  { at: 3500, label: "answer tone", lyric: "somewhere, a machine says yes", tones: [2100], ms: 500 },
  { at: 4100, label: "carrier", lyric: "shhh. it is thinking.", tones: [1200], ms: 400 },
  { at: 4600, label: "handshake", lyric: "two machines learn each other's names", tones: [1080, 1750], ms: 700 },
  { at: 5400, label: "error burst", lyric: "and disagree about everything", tones: [2250], ms: 300 },
  { at: 5800, label: "retrain", lyric: "try again. try again. try again.", tones: [1650, 1850], ms: 900 },
  { at: 6800, label: "squelch", lyric: "that sound is the internet arriving", tones: [1000, 2400], ms: 700 },
  { at: 7600, label: "CONNECT 33600", lyric: "CONNECT. you are in.", tones: [1300], ms: 500 },
  { at: 8300, label: "", lyric: "somebody pick up the phone", tones: [440, 480], ms: 1200 },
  { at: 9700, label: "NO CARRIER", lyric: "*NO CARRIER*", tones: [480, 620], ms: 900 },
  { at: 10800, label: "", lyric: "and the phone bill is yours", tones: [350, 440], ms: 900 },
];

export const karaokeUi = {
  stop: "Stop",
  readingLabel: "Now singing",
  engineNote: "Every tone is synthesized in the browser with WebAudio. There is no audio file in this repo.",
  audioNote: "Browsers block sound until you press play. That is the law, not a bug.",
  toneLabel: "tone",
  hzLabel: "Hz",
  sourceNote: "Tones are approximations of the published tone plans. Verify at the source; the real handshake varies by modem.",
};

// ---------- the keypad ----------
//
// DTMF is the one part of this toy that is NOT an approximation: a key press sends
// two exact frequencies, one from the low group and one from the high group.
//   [S3] DTMF frequency pairs and the 4x3 layout (ITU-T Q.23):
//        https://en.wikipedia.org/wiki/Precise_tone_plan   (checked 2026-09-18)
//   [S4] ITU-T Q.23, "Technical features of push-button telephone sets":
//        https://www.itu.int/rec/T-REC-Q.23   (checked 2026-09-18)
// The pairs are therefore derived from the row/column indices, not typed by hand.

export const dtmfLow = [697, 770, 852, 941]; // rows 1-2-3, 4-5-6, 7-8-9, *-0-#
export const dtmfHigh = [1209, 1336, 1477]; // columns 1-4-7-*, 2-5-8-0, 3-6-9-#

export const dialKeyOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

export const dialKeys = dialKeyOrder.map((key, i) => ({
  key,
  tones: [dtmfLow[Math.floor(i / 3)], dtmfHigh[i % 3]],
}));

export const dialPadUi = {
  label: "Dial pad",
  numberLabel: "Number",
  empty: "no number yet",
  hint: "Press a key to hear its two real DTMF frequencies, then Connect to dial it and start the handshake.",
  dialling: "dialling",
  connect: "Connect",
  backspace: "Delete",
  clear: "Clear",
};
