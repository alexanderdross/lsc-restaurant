import PageHero from "@/components/PageHero";
import Prose from "@/components/Prose";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf der Website des LSC Restaurants.",
  path: "/datenschutz",
});

export default function DatenschutzPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Datenschutzerklärung", path: "/datenschutz" },
        ]}
      />
      <PageHero title="Datenschutzerklärung" />
      <section className="bg-cocoa">
        <div className="container-lsc py-16 md:py-20">
          <Prose>
            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              <br />
              <strong>{site.name}</strong>, {site.owner.replace(" & Team", "")}
              <br />
              {site.address.street}, {site.address.zip} {site.address.city}
              <br />
              Telefon: <a href={site.phone.href}>{site.phone.intl}</a>
              <br />
              E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>

            <h2>2. Allgemeines zur Datenverarbeitung</h2>
            <p>
              Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur,
              soweit dies zur Bereitstellung einer funktionsfähigen Website sowie
              unserer Inhalte und Leistungen erforderlich ist. Rechtsgrundlagen sind
              insbesondere Art. 6 Abs. 1 lit. a, b und f DSGVO.
            </p>

            <h2>3. Hosting</h2>
            <p>
              Diese Website wird bei Cloudflare (Cloudflare, Inc.) auf der
              Infrastruktur „Cloudflare Workers“ gehostet. Beim Aufruf der Website
              werden technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt des
              Zugriffs, aufgerufene Seite) verarbeitet, um die Auslieferung der
              Website und die Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6
              Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und
              effizienten Betrieb).
            </p>

            <h2>4. Server-Logfiles</h2>
            <p>
              Bei jedem Zugriff werden automatisch Informationen erhoben, die Ihr
              Browser übermittelt (u. a. Browsertyp/-version, Betriebssystem,
              Referrer-URL, Uhrzeit, IP-Adresse in gekürzter/anonymisierter Form).
              Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und
              dienen ausschließlich der technischen Bereitstellung und Sicherheit.
            </p>

            <h2>5. Kontakt- und Reservierungsformular</h2>
            <p>
              Wenn Sie uns über das Reservierungs- bzw. Kontaktformular kontaktieren,
              verarbeiten wir die von Ihnen angegebenen Daten (Name, E-Mail-Adresse,
              ggf. Telefonnummer, gewünschtes Datum, Personenzahl und Nachricht), um
              Ihre Anfrage zu bearbeiten. Die Übermittlung erfolgt per E-Mail an uns.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung/Erfüllung
              eines Vertragsverhältnisses) bzw. lit. f DSGVO (Bearbeitung Ihrer
              Anfrage). Die Daten werden gelöscht, sobald sie für die Bearbeitung
              nicht mehr erforderlich sind und keine gesetzlichen
              Aufbewahrungspflichten entgegenstehen.
            </p>

            <h2>6. Bewerbungen</h2>
            <p>
              Übermitteln Sie uns eine Bewerbung über das Jobs-Formular, verarbeiten
              wir die angegebenen Daten sowie ggf. hochgeladene Dokumente
              ausschließlich zur Durchführung des Bewerbungsverfahrens.
              Rechtsgrundlage ist § 26 BDSG i. V. m. Art. 6 Abs. 1 lit. b DSGVO. Im
              Falle einer Absage werden die Bewerberdaten spätestens nach sechs
              Monaten gelöscht, sofern Sie keiner längeren Speicherung zugestimmt
              haben.
            </p>

            <h2>7. Karten &amp; eingebettete Inhalte</h2>
            <p>
              Zur Darstellung unseres Standorts binden wir eine Karte von
              OpenStreetMap (OpenStreetMap Foundation) ein. Die Karte wird aus
              Datenschutz- und Performance-Gründen erst geladen, wenn sie in den
              sichtbaren Bereich gelangt. Beim Laden werden technisch notwendige
              Daten (u. a. Ihre IP-Adresse) an OpenStreetMap übermittelt; dabei
              werden keine Tracking-Cookies gesetzt. Rechtsgrundlage ist Art. 6
              Abs. 1 lit. f DSGVO. Weitere Informationen finden Sie in der{" "}
              <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer">
                Datenschutzerklärung der OpenStreetMap Foundation
              </a>
              .
            </p>
            <p>
              Auf der Seite „360° Rundgang" binden wir eine interaktive Panorama-Tour
              unseres Dienstleisters (vr-easy) ein. Die Tour wird aus Datenschutz- und
              Performance-Gründen erst geladen, wenn sie in den sichtbaren Bereich
              gelangt. Beim Laden können dabei technische Daten (u. a. IP-Adresse) an
              den Anbieter übermittelt werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
              DSGVO.
            </p>

            <h2>8. Spam-/Bot-Schutz (Cloudflare Turnstile)</h2>
            <p>
              Zum Schutz unserer Formulare vor missbräuchlicher automatisierter
              Nutzung setzen wir „Cloudflare Turnstile" (Cloudflare, Inc.) ein. Dabei
              werden technische Informationen (u. a. IP-Adresse, Browser-Merkmale) an
              Cloudflare übermittelt und verarbeitet, um menschliche von
              automatisierten Anfragen zu unterscheiden. Turnstile setzt nach Angaben
              des Anbieters keine Cookies zu Werbezwecken. Rechtsgrundlage ist Art. 6
              Abs. 1 lit. f DSGVO (berechtigtes Interesse an Spam-/Missbrauchsschutz).
            </p>

            <h2>9. Cookies &amp; Tracking</h2>
            <p>
              Diese Website setzt keine Tracking- oder Marketing-Cookies und bindet
              keine Analyse-Dienste ein. Es werden ausschließlich technisch notwendige
              Daten verarbeitet.
            </p>

            <h2>10. Ihre Rechte</h2>
            <p>Ihnen stehen gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten zu:</p>
            <ul>
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
              <li>Recht auf Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p>
              Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
              zu beschweren (Art. 77 DSGVO).
            </p>

            <p className="mt-10 text-sm italic">
              Hinweis: Diese Datenschutzerklärung ist eine an das Projekt angepasste
              Vorlage. Bitte prüfen und ergänzen Sie sie vor Veröffentlichung (z. B.
              konkrete Hosting-/Auftragsverarbeitungs-Angaben) und lassen Sie sie
              rechtlich abnehmen.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
