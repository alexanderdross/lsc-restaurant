# LSC Restaurant | Pizzeria – Website

Moderner Relaunch der Website des **LSC Restaurants** am Bodensee-Airport
Friedrichshafen. Gebaut mit **Next.js (App Router)** und deployt auf
**Cloudflare Workers** über **Cloudflare Workers Builds** – mit der warmen
Braun-Rosé-Markenwelt in einem aufgefrischten, mobiloptimierten Design.

## Tech-Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **@opennextjs/cloudflare** – Adapter für Cloudflare Workers
- **Tailwind CSS v4** – Design-Tokens als CSS-Variablen (dunkles Braun-Rosé-Theme)
- **next/font/local** – vollständig self-hosted Variable Fonts (Fraunces, Inter,
  Dancing Script als `woff2` in `app/fonts/`), `font-display: swap`, keine
  Google-Abhängigkeit (Build + Runtime)
- **Kontaktformular** (Anfragen & Bewerbungen) – Server Actions + eigener
  SMTP-Client (`lib/smtp.ts`, `cloudflare:sockets`, STARTTLS) an **netcup**,
  geschützt durch Cloudflare Turnstile

## Projektstruktur

```
app/
  layout.tsx              # Fonts, Header, Footer, Metadata
  page.tsx                # Startseite
  kontakt/                # Anfahrt, Zeiten, FAQ (Reservierung nur telefonisch)
  speisekarte/            # Speisekarte
  mittagstisch/           # Mittagstisch
  saisonkarte/            # Saisonkarte
  allergene/              # Allergene & Zusatzstoffe
  rundgang/               # 360°-Rundgang (iframe-Einbindung)
  jobs/                   # Kontaktformular (Anfragen & Bewerbungen) + Karriere-Infos
  impressum/, datenschutz/
  offline/                # Fallback-Seite der PWA
  actions/mail.ts         # Server Action: sendMessage (Anfragen & Bewerbungen)
  llms.txt/               # Klartext-Zusammenfassung für generative Engines (GEO)
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
- **Kampagne „Selbstabholung" (Claim, Argumente, Ablauf):** `site.takeaway` in
  `content/site.ts` – speist Startseiten-Band, Karten-Hinweis, FAQ, JSON-LD und
  `/llms.txt`
- **Navigation:** `content/nav.ts`

Änderungen committen und pushen – Cloudflare Workers Builds deployt automatisch.

## Deployment: Cloudflare Workers Builds

1. In Cloudflare: **Workers & Pages → Create → Workers** und das GitHub-Repository
   verbinden (Branch wählen).
2. Build-Einstellungen:
   - **Build command:** `npm run cf-build`
   - **Deploy command:** `npx wrangler deploy`
   - (Alternativ lokal: `npm run deploy`)
3. `wrangler.jsonc` ist bereits konfiguriert (`nodejs_compat`, aktuelles
   `compatibility_date`, Assets-Binding).
4. **Custom Domain** `www.lsc-restaurant.de` dem Worker zuordnen (DNS in
   Cloudflare umstellen).

### SMTP-Secrets (netcup) hinterlegen

Die Zugangsdaten werden **nicht** im Code gespeichert, sondern als
Worker-Secrets. Im Dashboard unter **Workers & Pages → `lsc-restaurant` →
Settings → Variables and Secrets → Add**, jeweils mit Type `Secret`:

| Variable    | Inhalt                                              |
| ----------- | --------------------------------------------------- |
| `SMTP_HOST` | z. B. `mail.your-netcup-server.de`                  |
| `SMTP_PORT` | `587` (STARTTLS) oder `465` (SSL)                   |
| `SMTP_USER` | netcup-Postfach, z. B. `info@lsc-restaurant.de`     |
| `SMTP_PASS` | Postfach-Passwort                                   |
| `MAIL_FROM` | Absender (echte netcup-Postfachadresse)             |
| `MAIL_TO`   | Empfänger, z. B. `info@lsc-restaurant.de`           |

Nicht mit den **Build**-Variablen verwechseln: Der Block dort heißt genauso,
wirkt aber nur zur Bauzeit. Secrets gehören in die Laufzeit-Variablen.

(Von einem Rechner mit Wrangler alternativ: `npx wrangler secret put <NAME>`.)

> Hinweis: Für zuverlässige Zustellung SPF/DKIM der Domain bei netcup einrichten.

## Technische Notiz: `cloudflare:sockets`

Der SMTP-Versand nutzt das Runtime-Modul `cloudflare:sockets`. Da OpenNext dieses
Schema im esbuild-Schritt nicht automatisch externalisiert, ergänzt das
Postinstall-Skript `scripts/patch-opennext.mjs` die esbuild-`external`-Liste. Das
Skript ist idempotent und läuft automatisch nach `npm install` (auch in
Cloudflare Workers Builds).

## Formular-Schutz (Cloudflare Turnstile)

Das Kontaktformular (`/jobs`) ist mit **Cloudflare Turnstile**
geschützt. Der Widget-Slot ist CLS-optimiert (reservierter Platz, kein
Layout-Shift beim Nachladen). Serverseitig wird das Token in `app/actions/mail.ts`
gegen die siteverify-API geprüft.

**Status: eingerichtet.** Widget, Site-Key und Secret-Key sind gesetzt, das
Widget wird auf `/jobs` ausgeliefert. Die folgende Anleitung ist die Referenz
zum Nachvollziehen – etwa wenn der Worker neu angelegt oder die Domain
gewechselt wird.

Alles Nötige wird im **Cloudflare-Dashboard** eingerichtet – eine lokale
Wrangler-Installation braucht es dafür nicht.

### 1. Widget anlegen

Dashboard → **Turnstile** → **Add widget**:

- **Widget name**: `lsc-restaurant`
- **Widget mode**: `Managed`
- **Hostname management**: diese zwei Einträge genügen, weil Turnstile
  Subdomains automatisch mit abdeckt:
  - `dross-media.workers.dev` – deckt `lsc-restaurant.dross-media.workers.dev`
    und alle Preview-Versionen ab
  - `lsc-restaurant.de` – deckt auch `www.lsc-restaurant.de` ab

Nach **Create** werden **Site-Key** und **Secret-Key** angezeigt. Beide
brauchst du im nächsten Schritt; der Secret-Key ist später nicht mehr im
Klartext einsehbar.

(Nur für lokale Entwicklung zusätzlich `localhost` und `127.0.0.1` eintragen.)

### 2. Site-Key als Build-Variable

Dashboard → **Workers & Pages** → `lsc-restaurant` → **Settings** → **Build**
→ **Build Variables and Secrets** → Variable hinzufügen:

| Name                             | Wert                |
| -------------------------------- | ------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | der Site-Key        |

Der Site-Key wird zur **Bauzeit** ins Frontend eingebettet. Es muss danach also
ein **neuer Build** laufen – am sichersten durch einen Push auf `main`; ein
erneut ausgeführter Build aus der Build-Historie tut es ebenfalls. Ein reiner
Redeploy ohne Build reicht nicht.

Wichtig: Build-Variablen sind zur Laufzeit **nicht** verfügbar – der Secret-Key
gehört deshalb nicht hierhin, sondern in Schritt 3.

### 3. Secret-Key als Worker-Secret

Dashboard → **Workers & Pages** → `lsc-restaurant` → **Settings** →
**Variables and Secrets** → **Add**:

| Type     | Variable name          | Value          |
| -------- | ---------------------- | -------------- |
| `Secret` | `TURNSTILE_SECRET_KEY` | der Secret-Key |

Dann **Deploy**. Dieses Secret liest `app/actions/mail.ts` zur Laufzeit.

(Alternativ von einem Rechner mit Wrangler:
`npx wrangler secret put TURNSTILE_SECRET_KEY`.)

### 4. Prüfen

Auf `/jobs` muss statt des grauen Kastens „Sicherheitsprüfung" das
Turnstile-Widget erscheinen. Tut es das nicht, fehlt der Site-Key oder es lief
seitdem kein neuer Build.

### Verhalten ohne Schlüssel

Solange keine Schlüssel gesetzt sind, bleibt der Platzhalter
„Sicherheitsprüfung" sichtbar und die serverseitige Prüfung wird übersprungen –
das Formular funktioniert, ist aber **ungeschützt**. Fehlt später nur das
Secret (z. B. nach einem Worker-Neuanlegen), fällt das nicht auf: Der Versand
klappt weiterhin, die Bot-Abwehr ist aber still deaktiviert.

Lokale Entwicklung: Site-Key in `.env.local` (siehe `.env.example`),
Secret in `.dev.vars` (siehe `.dev.vars.example`).

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
- [x] Turnstile-Widget anlegen und beide Schlüssel setzen (siehe „Formular-Schutz") –
      Site-Key im Bundle verifiziert, Widget rendert; das Secret bestätigt sich
      beim ersten erfolgreichen Testversand
- [ ] Nach Domain-/Zone-Setup: Image Transformations aktivieren + `NEXT_PUBLIC_CF_IMAGE_RESIZING=true`
- [x] 360°-Rundgang-Embed-URL in `content/site.ts` (`tourEmbedUrl`) eingetragen
- [ ] Impressum & Datenschutz rechtlich prüfen und `[…]`-Platzhalter ergänzen
- [ ] Allergen-Legende (`content/menu.ts`) gegen die interne Kennzeichnung abgleichen
- [ ] Speisekarten-Preise final gegenprüfen
- [ ] Domain auf Cloudflare umstellen
```
