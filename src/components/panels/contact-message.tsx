"use client";

import * as React from "react";
import { getSupabaseClient } from "@/src/lib/supabase";
import { CONTACT } from "@/content";

const MESSAGE_MAX = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactMessagePanel() {
  const supabase = React.useMemo(() => getSupabaseClient(), []);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = React.useState<{ text: string; kind: "error" | "success" | "" }>({ text: "", kind: "" });
  const [submitting, setSubmitting] = React.useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = CONTACT.messages.nameRequired;
    if (!email.trim() || !EMAIL_RE.test(email.trim())) next.email = CONTACT.messages.emailInvalid;
    if (!message.trim()) next.message = CONTACT.messages.messageRequired;
    else if (message.trim().length > MESSAGE_MAX) next.message = CONTACT.messages.messageTooLong(MESSAGE_MAX);
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ text: "", kind: "" });

    if (!validate()) {
      setStatus({ text: CONTACT.messages.fixFields, kind: "error" });
      return;
    }
    if (!supabase) {
      setStatus({ text: CONTACT.messages.notConnected, kind: "error" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({ name: name.trim(), email: email.trim(), message: message.trim() });
    setSubmitting(false);

    if (error) {
      setStatus({ text: CONTACT.messages.sendFailed, kind: "error" });
      return;
    }

    setStatus({ text: CONTACT.messages.sendSuccess, kind: "success" });
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">{CONTACT.heading}</h2>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <Field id="contact-name" label={CONTACT.fields.name.label} error={errors.name}>
          <input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
            aria-invalid={!!errors.name}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-white/50"
          />
        </Field>
        <Field id="contact-email" label={CONTACT.fields.email.label} error={errors.email}>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            required
            aria-invalid={!!errors.email}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-white/50"
          />
        </Field>
        <Field id="contact-message" label={CONTACT.fields.message.label} error={errors.message}>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MESSAGE_MAX}
            required
            rows={4}
            aria-invalid={!!errors.message}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-white/50"
          />
        </Field>
        <div className="flex items-center gap-4 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? CONTACT.submittingLabel : CONTACT.submitLabel}
          </button>
          <p role="status" aria-live="polite" className={status.kind === "error" ? "text-sm text-red-400" : "text-sm text-white/70"}>
            {status.text}
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-widest text-white/50">
        {label}
      </label>
      {children}
      <p role="alert" className="min-h-[1.1em] text-xs text-red-400">
        {error}
      </p>
    </div>
  );
}
