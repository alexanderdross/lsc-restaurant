"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendApplication, type FormState } from "@/app/actions/mail";
import { inputBase, FieldLabel, FieldError, Honeypot } from "./fields";
import Turnstile from "./Turnstile";

const initial: FormState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
      {pending ? "Wird gesendet …" : "Bewerbung senden"}
    </button>
  );
}

export default function JobForm() {
  const [state, formAction] = useActionState(sendApplication, initial);

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
            aria-describedby={state.errors?.name ? "job-name-error" : undefined}
            className={inputBase}
          />
          <FieldError id="job-name-error" msg={state.errors?.name} />
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
            aria-describedby={state.errors?.email ? "job-email-error" : undefined}
            className={inputBase}
          />
          <FieldError id="job-email-error" msg={state.errors?.email} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="phone">Telefon</FieldLabel>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputBase} />
      </div>

      <div>
        <FieldLabel htmlFor="message">Nachricht</FieldLabel>
        <textarea id="message" name="message" rows={5} className={inputBase} placeholder="Ein paar Worte zu dir …" />
      </div>

      <div>
        <FieldLabel htmlFor="file">Datei hochladen</FieldLabel>
        <input
          id="file"
          name="file"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          aria-invalid={!!state.errors?.file}
          aria-describedby={state.errors?.file ? "job-file-error" : "job-file-hint"}
          className="block w-full text-sm text-cream-dim file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-rose file:px-4 file:py-2 file:font-semibold file:text-espresso hover:file:bg-rose-gold"
        />
        <FieldError id="job-file-error" msg={state.errors?.file} />
        <p id="job-file-hint" className="mt-1 text-xs text-cream-dim">
          Lebenslauf o. Ä. – PDF, DOC/DOCX, JPG oder PNG, max. 5 MB.
        </p>
      </div>

      <Turnstile action="application" />

      {state.message && !state.ok && (
        <p className="text-sm text-rose" role="alert">
          {state.message}
        </p>
      )}

      <SubmitButton />
      <p className="text-xs leading-relaxed text-cream-dim">
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben im Rahmen des
        Bewerbungsverfahrens zu. Details in unserer{" "}
        <a href="/datenschutz" className="underline hover:text-rose">
          Datenschutzerklärung
        </a>
        .
      </p>
    </form>
  );
}
