import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next 16 liefert fertige Flat-Configs (Arrays) – direkt
// einspreizen statt über FlatCompat (das mit v16 einen zirkulären
// JSON-Fehler wirft).
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "node_modules/**",
      "app/fonts/**",
      "next-env.d.ts",
      "cloudflare-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Deutsche Typografie-Anführungszeichen im JSX-Text sind gewollt.
      "react/no-unescaped-entities": "off",
      // Neu in eslint-plugin-react-hooks v6 (via eslint-config-next 16).
      // Unsere setState-in-Effect-Stellen initialisieren Zustand aus rein
      // clientseitigen Quellen (window/scroll, document.readyState,
      // sessionStorage, navigator.standalone, IntersectionObserver-Fallback).
      // Das MUSS im Effect passieren – während Render/SSR sind diese Werte
      // nicht verfügbar, ein direkter Initialwert erzeugte Hydration-Mismatches.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
