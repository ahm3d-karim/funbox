// Shell / footer copy (agent-02 renders it; the strings live here).
//
// SOURCES (checked 2026-09-18):
//   [S1] FTC staff report, "Bringing Dark Patterns to Light", Sept 2022:
//        https://www.ftc.gov/reports/bringing-dark-patterns-light
//   [S2] Mathur et al., "Dark Patterns at Scale", CHI 2019:
//        https://arxiv.org/abs/1907.07032
//   [S3] Tone plans, for the dial-up toy's approximations:
//        https://en.wikipedia.org/wiki/Precise_tone_plan and https://www.itu.int/rec/T-REC-V.34
//        (approximate, verify at the source)
// Honesty line: nothing on this page is measured, so nothing on this page claims a number.

export const footer = {
  parody:
    "The every-website toy is a parody. Every overlay in it copies a documented dark pattern, and none of the companies, counters or chatbots in it are real.",
  data:
    "No accounts, no analytics, no cookies of our own, no backend. Guestbook entries stay in your browser. Nothing you type leaves this page.",
  offline: "After the first load, this page works offline. Fun was never the expensive part.",
  sources:
    "Pattern sources: FTC staff report 2022 (ftc.gov/reports/bringing-dark-patterns-light), Mathur et al., CHI 2019 (arxiv.org/abs/1907.07032). Tone plans: ITU-T V.34 and the precise tone plan (approximate, verify at the source). Checked 2026-09-18.",
  built: "Six toys, one page, zero funnels. Built at GDG Chai n Code, September 2026.",
};

export const shell = {
  title: "Funbox",
  tagline: "Six toys. No signup. Nothing is watching.",
  cardHint: "Open a toy",
  close: "Close",
  closeHint: "Esc closes this toy",
  cutNote: "A toy that is not fun in thirty seconds does not get a card here.",
};

export const notFoundCopy = {
  heading: "There is only one page.",
  body: "That is the whole product: one page, six toys. Go back and click something silly.",
  back: "Back to the toys",
};
