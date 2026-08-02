/**
 * Idempotenter Patch für @opennextjs/cloudflare.
 *
 * OpenNext bündelt die Server-Funktion mit esbuild, markiert dabei aber
 * `cloudflare:sockets` nicht als extern. Unser SMTP-Client (lib/smtp.ts) nutzt
 * dieses Runtime-Modul über einen dynamischen Import. Damit esbuild den Import
 * nicht aufzulösen versucht (und daran scheitert), ergänzen wir das Schema in
 * der esbuild-`external`-Liste. workerd stellt das Modul zur Laufzeit bereit.
 *
 * Läuft automatisch als `postinstall` – auch in Cloudflare Workers Builds.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const target =
  "node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js";

const NEEDLE = 'external: ["./middleware/handler.mjs"],';
const REPLACEMENT =
  'external: ["./middleware/handler.mjs", "cloudflare:sockets", "cloudflare:*"],';

async function main() {
  if (!existsSync(target)) {
    // Abhängigkeit (noch) nicht installiert – nichts zu tun.
    return;
  }
  const code = await readFile(target, "utf8");
  if (code.includes('"cloudflare:sockets"')) {
    // Bereits gepatcht.
    return;
  }
  if (!code.includes(NEEDLE)) {
    console.warn(
      "[patch-opennext] Erwartete esbuild-external-Zeile nicht gefunden – " +
        "Patch übersprungen. Bitte bundle-server.js prüfen."
    );
    return;
  }
  await writeFile(target, code.replace(NEEDLE, REPLACEMENT), "utf8");
  console.log("[patch-opennext] cloudflare:sockets als esbuild-external ergänzt.");
}

main().catch((err) => {
  console.warn("[patch-opennext] Patch fehlgeschlagen:", err);
});
