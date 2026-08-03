import { site } from "@/content/site";
import { speisekarte, mittagstisch } from "@/content/menu";

export const dynamic = "force-static";

/**
 * /llms.txt – kompakte, faktische Zusammenfassung für generative KI-Engines
 * (Generative Engine Optimization, GEO). Plain-Text-Markdown, damit LLMs die
 * Kern-Fakten (Was, Wo, Wann, Kontakt, Karten) verlässlich extrahieren können.
 */
export function GET(): Response {
  const url = site.url;
  const categories = speisekarte.map((c) => c.title).join(", ");
  const hours = site.hours.map((h) => `${h.day}: ${h.value}`).join("; ");

  const body = `# ${site.name}

> ${site.claim}. ${site.description}

## Auf einen Blick
- Art: Italienisches Restaurant & Pizzeria
- Küche: ${site.cuisine.join(", ")}
- Lage: ${site.address.landmark}, ${site.address.street}, ${site.address.zip} ${site.address.city} (${site.address.region})
- Koordinaten: ${site.address.geo.lat}, ${site.address.geo.lng}
- Öffnungszeiten: ${hours}
- Telefon: ${site.phone.intl}
- E-Mail: ${site.email}
- Zahlung: ${site.payment.methods.join(", ")} (${site.payment.note})
- Inhaber: ${site.owner}
- Ausstattung: ${site.amenities.join(", ")}
- Einzugsgebiet: ${site.areaServed.join(", ")}

## Seiten
- Startseite: ${url}/
- Kontakt (Reservierung/Bestellung nur telefonisch): ${url}/kontakt/
- Speisekarte (${categories}): ${url}/speisekarte/
- Mittagstisch (${mittagstisch.period}, ${mittagstisch.time}): ${url}/mittagstisch/
- Saisonkarte: ${url}/saisonkarte/
- Allergene & Zusatzstoffe: ${url}/allergene/
- 360° Rundgang: ${url}/rundgang/
- Jobs & Karriere: ${url}/jobs/
- Impressum: ${url}/impressum/
- Datenschutz: ${url}/datenschutz/

## Häufige Fragen
${site.faq.map((f) => `- ${f.q} ${f.a}`).join("\n")}

## Social
- Facebook: ${site.social.facebook}
- Instagram: ${site.social.instagram}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
