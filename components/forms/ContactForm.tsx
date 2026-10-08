"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage, type FormState } from "@/app/actions/mail";
import { topics } from "./topics";
import { inputBase, FieldLabel, FieldError, Honeypot } from "./fields";
import Turnstile from "./Turnstile";

const initial: FormState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary disabled:opacity-60"
    >
      {pending ? "Wird gesendet …" : "Nachricht senden"}
    </button>
  );
}

/**
 * Allgemeines Kontaktformular (Anfragen und Bewerbungen).
 * Über das Feld „Anliegen" landet der passende Betreff in der E-Mail, damit
 * im Postfach sofort erkennbar ist, worum es geht.
 */
export default function ContactForm() {
  const [state, formAction] = useActionState(sendMessage, initial);

  if (state.ok) {
    return (
      <div className="card p-8 text-center" role="status">
        <p className="script text-2xl">Grazie!</p>
        <p className="mt-3 text-cream-dim">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative space-y-5" noValidate>
      <Honeypot />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name" required>
            Name
          </FieldLabel>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={!!state.errors?.name}
            aria-describedby={
              state.errors?.name ? "contact-name-error" : undefined
            }
            className={inputBase}
          />
          <FieldError id="contact-name-error" msg={state.errors?.name} />
        </div>
        <div>
          <FieldLabel htmlFor="email" required>
            E-Mail
          </FieldLabel>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!state.errors?.email}
            aria-describedby={
              state.errors?.email ? "contact-email-error" : undefined
            }
            className={inputBase}
          />
          <FieldError id="contact-email-error" msg={state.errors?.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="phone">Telefon</FieldLabel>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputBase}
          />
        </div>
        <div>
          <FieldLabel htmlFor="topic">Anliegen</FieldLabel>
          <select
            id="topic"
            name="topic"
            defaultValue={topics[0]}
            className={inputBase}
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="message" required>
          Nachricht
        </FieldLabel>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          aria-invalid={!!state.errors?.message}
          aria-describedby={
            state.errors?.message ? "contact-message-error" : undefined
          }
          className={inputBase}
          placeholder="Wie können wir helfen?"
        />
        <FieldError id="contact-message-error" msg={state.errors?.message} />
      </div>

      <Turnstile action="contact" />

      {state.message && !state.ok && (
        <p className="text-sm text-rose" role="alert">
          {state.message}
        </p>
      )}

      <SubmitButton />
      <p className="text-xs leading-relaxed text-cream-dim">
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur
        Bearbeitung Ihres Anliegens zu. Details in unserer{" "}
        <a href="/datenschutz" className="underline hover:text-rose">
          Datenschutzerklärung
        </a>
        .
      </p>
    </form>
  );
}
