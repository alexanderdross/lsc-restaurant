import type { Metadata } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

// Vollständig self-hosted Variable Fonts (woff2 im Repo unter app/fonts/).
// Keine Abhängigkeit zu Google Fonts – weder beim Build noch zur Laufzeit.
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/fraunces-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const inter = localFont({
  src: [{ path: "./fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const script = localFont({
  src: [{ path: "./fonts/dancing-script-latin-wght-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-script",
  display: "swap",
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – ${site.claim}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "LSC Restaurant",
    "Pizzeria Friedrichshafen",
    "Restaurant Bodensee Airport",
    "Italienisch Friedrichshafen",
    "Pizza Friedrichshafen",
    "Restaurant Flughafen Friedrichshafen",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: site.url,
    siteName: site.name,
    title: `${site.name} – ${site.claim}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${inter.variable} ${script.variable}`}
    >
      <body>
        {/* Aktiviert JS-abhängige Effekte (Scroll-Reveal) erst, wenn JS läuft –
            ohne JS bleibt der Inhalt vollständig sichtbar. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-rose focus:px-4 focus:py-2 focus:text-espresso"
        >
          Zum Inhalt springen
        </a>
        <Header />
        <main id="inhalt">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
