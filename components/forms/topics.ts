/**
 * Auswahl im Feld „Anliegen" des Kontaktformulars.
 *
 * Steht bewusst in einem eigenen Modul: `app/actions/mail.ts` ist mit
 * `"use server"` markiert und darf ausschließlich async Funktionen
 * exportieren – Konstanten von dort kommen im Client nicht als Array an.
 * Formular (Client) und Zod-Schema (Server) teilen sich diese Liste.
 */
export const topics = ["Allgemeine Anfrage", "Bewerbung"] as const;

export type Topic = (typeof topics)[number];
