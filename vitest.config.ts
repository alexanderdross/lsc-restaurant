import { defineConfig } from "vitest/config";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Unit-Tests (reine Logik/Daten – ohne Browser). E2E/Accessibility laufen
 * weiterhin über Playwright (siehe playwright.config.ts).
 */
export default defineConfig({
  resolve: {
    // Gleiches "@"-Alias wie in tsconfig.json.
    alias: { "@": root },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
