"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendReservation, type FormState } from "@/app/actions/mail";
import { inputBase, FieldLabel, FieldError, Honeypot } from "./fields";
import Turnstile from "./Turnstile";

const initial: FormState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
      {pending ? "Wird gesendet …" : "Anfrage senden"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(sendReservation, initial);

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
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            className={inputBase}
          />
          <FieldError id="name-error" msg={state.errors?.name} />
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
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            className={inputBase}
          />
          <FieldError id="email-error" msg={state.errors?.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="phone">Telefon</FieldLabel>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputBase} />
        </div>
        <div>
          <FieldLabel htmlFor="date">Datum</FieldLabel>
          <input id="date" name="date" type="date" className={inputBase} />
        </div>
        <div>
          <FieldLabel htmlFor="persons">Personen</FieldLabel>
          <input id="persons" name="persons" type="number" min={1} max={99} inputMode="numeric" className={inputBase} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="message">Nachricht</FieldLabel>
        <textarea id="message" name="message" rows={5} className={inputBase} placeholder="Wunschzeit, Anlass, Fragen …" />
      </div>

      <Turnstile action="reservation" />

      {state.message && !state.ok && (
        <p className="text-sm text-rose" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton />
      </div>
      <p className="text-xs leading-relaxed text-cream-dim">
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur Bearbeitung
        Ihrer Anfrage zu. Details in unserer{" "}
        <a href="/datenschutz" className="underline hover:text-rose">
          Datenschutzerklärung
        </a>
        .
      </p>
    </form>
  );
}
