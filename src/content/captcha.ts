// not-a-robot copy (agent-01 owns the toy; the prompts and UI strings live here).
//
// SOURCES (checked 2026-09-18):
//  [S1] FTC staff report, "Bringing Dark Patterns to Light", Sept 2022:
//       https://www.ftc.gov/reports/bringing-dark-patterns-light (forced action, nagging)
//  [S2] Mathur et al., "Dark Patterns at Scale", CHI 2019: https://arxiv.org/abs/1907.07032
//       ("fake difficulty", the slider that never passes is our own jokey version)
// Honesty: these prompts are absurd on purpose and are not claimed to be from any
// real captcha. The pass rule is deterministic and lives in src/lib (agent-01).

export const captchaPrompts: string[] = [
  "Select every square containing a traffic light that has known love.",
  "Pick all buses. Then pick them again, but slower.",
  "Select the squares with crosswalks that are also metaphors.",
  "Click every fire hydrant that has never lied to you.",
  "Select all bicycles. Note: one bicycle is not a bicycle.",
  "Choose every square with a street sign you disagree with.",
  "Select the traffic lights that are currently disappointed in you.",
  "Pick the crosswalks in the order your childhood happened.",
  "Select the hydrants that would survive a group project.",
  "Tick every square with a bus that has a side hustle.",
];

export const captchaUi = {
  heading: "Not a robot",
  blurb: "Prove you are a human being. Then prove it again, differently.",
  checkbox: "I am not a robot",
  checkboxWorking: "Checking...",
  checkboxDone: "You are probably a human being.",
  sliderLabel: "Slide to the end to prove it",
  sliderHint: "Drag the handle all the way. The handle has other plans.",
  snapBack: "Oops. Try once more.",
  snapBackAgain: "Close. Try once more.",
  gridLabel: "Select every square that matches the prompt",
  verifyButton: "Verify",
  newChallenge: "Get a new challenge",
  failure: "Verification failed. Please verify again.",
  success: "Verified. You may proceed. Probably.",
  giveUpNote:
    "This captcha is deterministic: the same grid and the same picks always give the same verdict. The engine lives in src/lib/engine.ts.",
};

export const captchaGiveUp = "Give up (this always works)";
