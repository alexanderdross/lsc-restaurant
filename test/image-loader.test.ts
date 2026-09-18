import { describe, it, expect, afterEach } from "vitest";
import loader from "@/image-loader";

const KEY = "NEXT_PUBLIC_CF_IMAGE_RESIZING";

afterEach(() => {
  delete process.env[KEY];
});

describe("cloudflareLoader", () => {
  it("externe URLs bleiben unverändert", () => {
    process.env[KEY] = "true";
    expect(loader({ src: "https://example.com/a.png", width: 100 })).toBe(
      "https://example.com/a.png"
    );
  });

  it("deaktiviert ⇒ Originalpfad", () => {
    delete process.env[KEY];
    expect(loader({ src: "/logo.png", width: 200, quality: 90 })).toBe(
      "/logo.png"
    );
  });

  it("aktiviert ⇒ /cdn-cgi/image mit width/quality/format", () => {
    process.env[KEY] = "true";
    expect(loader({ src: "/logo.png", width: 200, quality: 80 })).toBe(
      "/cdn-cgi/image/width=200,quality=80,format=auto/logo.png"
    );
  });

  it("aktiviert ⇒ Default-Quality 75 und führenden Slash ergänzen", () => {
    process.env[KEY] = "true";
    expect(loader({ src: "logo.png", width: 640 })).toBe(
      "/cdn-cgi/image/width=640,quality=75,format=auto/logo.png"
    );
  });
});
