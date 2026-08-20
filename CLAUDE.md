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
Drei Jobs, die parallel laufen:

| Job            | Inhalt                                                  |
| -------------- | ------------------------------------------------------- |
| `quality`      | `npm run typecheck`, `npm run lint`, `npm run build`      |
| `worker-build` | `npm run cf-build` (OpenNext-Bundle für Cloudflare)       |
| `e2e`          | Playwright + axe (Accessibility), Report als Artefakt     |

Vor dem Push lokal absichern – das ist dasselbe, was `quality` prüft:

```bash
npm run typecheck && npm run lint && npm run build
```

Ein PR wird erst zum Mergen vorgeschlagen, wenn alle drei Jobs grün sind.

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
