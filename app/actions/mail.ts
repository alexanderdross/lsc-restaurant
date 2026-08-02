"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendSmtpMail } from "@/lib/smtp";
import { site } from "@/content/site";

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

const MAX_UPLOAD = 5 * 1024 * 1024; // 5 MB
const ALLOWED_UPLOAD = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function getEnv(): CloudflareEnv {
  return getCloudflareContext().env as unknown as CloudflareEnv;
}

const TURNSTILE_ERROR =
  "Sicherheitsprüfung fehlgeschlagen. Bitte laden Sie die Seite neu und versuchen Sie es erneut.";

/**
 * Prüft das Cloudflare-Turnstile-Token gegen die siteverify-API.
 * Ist kein Secret konfiguriert (Setup-Phase), wird die Prüfung übersprungen.
 */
async function verifyTurnstile(token: string | null): Promise<boolean> {
  const secret = getEnv().TURNSTILE_SECRET_KEY;
  if (!secret) return true; // nicht konfiguriert -> überspringen
  if (!token) return false;

  let ip: string | undefined;
  try {
    ip = (await headers()).get("cf-connecting-ip") ?? undefined;
  } catch {
    /* ignore */
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
      }
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile-Verifikation fehlgeschlagen:", err);
    return false;
  }
}

async function sendMail(opts: {
  subject: string;
  text: string;
  replyTo?: { name?: string; email: string };
  attachments?: { filename: string; content: string; mimeType?: string }[];
}): Promise<void> {
  const env = getEnv();
  const host = env.SMTP_HOST;
  const port = Number(env.SMTP_PORT || "587");
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const from = env.MAIL_FROM || user;
  const to = env.MAIL_TO || site.email;

  if (!host || !user || !pass || !from) {
    throw new Error("SMTP-Konfiguration fehlt (Secrets nicht gesetzt).");
  }

  await sendSmtpMail({
    host,
    port,
    username: user,
    password: pass,
    from: { name: site.shortName, email: from },
    to: { email: to },
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
    attachments: opts.attachments,
  });
}

/* -------------------------------------------------------------------------- */
/*  Reservierungs- / Kontaktformular                                          */
/* -------------------------------------------------------------------------- */
const reservationSchema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an."),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  phone: z.string().trim().optional().default(""),
  date: z.string().trim().optional().default(""),
  persons: z.string().trim().optional().default(""),
  message: z.string().trim().max(3000).optional().default(""),
});

export async function sendReservation(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot gegen Spam-Bots
  if (formData.get("company")) {
    return { ok: true, message: "Vielen Dank!" };
  }

  const parsed = reservationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    date: formData.get("date"),
    persons: formData.get("persons"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Bitte prüfen Sie Ihre Eingaben.",
      errors: fieldErrors(parsed.error),
    };
  }

  const turnstileToken = formData.get("cf-turnstile-response");
  if (
    !(await verifyTurnstile(
      typeof turnstileToken === "string" ? turnstileToken : null
    ))
  ) {
    return { ok: false, message: TURNSTILE_ERROR };
  }

  const d = parsed.data;
  const text = [
    "Neue Reservierungs-/Kontaktanfrage über die Website:",
    "",
    `Name:      ${d.name}`,
    `E-Mail:    ${d.email}`,
    `Telefon:   ${d.phone || "—"}`,
    `Datum:     ${d.date || "—"}`,
    `Personen:  ${d.persons || "—"}`,
    "",
    "Nachricht:",
    d.message || "—",
  ].join("\n");

  try {
    await sendMail({
      subject: `Reservierungsanfrage von ${d.name}`,
      text,
      replyTo: { name: d.name, email: d.email },
    });
    return {
      ok: true,
      message:
        "Vielen Dank! Ihre Anfrage wurde gesendet – wir melden uns so schnell wie möglich bei Ihnen.",
    };
  } catch (err) {
    console.error("sendReservation failed:", err);
    return {
      ok: false,
      message:
        "Der Versand ist leider fehlgeschlagen. Bitte rufen Sie uns an oder schreiben Sie an " +
        site.email +
        ".",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  Bewerbungsformular (mit optionalem Datei-Upload)                          */
/* -------------------------------------------------------------------------- */
const applicationSchema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an."),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  phone: z.string().trim().optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
});

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function sendApplication(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (formData.get("company")) {
    return { ok: true, message: "Vielen Dank!" };
  }

  const parsed = applicationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Bitte prüfen Sie Ihre Eingaben.",
      errors: fieldErrors(parsed.error),
    };
  }

  const turnstileToken = formData.get("cf-turnstile-response");
  if (
    !(await verifyTurnstile(
      typeof turnstileToken === "string" ? turnstileToken : null
    ))
  ) {
    return { ok: false, message: TURNSTILE_ERROR };
  }

  // Datei-Upload prüfen
  const attachments: { filename: string; content: string; mimeType?: string }[] = [];
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD) {
      return {
        ok: false,
        message: "Die Datei ist zu groß (max. 5 MB).",
        errors: { file: "Datei zu groß (max. 5 MB)." },
      };
    }
    if (file.type && !ALLOWED_UPLOAD.includes(file.type)) {
      return {
        ok: false,
        message: "Dateityp nicht erlaubt (PDF, DOC/DOCX, JPG oder PNG).",
        errors: { file: "Bitte PDF, DOC/DOCX, JPG oder PNG hochladen." },
      };
    }
    const buf = await file.arrayBuffer();
    attachments.push({
      filename: file.name || "bewerbung",
      content: toBase64(buf),
      mimeType: file.type || "application/octet-stream",
    });
  }

  const d = parsed.data;
  const text = [
    "Neue Bewerbung über die Website:",
    "",
    `Name:     ${d.name}`,
    `E-Mail:   ${d.email}`,
    `Telefon:  ${d.phone || "—"}`,
    "",
    "Nachricht:",
    d.message || "—",
    "",
    attachments.length ? "Anhang: siehe angehängte Datei." : "Anhang: keiner.",
  ].join("\n");

  try {
    await sendMail({
      subject: `Bewerbung von ${d.name}`,
      text,
      replyTo: { name: d.name, email: d.email },
      attachments,
    });
    return {
      ok: true,
      message:
        "Vielen Dank für Ihre Bewerbung! Wir haben sie erhalten und melden uns bei Ihnen.",
    };
  } catch (err) {
    console.error("sendApplication failed:", err);
    return {
      ok: false,
      message:
        "Der Versand ist leider fehlgeschlagen. Bitte senden Sie Ihre Bewerbung direkt an " +
        site.email +
        ".",
    };
  }
}
