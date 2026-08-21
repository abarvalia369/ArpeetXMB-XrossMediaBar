import type { ContactContent } from "./types";

export const CONTACT: ContactContent = {
  heading: "Send a message",
  fields: {
    name: { label: "Name" },
    email: { label: "Email" },
    message: { label: "Message" },
  },
  submitLabel: "Send message",
  submittingLabel: "Sending…",
  messages: {
    nameRequired: "Please enter your name.",
    emailInvalid: "Please enter a valid email address.",
    messageRequired: "Please enter a message.",
    messageTooLong: (max) => `Message must be ${max} characters or fewer.`,
    fixFields: "Please fix the highlighted fields.",
    notConnected: "Contact form is not connected yet (missing Supabase env vars). Email me directly instead.",
    sendFailed: "Couldn't send right now — please try again, or email me directly instead.",
    sendSuccess: "Message sent — thanks for reaching out! I'll reply by email.",
  },
};
