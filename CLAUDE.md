# Arbeitsweise in diesem Repo

## Änderungen immer per Pull Request

Nicht direkt nach `main` pushen. Der Ablauf ist:

1. Feature-Branch anlegen (`claude/<kurzbeschreibung>`).
2. Dort committen und pushen.
3. Pull Request gegen `main` öffnen.
4. Warten, bis die CI grün ist.
5. Den Merge macht **Alexander**, nicht der Agent.

Nachbesserungen zu einem offenen PR gehen als weiterer Commit auf denselben
Branch – kein zweiter PR.

## CI (`.github/workflows/ci.yml`)

Läuft automatisch bei jedem PR gegen `main` und bei jedem Push auf `main`.
Vier Jobs, die parallel laufen:

| Job            | Inhalt                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------- |
| `quality`      | `typecheck`, `lint`, `format:check`, `test:unit`, `build`, `check:bundle` (First-Load-Budget) |
| `worker-build` | `npm run cf-build` (OpenNext-Bundle für Cloudflare)                                            |
| `e2e`          | Playwright + axe (Accessibility), Desktop und Mobile, Report als Artefakt                      |
| `perf`         | Lighthouse CI (advisory) + Link-Check interner Links, Report als Artefakt                      |

Dazu kommt **Workers Builds** von Cloudflare als eigener Check – der baut und
deployt (bei `main`) bzw. erzeugt eine Preview-Version.

Vor dem Push lokal absichern – das deckt ab, woran `quality` scheitert:

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test:unit && npm run build
```

`format:check` nicht weglassen: Prettier-Abweichungen lassen den Job rot werden,
auch wenn Typecheck, Lint und Build sauber durchlaufen.

Ein PR wird erst zum Mergen vorgeschlagen, wenn alle Jobs grün sind.

## Konfiguration: Dashboard statt CLI

Alexander arbeitet ausschließlich in der GitHub-/Cloud-Umgebung, nicht lokal.
Anleitungen für Cloudflare deshalb immer über das **Dashboard** schreiben, nicht
über die Wrangler-CLI – `wrangler login` und `wrangler secret put` sind für ihn
kein gangbarer Weg. Beides geht im Dashboard:

- **Secrets** (Laufzeit, z. B. `TURNSTILE_SECRET_KEY`, SMTP):
  Workers & Pages → `lsc-restaurant` → Settings → Variables and Secrets
- **Build-Variablen** (Bauzeit, z. B. `NEXT_PUBLIC_TURNSTILE_SITE_KEY`):
  Workers & Pages → `lsc-restaurant` → Settings → Build →
  Build Variables and Secrets

Build-Variablen sind zur Laufzeit nicht verfügbar und umgekehrt. Alles mit
`NEXT_PUBLIC_`-Präfix wird zur Bauzeit eingebettet und braucht nach einer
Änderung einen neuen Build, keinen reinen Redeploy.

## Deployment

Cloudflare **Workers Builds** ist direkt mit dem GitHub-Repo verbunden und
deployt bei jedem Push auf `main` automatisch. Es gibt bewusst **keinen**
Deploy-Job in der CI – der würde bei jedem Merge doppelt bauen und deployen.

- Build-Befehl: `npm run cf-build`
- Bereitstellungsbefehl: `npx wrangler deploy`
- Production-Branch: `main`

Pushes auf andere Branches erzeugen nur Preview-Versionen ohne Traffic.

### Achtung: kein `limits`-Block in `wrangler.jsonc`

Das Konto läuft auf dem **Workers-Free-Plan**. Sobald `limits` in der
`wrangler.jsonc` steht, lehnt die Cloudflare-API das Anlegen der Version ab:

```
CPU limits are not supported for the Free plan. [code: 100328]
```

Der Build läuft dabei komplett durch und erst der Deploy-Schritt scheitert –
das ist leicht zu übersehen. Genau daran sind alle Deploys zwischen dem
03.08. und dem 20.08.2026 gescheitert. Erst nach einem Upgrade auf Workers
Paid darf `limits` zurück.

## Inhalte

Stammdaten stehen zentral in `content/site.ts` (Adresse, Öffnungszeiten,
Telefon, Zahlungshinweise, FAQ) und in `content/menu.ts` (Speise-, Saison-
und Mittagstischkarte). Von dort speisen sich Seiten, Footer, JSON-LD und
`/llms.txt` – Texte deshalb dort ändern, nicht in den Seiten.

Wiederkehrende Hinweisblöcke sind Komponenten und gehören auf alle drei
Karten (`/speisekarte`, `/mittagstisch`, `/saisonkarte`):

- `components/PaymentNote.tsx` – Kartenzahlung ab 20 € + Trinkgeld bitte bar
- `components/AllergeneNote.tsx` – Box mit Link auf `/allergene`
- `components/TakeawayNote.tsx` – Claim & CTA zur Selbstabholung

## Formulare

Es gibt genau **ein** Formular: das Kontaktformular auf `/jobs`
(`components/forms/ContactForm.tsx` → `sendMessage` in `app/actions/mail.ts`).
Es deckt allgemeine Anfragen und Bewerbungen ab – unterschieden über das Feld
„Anliegen" (`components/forms/topics.ts`), das den Betreff der E-Mail setzt.
Die E-Mail-Adresse auf `/kontakt` und im Footer verlinkt dorthin.

Reservierungen und Bestellungen laufen weiterhin **ausschließlich telefonisch** –
dafür gibt es bewusst kein Formular.

Achtung: `app/actions/mail.ts` ist mit `"use server"` markiert und darf nur
async Funktionen exportieren. Konstanten, die Client und Server teilen, gehören
in ein eigenes Modul (wie `topics.ts`).

Der Versand läuft über `lib/smtp.ts` direkt aus dem Worker (`cloudflare:sockets`,
STARTTLS) und braucht die SMTP-Secrets zur Laufzeit. Schlägt er fehl, sieht der
Gast nur eine allgemeine Meldung – der Grund steht im Worker-Log
(Workers & Pages → `lsc-restaurant` → Logs). Einrichtung und Fehlerbilder stehen
im README unter „E-Mail-Versand über netcup einrichten".

`buildMessage` aus `lib/smtp.ts` ist exportiert, damit die Mail-Header ohne
Netzwerk testbar sind (`test/smtp.test.ts`).

Das Kampagnen-Band zur Selbstabholung (`components/TakeawayBand.tsx`) steht auf
der Startseite unter dem Anker `#selbstabholung`. Claim, Argumente und Ablauf
liegen in `site.takeaway` – von dort speisen sich auch FAQ, JSON-LD und
`/llms.txt`.
