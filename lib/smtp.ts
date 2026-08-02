/**
 * Minimaler SMTP-Client für die Cloudflare-Workers-Runtime.
 *
 * Nutzt das Runtime-Modul `cloudflare:sockets`. Der Import erfolgt bewusst über
 * einen zur Bauzeit nicht auflösbaren Spezifizierer (Array.join), damit der
 * Bundler (esbuild/webpack) ihn NICHT statisch auflöst, sondern als dynamischen
 * Runtime-Import stehen lässt – workerd stellt das Modul zur Laufzeit bereit.
 *
 * Unterstützt STARTTLS (Port 587) und implizites TLS (Port 465), AUTH LOGIN/PLAIN
 * sowie Anhänge (MIME multipart/mixed, base64).
 */

export type Address = { name?: string; email: string };
export type Attachment = {
  filename: string;
  /** Bereits base64-kodierter Inhalt. */
  content: string;
  mimeType?: string;
};

export type SendOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  from: Address;
  to: Address;
  replyTo?: Address;
  subject: string;
  text: string;
  attachments?: Attachment[];
};

// Minimal-Typen für den workerd-Socket (vermeidet Abhängigkeit von workers-types).
interface CfSocket {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  opened?: Promise<unknown>;
  startTls(): CfSocket;
  close(): Promise<void>;
}
type ConnectFn = (
  address: string | { hostname: string; port: number },
  options?: { secureTransport?: "off" | "on" | "starttls"; allowHalfOpen?: boolean }
) => CfSocket;

async function getConnect(): Promise<ConnectFn> {
  // Nicht statisch analysierbarer Spezifizierer -> bleibt Runtime-Import.
  const specifier = ["cloudflare", "sockets"].join(":");
  const mod = (await import(/* webpackIgnore: true */ specifier)) as {
    connect: ConnectFn;
  };
  return mod.connect;
}

const CRLF = "\r\n";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

class SmtpConnection {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private buffer = "";

  constructor(private socket: CfSocket) {
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
  }

  /** Reader/Writer nach STARTTLS-Upgrade neu anbinden. */
  rebind(socket: CfSocket) {
    this.socket = socket;
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
    this.buffer = "";
  }

  async write(line: string) {
    await this.writer.write(encoder.encode(line + CRLF));
  }

  async writeRaw(data: string) {
    await this.writer.write(encoder.encode(data));
  }

  /** Liest eine vollständige (ggf. mehrzeilige) SMTP-Antwort und prüft den Code. */
  async expect(...codes: number[]): Promise<string> {
    while (true) {
      const lines = this.buffer.split(CRLF);
      // Vollständige Antwort erkannt, wenn eine Zeile "NNN " (Space) enthält.
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (/^\d{3} /.test(l)) {
          const code = Number(l.slice(0, 3));
          const consumed = lines.slice(0, i + 1).join(CRLF).length + CRLF.length;
          this.buffer = this.buffer.slice(consumed);
          if (codes.length && !codes.includes(code)) {
            throw new Error(`SMTP: unerwartete Antwort ${code}: ${l}`);
          }
          return l;
        }
      }
      const { value, done } = await this.reader.read();
      if (done) throw new Error("SMTP: Verbindung unerwartet geschlossen.");
      this.buffer += decoder.decode(value, { stream: true });
    }
  }

  async close() {
    try {
      await this.writer.close();
    } catch {
      /* ignore */
    }
    try {
      await this.socket.close();
    } catch {
      /* ignore */
    }
  }
}

function b64(str: string): string {
  // btoa erwartet einen Binärstring (Latin1).
  return btoa(unescape(encodeURIComponent(str)));
}

function encodeWord(text: string): string {
  // MIME encoded-word für Nicht-ASCII (z. B. in Betreff/Anzeigenamen).
  // eslint-disable-next-line no-control-regex
  if (!/[^\x00-\x7F]/.test(text)) return text;
  return `=?UTF-8?B?${b64(text)}?=`;
}

function formatAddress(a: Address): string {
  return a.name ? `${encodeWord(a.name)} <${a.email}>` : `<${a.email}>`;
}

function chunk76(s: string): string {
  return s.replace(/.{1,76}/g, "$&" + CRLF).trimEnd();
}

function buildMessage(opts: SendOptions): string {
  const boundary = "lsc_" + b64(String(opts.subject.length) + opts.to.email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 24);
  const headers = [
    `From: ${formatAddress(opts.from)}`,
    `To: ${formatAddress(opts.to)}`,
    opts.replyTo ? `Reply-To: ${formatAddress(opts.replyTo)}` : "",
    `Subject: ${encodeWord(opts.subject)}`,
    "MIME-Version: 1.0",
  ].filter(Boolean);

  const hasAttachments = !!opts.attachments?.length;

  // Dot-Stuffing (Zeilen, die mit "." beginnen).
  const safeText = opts.text.replace(/\r?\n/g, CRLF);

  if (!hasAttachments) {
    headers.push('Content-Type: text/plain; charset="utf-8"');
    headers.push("Content-Transfer-Encoding: base64");
    return headers.join(CRLF) + CRLF + CRLF + chunk76(b64(safeText));
  }

  headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
  const parts: string[] = [];
  parts.push(`--${boundary}`);
  parts.push('Content-Type: text/plain; charset="utf-8"');
  parts.push("Content-Transfer-Encoding: base64");
  parts.push("");
  parts.push(chunk76(b64(safeText)));

  for (const att of opts.attachments!) {
    parts.push(`--${boundary}`);
    parts.push(`Content-Type: ${att.mimeType || "application/octet-stream"}; name="${att.filename}"`);
    parts.push("Content-Transfer-Encoding: base64");
    parts.push(`Content-Disposition: attachment; filename="${att.filename}"`);
    parts.push("");
    parts.push(chunk76(att.content.replace(/\s+/g, "")));
  }
  parts.push(`--${boundary}--`);

  return headers.join(CRLF) + CRLF + CRLF + parts.join(CRLF);
}

export async function sendSmtpMail(opts: SendOptions): Promise<void> {
  const connect = await getConnect();
  const implicitTls = opts.port === 465;

  let socket = connect(
    { hostname: opts.host, port: opts.port },
    { secureTransport: implicitTls ? "on" : "starttls", allowHalfOpen: false }
  );

  const conn = new SmtpConnection(socket);
  const ehloName = "lsc-restaurant.de";

  try {
    await conn.expect(220);
    await conn.write(`EHLO ${ehloName}`);
    await conn.expect(250);

    if (!implicitTls) {
      await conn.write("STARTTLS");
      await conn.expect(220);
      socket = socket.startTls();
      conn.rebind(socket);
      await conn.write(`EHLO ${ehloName}`);
      await conn.expect(250);
    }

    // AUTH LOGIN
    await conn.write("AUTH LOGIN");
    await conn.expect(334);
    await conn.write(b64(opts.username));
    await conn.expect(334);
    await conn.write(b64(opts.password));
    await conn.expect(235);

    await conn.write(`MAIL FROM:<${opts.from.email}>`);
    await conn.expect(250);
    await conn.write(`RCPT TO:<${opts.to.email}>`);
    await conn.expect(250, 251);
    await conn.write("DATA");
    await conn.expect(354);

    const message = buildMessage(opts).replace(/\r\n\./g, CRLF + "..");
    await conn.writeRaw(message + CRLF + "." + CRLF);
    await conn.expect(250);

    await conn.write("QUIT");
    // 221 ist optional – nicht zwingend abwarten.
  } finally {
    await conn.close();
  }
}
