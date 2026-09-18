// every-website copy (agent-03 owns these strings; agent-01 owns the toy that shows them).
//
// SOURCES (check date 2026-09-18 for all of them):
//  [S1] FTC staff report, "Bringing Dark Patterns to Light", Sept 2022:
//       https://www.ftc.gov/reports/bringing-dark-patterns-light
//  [S2] Mathur et al., "Dark Patterns at Scale", CHI 2019: https://arxiv.org/abs/1907.07032
//  [S3] Low contrast / tiny secondary "reject all" is the [S2] "hidden option" family.
//       The toy verifies its own contrast with the checker, never from memory.
// Honesty: no invented statistics. Numbers a real banner would show are either cut or
// written so they read as the joke (the scarcity line debunks itself on purpose).

export const article = {
  kicker: "Feelings",
  title: "Local Man Finally Finds a Website With Only the Weather",
  dek: "He asked for the temperature. He received a newsletter.",
  byline: "By a person who is very tired",
  date: "September 2026",
  body: [
    "On Tuesday morning, Daniyal opened his laptop to check the weather. He closed it forty minutes later, having subscribed to three newsletters, agreed to be tracked by partners he cannot name, and watched twelve seconds of a video about a house with a surprising staircase.",
    "The temperature was 31 degrees. He knows this because a small rectangle in the corner of the screen eventually told him, between offers.",
    "\"I only wanted to know if I needed a jacket,\" he said, wearing a jacket. \"Instead I got a free ebook about productivity. I have not read it. I will not read it.\"",
    "Experts describe the modern webpage as a room in which every wall is a salesperson. The article you are reading, they note, was available the whole time. It was never allowed to be the first thing you saw.",
  ],
};

export type OverlayKind = "consent" | "newsletter" | "chat" | "video" | "offer";

export type OverlayCopy = {
  kind: OverlayKind;
  heading: string;
  body: string;
  accept: string;
  decline: string;
  checkbox?: string; // pre-ticked box [S1]
};

// Variants let the pile show different text every spawn. Order matters: the director
// walks each list front to back.
export const overlays: Record<OverlayKind, OverlayCopy[]> = {
  consent: [
    {
      kind: "consent",
      heading: "We value your privacy",
      body: "We and our selected partners store information on your device, and we use it to personalise what you see, what you feel, and what you buy.",
      accept: "Accept all",
      decline: "Reject all",
      checkbox: "Remember my choice on every site you visit",
    },
    {
      kind: "consent",
      heading: "Your privacy choices",
      body: "You are in control. There are 47 purposes. All of them are essential. Manage them in the preferences centre, which is behind this banner.",
      accept: "Accept all and continue",
      decline: "Reject all",
      checkbox: "I agree that my choice does not matter",
    },
    {
      kind: "consent",
      heading: "One more thing about cookies",
      body: "This box is a formality. The internet has already decided. We are telling you because a law made us, and because you deserve to watch.",
      accept: "I consent",
      decline: "Reject all",
      checkbox: "Share my details with 47 carefully chosen partners",
    },
    {
      kind: "consent",
      heading: "We noticed you have not accepted yet",
      body: "Accepting takes one click. Rejecting takes one click that we have made very small. That is the whole design.",
      accept: "Accept",
      decline: "Reject all",
      checkbox: "Faster checkout on sites I have never visited",
    },
    {
      kind: "consent",
      heading: "Last chance for privacy",
      body: "If you close this, we will open another one. Not because we are cruel, but because the other one converts better.",
      accept: "Accept everything",
      decline: "Reject all",
    },
  ],
  newsletter: [
    {
      kind: "newsletter",
      heading: "Before you go: one email a day",
      body: "The news you need, plus the news we would like you to need. You can unsubscribe at any time, in a process we will describe later.",
      accept: "Yes, send me everything",
      decline: "No thanks, I hate good ideas",
    },
    {
      kind: "newsletter",
      heading: "Join the community",
      body: "One email per day. Sometimes two. On Tuesdays, eleven. You will get used to it, and then you will need it.",
      accept: "Sign me up",
      decline: "I prefer to stay uninformed",
    },
    {
      kind: "newsletter",
      heading: "Unlock 3 free articles",
      body: "You have read 1 of your 3 free articles this month. This article is the 1. The counter resets when you forget to look at it.",
      accept: "Unlock now",
      decline: "Continue reading nothing",
    },
  ],
  chat: [
    {
      kind: "chat",
      heading: "Chad from Support",
      body: "Hi! I noticed you have been on this page for 0.4 seconds. Can I help you find something? I am a real person, and also a script.",
      accept: "Chat now",
      decline: "I would rather not chat with Chad",
    },
    {
      kind: "chat",
      heading: "Sana from Sales",
      body: "Looks like you are shopping for something. I cannot see your screen, but I can see that you are here, and that is enough for me.",
      accept: "Start the conversation",
      decline: "Close, and please do not follow me",
    },
    {
      kind: "chat",
      heading: "Bot 47",
      body: "I have been waiting for you. Not in a creepy way. In a targeted way. There is a difference when you say it in a blog post.",
      accept: "Say hello",
      decline: "Leave me alone, Bot 47",
    },
  ],
  video: [
    {
      kind: "video",
      heading: "Now playing",
      body: "Watch: 12 things you will never guess about a house with a surprising staircase. The video is muted. The subtitles are not.",
      accept: "Unmute",
      decline: "Skip (the next one plays anyway)",
    },
    {
      kind: "video",
      heading: "Recommended for you",
      body: "This autoplayed because in 2019 you looked at a picture of a bookshelf. We think about that a lot. Probably more than you do.",
      accept: "Watch next",
      decline: "Pause",
    },
  ],
  offer: [
    {
      kind: "offer",
      heading: "Your exclusive discount expires soon",
      body: "You have 09:59 to use a discount you did not ask for. Two other people are looking at this right now. They are not.",
      accept: "Claim my discount",
      decline: "I do not want to save money",
    },
    {
      kind: "offer",
      heading: "Wait, do not leave",
      body: "Before you go, here is a shorter version of the thing you were already reading, plus a countdown, plus a wheel, plus a bell.",
      accept: "Stay",
      decline: "Leave (the countdown follows you)",
    },
    {
      kind: "offer",
      heading: "You are the 1,000,000th reader",
      body: "This message is shown to every reader. It was true once. For one person. Possibly.",
      accept: "Claim my prize",
      decline: "It was not me",
    },
  ],
};

// The reveal: the page cleans itself up and shows the same article with nothing on it.
export const cleanupReveal = {
  heading: "Nothing here",
  line: "This is what it looks like when nobody is selling you anything.",
  points: [
    "No banner.",
    "No modal.",
    "No autoplay.",
    "No countdown.",
    "Just the article you came for.",
  ],
  // Shown under the cleaned-up article so the joke explains itself.
  footnote: "The overlays were a parody. This page has no analytics, no cookies of its own, and no backend.",
};

export const stopTheMadness = {
  label: "Stop the madness",
  hint: "Closes every overlay on this page and keeps them closed.",
};

// "Dismissed" is what every close button on this page actually does.
export const overlayClose = "Dismiss";
