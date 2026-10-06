/*
 * First-Load-JS-Budget.
 *
 * Miss die gzip-Größe der JavaScript-Chunks, die eine App-Route beim ersten
 * Laden benötigt, und prüfe die schwerste Route gegen ein Budget. Fängt
 * Regressionen ab, z. B. wenn versehentlich eine schwere Bibliothek in die
 * First-Load-JS jeder Seite gezogen wird.
 *
 * Quelle sind die vorgerenderten HTML-Dateien aus `next build`
 * (`.next/server/app/**​/*.html`): die dort als `<script>` referenzierten
 * `/_next/static/chunks/*.js` sind exakt das JS, das ein moderner Browser für
 * den Erstaufruf lädt. Das ist robust gegen die wechselnden Manifest-Formate
 * (Next 16 / Turbopack hat `app-build-manifest.json` entfernt) und gegen die
 * gehashten Chunk-Namen.
 *
 * `noModule`-Skripte (das Legacy-Polyfill-Bundle) werden ausgeklammert – die
 * lädt nur ein veralteter Browser ohne ES-Module, nicht die moderne Zielgruppe.
 *
 *   node scripts/check-bundle-budget.mjs [--budget-kb 165]
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const NEXT_DIR = ".next";
const APP_DIR = join(NEXT_DIR, "server", "app");

// Budget in KiB (gzip). Mit Next 16 / Turbopack liegt die schwerste Route bei
// ~145 kB (vorher unter webpack ~114 kB – der Bundler-Wechsel hebt die
// Basislinie an, das ist keine App-Regression). 165 kB lässt Luft für normales
// Wachstum, schlägt aber bei einer echten Regression an.
const argIdx = process.argv.indexOf("--budget-kb");
const BUDGET_KB = argIdx !== -1 ? Number(process.argv[argIdx + 1]) : 165;

// Alle vorgerenderten HTML-Dateien unterhalb von .next/server/app einsammeln.
function findHtml(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(findHtml(full));
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const htmlFiles = findHtml(APP_DIR);

if (htmlFiles.length === 0) {
  console.error(
    `[bundle-budget] Keine vorgerenderten HTML-Dateien unter ${APP_DIR} gefunden – ` +
      "bitte zuerst `npm run build` ausführen."
  );
  process.exit(1);
}

const gzipCache = new Map();
function gzipKb(chunkFile) {
  if (gzipCache.has(chunkFile)) return gzipCache.get(chunkFile);
  let kb = 0;
  try {
    kb = gzipSync(readFileSync(join(NEXT_DIR, chunkFile))).length / 1024;
  } catch {
    kb = 0; // fehlende Datei zählt als 0, statt den Check abstürzen zu lassen
  }
  gzipCache.set(chunkFile, kb);
  return kb;
}

// Aus dem HTML einer Route die First-Load-JS-Chunks ziehen: alle <script>-Tags
// mit einem Chunk-src, ohne die `noModule`-Legacy-Polyfills.
function firstLoadChunks(htmlPath) {
  const html = readFileSync(htmlPath, "utf8");
  const tags =
    html.match(
      /<script[^>]*\ssrc="\/_next\/static\/chunks\/[^"]+\.js"[^>]*>/g
    ) || [];
  const chunks = new Set();
  for (const tag of tags) {
    if (/\bnoModule\b/.test(tag)) continue; // nur für Alt-Browser
    const m = tag.match(/\/_next\/(static\/chunks\/[^"]+\.js)/);
    if (m) chunks.add(m[1]); // Pfad relativ zu .next
  }
  return chunks;
}

// HTML-Pfad → Routen-Name: index.html → "/", allergene.html → "/allergene".
function routeName(htmlPath) {
  const rel = relative(APP_DIR, htmlPath).replace(/\.html$/, "");
  if (rel === "index") return "/";
  return "/" + rel.replace(/\/index$/, "");
}

const results = htmlFiles
  .map((htmlPath) => {
    let kb = 0;
    for (const chunk of firstLoadChunks(htmlPath)) kb += gzipKb(chunk);
    return { route: routeName(htmlPath), kb };
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
