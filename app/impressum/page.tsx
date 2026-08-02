import PageHero from "@/components/PageHero";
import Prose from "@/components/Prose";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Impressum",
  description: "Impressum des LSC Restaurants am Bodensee-Airport Friedrichshafen.",
  path: "/impressum",
});

export default function ImpressumPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Impressum", path: "/impressum" },
        ]}
      />
      <PageHero title="Impressum" />
      <section className="bg-cocoa">
        <div className="container-lsc py-16 md:py-20">
          <Prose>
            <h2>Angaben gemäß § 5 DDG</h2>
            <p>
              <strong>{site.name}</strong>
              <br />
              Inhaber: {site.owner.replace(" & Team", "")}
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </p>

            <h2>Kontakt</h2>
            <p>
              Telefon:{" "}
              <a href={site.phone.href}>{site.phone.intl}</a>
              <br />
              E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>

            <h2>Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              <br />
              <strong>DE347848928</strong>
            </p>

            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              {site.owner.replace(" & Team", "")}
              <br />
              {site.address.street}, {site.address.zip} {site.address.city}
            </p>

            <h2>EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr/
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>

            <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>

            <h2>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
              auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
              §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen oder
              nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>

            <h2>Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren
              Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
              Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
              verantwortlich.
            </p>

            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
              Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als
              solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung
              und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
              bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw.
              Erstellers.
            </p>

            <p className="mt-10 text-sm italic">
              Hinweis: Bitte lassen Sie das Impressum vor Veröffentlichung rechtlich
              prüfen.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
