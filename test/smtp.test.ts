import { describe, it, expect } from "vitest";
import { buildMessage } from "@/lib/smtp";

/** Fester Zeitpunkt, damit der Date-Header exakt prüfbar ist. */
const NOW = new Date(Date.UTC(2026, 9, 8, 7, 5, 3)); // 8. Okt 2026, 07:05:03 UTC

const base = {
  host: "mail.example.net",
  port: 587,
  username: "info@lsc-restaurant.de",
  password: "geheim",
  from: { name: "LSC Restaurant", email: "info@lsc-restaurant.de" },
  to: { email: "info@lsc-restaurant.de" },
  subject: "Allgemeine Anfrage von Mario",
  text: "Hallo,\nkurze Frage zur Terrasse.\n",
};

function headers(msg: string): string {
  return msg.split("\r\n\r\n")[0];
}

describe("buildMessage – Pflicht-Header (RFC 5322)", () => {
  it("setzt Date in UTC mit numerischer Zone statt 'GMT'", () => {
    const h = headers(buildMessage(base, NOW));
    expect(h).toContain("Date: Thu, 08 Oct 2026 07:05:03 +0000");
  });

  it("setzt eine Message-ID in der Absenderdomain", () => {
    const h = headers(buildMessage(base, NOW));
    const line = h.split("\r\n").find((l) => l.startsWith("Message-ID: "));
    expect(line).toBeDefined();
    expect(line).toMatch(/^Message-ID: <[^<>@\s]+@lsc-restaurant\.de>$/);
  });

  it("vergibt für zwei Nachrichten unterschiedliche Message-IDs", () => {
    const id = (m: string) =>
      m.split("\r\n").find((l) => l.startsWith("Message-ID: "));
    expect(id(buildMessage(base, NOW))).not.toBe(id(buildMessage(base, NOW)));
  });

  it("enthält From, To und MIME-Version", () => {
    const h = headers(buildMessage(base, NOW));
    expect(h).toContain("From: LSC Restaurant <info@lsc-restaurant.de>");
    expect(h).toContain("To: <info@lsc-restaurant.de>");
    expect(h).toContain("MIME-Version: 1.0");
  });

  it("Reply-To nur, wenn gesetzt", () => {
    expect(headers(buildMessage(base, NOW))).not.toContain("Reply-To:");
    const withReply = headers(
      buildMessage(
        { ...base, replyTo: { name: "Mario Rossi", email: "m@example.com" } },
        NOW
      )
    );
    expect(withReply).toContain("Reply-To: Mario Rossi <m@example.com>");
  });
});

describe("buildMessage – Kodierung", () => {
  it("kodiert Umlaute im Betreff als MIME encoded-word", () => {
    const h = headers(
      buildMessage({ ...base, subject: "Grüße aus Friedrichshafen" }, NOW)
    );
    const line = h.split("\r\n").find((l) => l.startsWith("Subject: "))!;
    expect(line).toMatch(/^Subject: =\?UTF-8\?B\?[A-Za-z0-9+/=]+\?=$/);
    // Rohe Umlaute dürfen nicht im Header stehen.
    expect(line).not.toContain("ü");
  });

  it("lässt reinen ASCII-Betreff unverändert", () => {
    const h = headers(buildMessage(base, NOW));
    expect(h).toContain("Subject: Allgemeine Anfrage von Mario");
  });

  it("überträgt den Text base64-kodiert und wieder dekodierbar", () => {
    const msg = buildMessage({ ...base, text: "Zwei Zeilen\nmit Grüßen" }, NOW);
    const h = headers(msg);
    expect(h).toContain('Content-Type: text/plain; charset="utf-8"');
    expect(h).toContain("Content-Transfer-Encoding: base64");

    const body = msg.split("\r\n\r\n").slice(1).join("\r\n\r\n");
    const decoded = Buffer.from(body.replace(/\r\n/g, ""), "base64").toString(
      "utf8"
    );
    expect(decoded).toBe("Zwei Zeilen\r\nmit Grüßen");
  });

  it("bricht lange base64-Zeilen auf höchstens 76 Zeichen um", () => {
    const msg = buildMessage({ ...base, text: "x".repeat(5000) }, NOW);
    const body = msg.split("\r\n\r\n").slice(1).join("\r\n\r\n");
    for (const line of body.split("\r\n")) {
      expect(line.length).toBeLessThanOrEqual(76);
    }
  });
});

describe("buildMessage – Anhänge", () => {
  it("ohne Anhang: kein multipart", () => {
    expect(headers(buildMessage(base, NOW))).not.toContain("multipart/mixed");
  });

  it("mit Anhang: multipart mit passender Boundary und Dateiname", () => {
    const msg = buildMessage(
      {
        ...base,
        attachments: [
          {
            filename: "lebenslauf.pdf",
            content: Buffer.from("PDF").toString("base64"),
            mimeType: "application/pdf",
          },
        ],
      },
      NOW
    );
    const boundary = headers(msg).match(/boundary="([^"]+)"/)?.[1];
    expect(boundary).toBeTruthy();
    expect(msg).toContain(`--${boundary}`);
    expect(msg).toContain(`--${boundary}--`);
    expect(msg).toContain(
      'Content-Disposition: attachment; filename="lebenslauf.pdf"'
    );
    expect(msg).toContain("Content-Type: application/pdf");
  });
});
