"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendSmtpMail } from "@/lib/smtp";
import { site } from "@/content/site";
import { topics } from "@/components/forms/topics";

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

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
}): Promise<void> {
  const env = getEnv();
  const host = env.SMTP_HOST;
  const port = Number(env.SMTP_PORT || "587");
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const from = env.MAIL_FROM || user;
  const to = env.MAIL_TO || site.email;

  // Beim Einrichten ist der häufigste Fehler ein vergessenes oder im falschen
  // Block (Build statt Laufzeit) hinterlegtes Secret. Deshalb benennen wir im
  // Log genau, welches fehlt – die Meldung an den Gast bleibt allgemein.
  if (!host || !user || !pass || !from) {
    const missing = [
      ["SMTP_HOST", host],
      ["SMTP_USER", user],
      ["SMTP_PASS", pass],
      ["MAIL_FROM", from],
    ]
      .filter(([, v]) => !v)
      .map(([k]) => k);
    throw new Error(
      `SMTP-Konfiguration unvollständig – fehlende Worker-Secrets: ${missing.join(", ")}. ` +
        "Sie gehören zu den Laufzeit-Variablen des Workers, nicht zu den Build-Variablen."
    );
  }

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(
      `SMTP_PORT ist kein gültiger Port: "${env.SMTP_PORT}". Erwartet wird 587 (STARTTLS) oder 465 (SSL).`
    );
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
  });
}

/* -------------------------------------------------------------------------- */
/*  Kontaktformular (allgemeine Anfragen und Bewerbungen)                     */
/* -------------------------------------------------------------------------- */

const messageSchema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an."),
  email: z
    .string()
    .trim()
    .email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  phone: z.string().trim().optional().default(""),
  topic: z.enum(topics).default(topics[0]),
  message: z
    .string()
    .trim()
    .min(5, "Bitte schreiben Sie uns ein paar Worte.")
    .max(5000, "Bitte fassen Sie sich etwas kürzer (max. 5000 Zeichen)."),
});

export async function sendMessage(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (formData.get("company")) {
    return { ok: true, message: "Vielen Dank!" };
  }

  const parsed = messageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    topic: formData.get("topic") ?? undefined,
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
    "Neue Nachricht über die Website:",
    "",
    `Name:     ${d.name}`,
    `E-Mail:   ${d.email}`,
    `Telefon:  ${d.phone || "—"}`,
    `Anliegen: ${d.topic}`,
    "",
    "Nachricht:",
    d.message,
  ].join("\n");

  try {
    await sendMail({
      subject: `${d.topic} von ${d.name}`,
      text,
      replyTo: { name: d.name, email: d.email },
    });
    return {
      ok: true,
      message:
        "Vielen Dank für Ihre Nachricht! Wir haben sie erhalten und melden uns bei Ihnen.",
    };
  } catch (err) {
    console.error("sendMessage failed:", err);
    return {
      ok: false,
      message:
        "Der Versand ist leider fehlgeschlagen. Bitte schreiben Sie uns direkt an " +
        site.email +
        ".",
    };
  }
}
