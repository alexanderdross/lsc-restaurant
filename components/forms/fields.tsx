import type { ReactNode } from "react";

export const inputBase =
  "w-full rounded-lg border border-cream/15 bg-espresso/50 px-4 py-3 text-cream placeholder:text-cream-dim/50 transition-colors focus:border-rose focus:outline-none";

export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-cream">
      {children}
      {required && <span className="text-rose"> *</span>}
    </label>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-sm text-rose">{msg}</p>;
}

/** Honeypot-Feld (für Menschen unsichtbar, Bots füllen es aus). */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
      <label htmlFor="company">Firma (bitte leer lassen)</label>
      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
