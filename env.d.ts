/**
 * Typen für die per Cloudflare-Secrets / .dev.vars bereitgestellten
 * SMTP-Zugangsdaten (netcup) sowie Worker-Bindings.
 */
interface CloudflareEnv {
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  MAIL_FROM?: string;
  MAIL_TO?: string;
  /** Cloudflare Turnstile – geheimer Schlüssel für die serverseitige Prüfung. */
  TURNSTILE_SECRET_KEY?: string;
}
