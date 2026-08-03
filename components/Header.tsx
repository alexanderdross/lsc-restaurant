"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/nav";
import { site } from "@/content/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü bei Routenwechsel schließen + Body-Scroll sperren
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-espresso/95 shadow-lg shadow-black/30 backdrop-blur"
          : "bg-espresso"
      }`}
    >
      {/* Top-Bar – kollabiert beim Scrollen (Shrink-on-Scroll) */}
      <div
        className={`overflow-hidden border-b bg-espresso transition-all duration-300 motion-reduce:transition-none ${
          scrolled
            ? "max-h-0 border-transparent opacity-0"
            : "max-h-12 border-cream/10 opacity-100"
        }`}
      >
        <div className="container-lsc flex items-center justify-center gap-2 py-1.5 text-center text-sm text-cream-dim">
          <span>Jetzt anrufen!</span>
          <a
            href={site.phone.href}
            className="font-semibold text-cream underline decoration-rose/60 underline-offset-4 hover:text-rose"
          >
            {site.phone.display}
          </a>
        </div>
      </div>

      {/* Haupt-Navigation */}
      <div
        className={`container-lsc flex items-center justify-between gap-4 transition-all duration-300 motion-reduce:transition-none ${
          scrolled ? "py-1.5" : "py-3"
        }`}
      >
        <Link
          href="/"
          aria-label={`${site.name} – Startseite`}
          title={`${site.name} – Startseite am Bodensee-Airport`}
          className="shrink-0"
        >
          <Image
            src="/logo-sm.webp"
            alt={site.name}
            width={360}
            height={202}
            priority
            sizes="140px"
            className={`w-auto transition-all duration-300 motion-reduce:transition-none ${
              scrolled ? "h-9 sm:h-10" : "h-12 sm:h-14"
            }`}
          />
        </Link>

        {/* Desktop-Nav */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden items-center gap-1 xl:flex"
        >
          {mainNav.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title}
                className="rounded-full px-3 py-2 text-sm font-medium text-cream/85 transition-colors hover:text-rose"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                title={item.title}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-rose ${
                  isActive(item.href) ? "text-rose" : "text-cream/85"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <a
            href={site.phone.href}
            title="Jetzt im LSC Restaurant anrufen"
            className="btn btn-primary ml-2 !py-2.5"
          >
            Jetzt anrufen
          </a>
        </nav>

        {/* Burger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full text-cream xl:hidden"
        >
          <span className="sr-only">Menü</span>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>
    </header>

      {/* Mobile-Overlay – bewusst AUSSERHALB von <header>: der Header bekommt
          beim Scrollen backdrop-blur, was ihn zum Containing Block für
          position:fixed-Nachfahren machen würde. Als Geschwister-Element bleibt
          das Overlay am Viewport fixiert und deckt voll ab. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 top-0 z-40 flex flex-col bg-espresso/98 backdrop-blur transition-opacity duration-300 xl:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile Navigation"
          className="container-lsc flex flex-1 flex-col justify-center gap-1 pt-24 pb-10"
        >
          {mainNav.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title}
                className="border-b border-cream/10 py-4 font-serif text-2xl text-cream"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                title={item.title}
                className={`border-b border-cream/10 py-4 font-serif text-2xl ${
                  isActive(item.href) ? "text-rose" : "text-cream"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <a
            href={site.phone.href}
            title="Jetzt im LSC Restaurant anrufen"
            className="btn btn-primary mt-8 self-start text-base"
          >
            Jetzt anrufen
          </a>
        </nav>
      </div>
    </>
  );
}
