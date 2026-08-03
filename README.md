# LSC Restaurant | Pizzeria – Website

Moderner Relaunch der Website des **LSC Restaurants** am Bodensee-Airport
Friedrichshafen. Gebaut mit **Next.js (App Router)** und deployt auf
**Cloudflare Workers** über **Cloudflare Workers Builds** – mit der warmen
Braun-Rosé-Markenwelt in einem aufgefrischten, mobiloptimierten Design.

## Tech-Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **@opennextjs/cloudflare** – Adapter für Cloudflare Workers
- **Tailwind CSS v4** – Design-Tokens als CSS-Variablen (dunkles Braun-Rosé-Theme)
- **next/font/local** – vollständig self-hosted Variable Fonts (Fraunces, Inter,
  Dancing Script als `woff2` in `app/fonts/`), `font-display: swap`, keine
  Google-Abhängigkeit (Build + Runtime)
- **Kontakt-/Bewerbungsformular** – Server Actions + eigener SMTP-Client
  (`lib/smtp.ts`, `cloudflare:sockets`, STARTTLS) an **netcup**

## Projektstruktur

```
app/
  layout.tsx              # Fonts, Header, Footer, Metadata
  page.tsx                # Startseite
  kontakt/                # Kontakt (kein Formular – Reservierung/Bestellung telefonisch)
  speisekarte/            # Speisekarte
  mittagstisch/           # Mittagstisch
  saisonkarte/            # Saisonkarte
  allergene/              # Allergene & Zusatzstoffe
  rundgang/               # 360°-Rundgang (iframe-Einbindung)
  jobs/                   # Jobs + Bewerbungsformular (mit Datei-Upload)
  impressum/, datenschutz/
  actions/mail.ts         # Server Action: Bewerbung (Jobs)
  sitemap.ts, robots.ts   # SEO
components/                # Header, Footer, Menu, Formulare, …
content/
  site.ts                 # Stammdaten (Adresse, Zeiten, Kontakt, Social)
  menu.ts                 # Speise-/Saison-/Mittagskarte + Allergen-Legende
  nav.ts                  # Navigation
lib/smtp.ts               # SMTP-Client für Cloudflare Workers
scripts/patch-opennext.mjs# Postinstall-Patch (cloudflare:sockets extern)
```

## Entwicklung

```bash
npm install          # installiert Abhängigkeiten (führt Patch automatisch aus)
npm run dev          # Next.js Dev-Server (http://localhost:3000)
npm run preview      # Build + lokale Ausführung in der Workers-Runtime (workerd)
```

Für den lokalen SMTP-Versand `.dev.vars.example` nach `.dev.vars` kopieren und
die netcup-Zugangsdaten eintragen (siehe unten).

## Inhalte pflegen

- **Speise-/Saison-/Mittagskarte:** `content/menu.ts`
- **Adresse, Öffnungszeiten, Telefon, Social, 360°-Tour-URL:** `content/site.ts`
- **Navigation:** `content/nav.ts`

Änderungen committen und pushen – Cloudflare Workers Builds deployt automatisch.

## Deployment: Cloudflare Workers Builds

1. In Cloudflare: **Workers & Pages → Create → Workers** und das GitHub-Repository
   verbinden (Branch wählen).
2. Build-Einstellungen:
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx wrangler deploy`
   - (Alternativ lokal: `npm run deploy`)
3. `wrangler.jsonc` ist bereits konfiguriert (`nodejs_compat`, aktuelles
   `compatibility_date`, Assets-Binding).
4. **Custom Domain** `www.lsc-restaurant.de` dem Worker zuordnen (DNS in
   Cloudflare umstellen).

### SMTP-Secrets (netcup) hinterlegen

Die Zugangsdaten werden **nicht** im Code gespeichert, sondern als
Worker-Secrets:

```bash
npx wrangler secret put SMTP_HOST     # z. B. mail.your-netcup-server.de
npx wrangler secret put SMTP_PORT     # 587 (STARTTLS) oder 465 (SSL)
npx wrangler secret put SMTP_USER     # netcup-Postfach, z. B. info@lsc-restaurant.de
npx wrangler secret put SMTP_PASS     # Postfach-Passwort
npx wrangler secret put MAIL_FROM     # Absender (echte netcup-Postfachadresse)
npx wrangler secret put MAIL_TO       # Empfänger, z. B. info@lsc-restaurant.de
```

> Hinweis: Für zuverlässige Zustellung SPF/DKIM der Domain bei netcup einrichten.

## Technische Notiz: `cloudflare:sockets`

Der SMTP-Versand nutzt das Runtime-Modul `cloudflare:sockets`. Da OpenNext dieses
Schema im esbuild-Schritt nicht automatisch externalisiert, ergänzt das
Postinstall-Skript `scripts/patch-opennext.mjs` die esbuild-`external`-Liste. Das
Skript ist idempotent und läuft automatisch nach `npm install` (auch in
Cloudflare Workers Builds).

## Formular-Schutz (Cloudflare Turnstile)

Das Bewerbungsformular (Jobs) ist mit **Cloudflare Turnstile**
geschützt. Der Widget-Slot ist CLS-optimiert (reservierter Platz, kein
Layout-Shift beim Nachladen). Serverseitig wird das Token in `app/actions/mail.ts`
gegen die siteverify-API geprüft.

Benötigte Schlüssel (Turnstile im Cloudflare-Dashboard anlegen):

- **`NEXT_PUBLIC_TURNSTILE_SITE_KEY`** – öffentlicher Site-Key, als **Build-Variable**
  in Workers Builds (bzw. `.env.local` lokal).
- **`TURNSTILE_SECRET_KEY`** – geheimer Schlüssel, als **Secret** im Worker
  (`wrangler secret put TURNSTILE_SECRET_KEY`).

Solange keine Schlüssel gesetzt sind, bleibt der Platzhalter sichtbar und die
serverseitige Prüfung wird übersprungen – die Formulare funktionieren weiterhin.

## Bildoptimierung (Cloudflare-Best-Practice)

Alle Bilder/Logos nutzen `next/image` mit fixen `width`/`height` (CLS-sicher),
`sizes`, `priority` fürs LCP-Bild und `loading="lazy"` below the fold. Logos sind
als **WebP** vor-optimiert. Da Workers keinen `sharp`-Optimizer haben, läuft die
Laufzeit-Optimierung über **Cloudflare Image Transformations** (`image-loader.ts`):

- Standard: Original wird ausgeliefert (funktioniert überall, auch `*.workers.dev`).
- Nach Aktivierung von „Image Transformations" auf der Zone: Build-Variable
  **`NEXT_PUBLIC_CF_IMAGE_RESIZING=true`** setzen → echtes Resizing + AVIF/WebP.

## Barrierefreiheit (WCAG AA)

- Farbkontraste auf allen Seiten auf AA geprüft (Palette in `app/globals.css`
  entsprechend abgestimmt, u. a. Wein-Ton für Rosé-/Creme-Text abgedunkelt).
- Semantische Struktur (genau ein `h1` pro Seite, Landmarks), sichtbarer
  Fokus-Ring, „Zum Inhalt springen"-Link, `aria-invalid`/`aria-describedby` an
  Formularfeldern, `prefers-reduced-motion` respektiert, `lang="de"`.

## Offene Punkte (vor Go-Live)

- [ ] Echte Foodfotografie / Terrassen- & Innenbilder einbinden
- [ ] Finale Braun-Hex-Werte gegen Logo/CI abgleichen (`app/globals.css`)
- [ ] netcup-SMTP-Zugangsdaten als Secrets setzen
- [ ] Turnstile-Schlüssel setzen (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`)
- [ ] Nach Domain-/Zone-Setup: Image Transformations aktivieren + `NEXT_PUBLIC_CF_IMAGE_RESIZING=true`
- [ ] 360°-Rundgang-Embed-URL in `content/site.ts` (`tourEmbedUrl`) eintragen
- [ ] Impressum & Datenschutz rechtlich prüfen und `[…]`-Platzhalter ergänzen
- [ ] Allergen-Legende (`content/menu.ts`) gegen die interne Kennzeichnung abgleichen
- [ ] Speisekarten-Preise final gegenprüfen
- [ ] Domain auf Cloudflare umstellen
```
