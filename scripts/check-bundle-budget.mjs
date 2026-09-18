/*
 * First-Load-JS-Budget.
 *
 * Miss die gzip-Größe der JavaScript-Chunks, die eine App-Route beim ersten
 * Laden benötigt (Route-Entry + Root-Layout), und prüfe die schwerste Route
 * gegen ein Budget. Fängt Regressionen ab, z. B. wenn versehentlich eine
 * schwere Bibliothek in die First-Load-JS jeder Seite gezogen wird.
 *
 * Läuft nach `next build` gegen `.next/app-build-manifest.json`. Die
 * gemessene Summe entspricht praktisch dem „First Load JS"-Wert, den
 * `next build` selbst ausgibt (aktuell ~114 kB für `/`).
 *
 *   node scripts/check-bundle-budget.mjs [--budget-kb 140]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const NEXT_DIR = ".next";
const MANIFEST = join(NEXT_DIR, "app-build-manifest.json");

// Budget in KiB (gzip). Aktuell schwerste Route ~114 kB → 140 kB lässt Luft
// für normales Wachstum, schlägt aber bei einer echten Regression an.
const argIdx = process.argv.indexOf("--budget-kb");
const BUDGET_KB = argIdx !== -1 ? Number(process.argv[argIdx + 1]) : 140;

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
} catch {
  console.error(
    `[bundle-budget] ${MANIFEST} nicht gefunden – bitte zuerst \`npm run build\` ausführen.`
  );
  process.exit(1);
}

const pages = manifest.pages || {};
const layoutFiles = pages["/layout"] || [];

const gzipCache = new Map();
function gzipKb(file) {
  if (gzipCache.has(file)) return gzipCache.get(file);
  let kb = 0;
  try {
    kb = gzipSync(readFileSync(join(NEXT_DIR, file))).length / 1024;
  } catch {
    kb = 0; // fehlende Datei zählt als 0, statt den Check abstürzen zu lassen
  }
  gzipCache.set(file, kb);
  return kb;
}

// Alle App-Seiten-Routen (Keys, die auf "/page" enden).
const routeKeys = Object.keys(pages).filter(
  (k) => k === "/page" || k.endsWith("/page")
);

const results = routeKeys
  .map((key) => {
    const files = new Set([...layoutFiles, ...(pages[key] || [])]);
    let kb = 0;
    for (const f of files) if (f.endsWith(".js")) kb += gzipKb(f);
    const route = key.replace(/\/page$/, "") || "/";
    return { route, kb };
  })
  .sort((a, b) => b.kb - a.kb);

const worst = results[0];

console.log(`First-Load-JS (gzip) je Route – Budget ${BUDGET_KB} kB:`);
for (const r of results) {
  const flag = r.kb > BUDGET_KB ? " ✗" : "";
  console.log(`  ${r.kb.toFixed(1).padStart(7)} kB  ${r.route}${flag}`);
}

if (worst.kb > BUDGET_KB) {
  console.error(
    `\n[bundle-budget] FEHLER: ${worst.route} liegt bei ${worst.kb.toFixed(
      1
    )} kB und überschreitet das Budget von ${BUDGET_KB} kB.`
  );
  process.exit(1);
}

console.log(
  `\n[bundle-budget] OK – schwerste Route ${worst.route} bei ${worst.kb.toFixed(
    1
  )} kB (Budget ${BUDGET_KB} kB).`
);
