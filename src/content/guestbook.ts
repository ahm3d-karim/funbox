// guestbook seeds + copy (agent-02 owns the toy that renders these).
//
// Honesty: the seeds below are fiction, written in the 1998 register, and the UI
// marks them as seeds. No real person, page or counter is being quoted, and no
// count or statistic is real. Entries the visitor writes stay in localStorage,
// which is exactly what the UI says out loud.

export type GuestEntry = {
  name: string;
  message: string;
  date: string; // YYYY-MM-DD
  home?: string; // era flavour: a personal homepage
  seeded: boolean; // true for the built-in entries, false for anything a visitor signs
};

export const guestbookSeeds: GuestEntry[] = [
  {
    name: "xX_skater_Xx",
    message: "first!!1! nice page. add me on ICQ 4112209",
    date: "1998-06-14",
    home: "members.tripod.com/xX_skater_Xx",
    seeded: true,
  },
  {
    name: "Missy",
    message: "your page took four minutes to load and it was worth every second",
    date: "1998-07-02",
    home: "geocities.com/SunsetStrip/Alley/1180",
    seeded: true,
  },
  {
    name: "dj_cassette",
    message: "signed. the midi loops forever but i respect it. is your counter real?",
    date: "1998-07-29",
    seeded: true,
  },
  {
    name: "Webmaster Dave",
    message: "you are visitor number 1,247. i typed that in myself. it counts.",
    date: "1998-08-19",
    home: "davezone.home.mindspring.com",
    seeded: true,
  },
  {
    name: "Anjum from Lahore",
    message: "found you through a webring, two links deep. brb, dialling back after school",
    date: "1998-09-05",
    seeded: true,
  },
  {
    name: "guest_1998",
    message: "hello?? can anyone read this. i am on a friend's computer",
    date: "1998-10-11",
    seeded: true,
  },
];

export const guestbookUi = {
  heading: "Guestbook",
  blurb: "Sign it. The rules are from 1998: be nice, mention your homepage.",
  nameLabel: "Your handle",
  namePlaceholder: "modem_queen_1998",
  messageLabel: "Your message",
  messagePlaceholder: "cool page. brb after school.",
  submit: "Sign the guestbook",
  missingName: "You need a handle first.",
  missingMessage: "Say something. Anything. One line is enough.",
  tooLong: "That is a blog post, not a guestbook entry. Try 200 characters.",
  storageNote: "Your entry is saved in this browser only, in localStorage. Nothing is sent anywhere. Clear your site data and it is gone, like a floppy.",
  seedNote: "The first six entries are seeds, so the page is not empty. Yours is the real one.",
  seededTag: "seed",
  empty: "No entries yet. Be the first of 1998.",
  clear: "Clear my entries from this browser",
  cleared: "Cleared. The page is back to its six seeds.",
};
