/*
 * Generiert die iOS-Startbilder ("apple-touch-startup-image") für die PWA.
 *
 * iOS zeigt beim Start einer installierten PWA ein statisches Startbild an,
 * das exakt zur Bildschirmauflösung des Geräts passen muss – sonst ignoriert
 * iOS es. Für jede Geräteklasse (Hoch- und Querformat) wird daher ein eigenes
 * PNG in Espresso-Farbe mit zentriertem Logo erzeugt.
 *
 * Ergebnisse:
 *   - PNGs unter  public/splash/apple-splash-<w>-<h>.png
 *   - Link-Daten  content/iosSplash.ts  (media-Query + href je Bild)
 *
 * Einmalig lokal ausführen und die Ergebnisse committen:
 *   node scripts/generate-ios-splash.mjs
 *
 * Benötigt `sharp` (steht über die Next.js-Abhängigkeiten zur Verfügung). Die
 * erzeugten PNGs sind eingecheckt – im CI/Build wird das Skript NICHT gebraucht.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "splash");
const logoSrc = join(root, "public", "logo.png"); // helle Variante (auf Dunkel lesbar)

// Hintergrund = manifest background_color (Espresso).
const BG = { r: 0x1e, g: 0x12, b: 0x0c, alpha: 1 };

// Apple-Geräte: Angaben in CSS-Punkten (Hochformat) + Device-Pixel-Ratio.
// Deckt iPhones (inkl. Dynamic-Island-Modelle) und iPads ab.
const DEVICES = [
  // iPhones
  { w: 320, h: 568, r: 2 }, // SE (1. Gen), 5/5s
  { w: 375, h: 667, r: 2 }, // 6/7/8, SE (2./3. Gen)
  { w: 414, h: 736, r: 3 }, // 6/7/8 Plus
  { w: 375, h: 812, r: 3 }, // X, XS, 11 Pro, 12/13 mini
  { w: 414, h: 896, r: 2 }, // XR, 11
  { w: 414, h: 896, r: 3 }, // XS Max, 11 Pro Max
  { w: 390, h: 844, r: 3 }, // 12, 12 Pro, 13, 13 Pro, 14
  { w: 428, h: 926, r: 3 }, // 12/13 Pro Max, 14 Plus
  { w: 393, h: 852, r: 3 }, // 14 Pro, 15, 15 Pro, 16
  { w: 430, h: 932, r: 3 }, // 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus
  { w: 402, h: 874, r: 3 }, // 16 Pro
  { w: 440, h: 956, r: 3 }, // 16 Pro Max
  // iPads (dpr 2)
  { w: 744, h: 1133, r: 2 }, // iPad mini (6. Gen)
  { w: 768, h: 1024, r: 2 }, // iPad mini/Air 9.7"
  { w: 810, h: 1080, r: 2 }, // iPad 10.2"
  { w: 820, h: 1180, r: 2 }, // iPad Air 10.9" / iPad 10.9"
  { w: 834, h: 1112, r: 2 }, // iPad Air/Pro 10.5"
  { w: 834, h: 1194, r: 2 }, // iPad Pro 11"
  { w: 1024, h: 1366, r: 2 }, // iPad Pro 12.9"
];

async function renderOne(pxW, pxH) {
  // Logo auf ~42 % der kürzeren Kante, Seitenverhältnis erhalten.
  const logoW = Math.round(Math.min(pxW, pxH) * 0.42);
  const logo = await sharp(logoSrc).resize({ width: logoW }).png().toBuffer();

  const file = `apple-splash-${pxW}-${pxH}.png`;
  await sharp({
    create: { width: pxW, height: pxH, channels: 4, background: BG },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, file));

  return `/splash/${file}`;
}

function media(w, h, r, orientation) {
  return (
    `(device-width: ${w}px) and (device-height: ${h}px) ` +
    `and (-webkit-device-pixel-ratio: ${r}) and (orientation: ${orientation})`
  );
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const links = [];
  const seen = new Set();

  for (const { w, h, r } of DEVICES) {
    for (const orientation of ["portrait", "landscape"]) {
      const key = `${w}x${h}x${r}x${orientation}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const pxW = orientation === "portrait" ? w * r : h * r;
      const pxH = orientation === "portrait" ? h * r : w * r;
      const href = await renderOne(pxW, pxH);
      links.push({ media: media(w, h, r, orientation), href });
    }
  }

  const ts =
    "// AUTOMATISCH GENERIERT von scripts/generate-ios-splash.mjs – nicht von Hand editieren.\n" +
    "// iOS-Startbilder (apple-touch-startup-image) je Geräteklasse und Ausrichtung.\n" +
    "export type IosSplashLink = { media: string; href: string };\n\n" +
    "export const iosSplashLinks: IosSplashLink[] = " +
    JSON.stringify(links, null, 2) +
    ";\n";
  await writeFile(join(root, "content", "iosSplash.ts"), ts, "utf8");

  console.log(
    `[ios-splash] ${links.length} Startbilder erzeugt → public/splash/`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
