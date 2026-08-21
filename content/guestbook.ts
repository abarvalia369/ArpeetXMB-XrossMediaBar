import type { GuestbookContent } from "./types";

export const GUESTBOOK: GuestbookContent = {
  sign: {
    heading: "Sign the guestbook",
    fields: {
      name: { label: "Name" },
      message: { label: "Message" },
      website: { label: "Website" },
      captcha: { label: (a, b) => `What is ${a} + ${b}?` },
    },
    submitLabel: "Sign the guestbook",
    submittingLabel: "Signing…",
    messages: {
      honeypot: "Something went wrong. Please try again.",
      rateLimited: (secondsLeft) => `You're posting a bit fast — try again in ${secondsLeft}s.`,
      fillRequired: "Please fill in your name and a message.",
      nameTooLong: (max) => `Name must be ${max} characters or fewer.`,
      messageTooLong: (max) => `Message must be ${max} characters or fewer.`,
      captchaWrong: "That's not quite right — check the math question.",
      notConnected: "Guestbook is not connected yet (missing Supabase env vars).",
      postFailed: "Couldn't post right now. Please try again.",
      success: "Thanks for signing!",
    },
  },
  entries: {
    heading: "Guestbook entries",
    loading: "Loading entries…",
    notConnected: "Guestbook is not connected yet (missing Supabase env vars).",
    loadFailed: "Couldn't load the guestbook right now. Try again later.",
    empty: "Be the first to sign the guestbook!",
  },
};
