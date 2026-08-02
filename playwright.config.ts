import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-/Accessibility-Tests. Startet die App via `next start` (nach `next build`)
 * und prüft Rendering, Formulare, CLS-Reservierung, Lazy-Loading und
 * WCAG-Verstöße (axe).
 *
 * Lokal: Browser kann via PW_CHROMIUM_PATH auf einen vorinstallierten Chromium
 * zeigen. In CI wird der passende Browser per `playwright install` bereitgestellt.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: process.env.PW_CHROMIUM_PATH || undefined,
          args: ["--no-sandbox"],
        },
      },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
