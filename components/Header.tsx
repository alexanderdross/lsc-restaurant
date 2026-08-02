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
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-espresso/95 shadow-lg shadow-black/30 backdrop-blur"
          : "bg-espresso"
      }`}
    >
      {/* Top-Bar */}
      <div className="border-b border-cream/10 bg-espresso">
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
      <div className="container-lsc flex items-center justify-between gap-4 py-3">
        <Link
          href="/"
          aria-label={`${site.name} – Startseite`}
          className="shrink-0"
        >
          <Image
            src="/logo.webp"
            alt={site.name}
            width={640}
            height={359}
            priority
            sizes="140px"
            className="h-12 w-auto sm:h-14"
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
                className="rounded-full px-3 py-2 text-sm font-medium text-cream/85 transition-colors hover:text-rose"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-rose ${
                  isActive(item.href) ? "text-rose" : "text-cream/85"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <Link href="/reservieren" className="btn btn-primary ml-2 !py-2.5">
            Tisch reservieren
          </Link>
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

      {/* Mobile-Overlay */}
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
                className="border-b border-cream/10 py-4 font-serif text-2xl text-cream"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b border-cream/10 py-4 font-serif text-2xl ${
                  isActive(item.href) ? "text-rose" : "text-cream"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href="/reservieren"
            className="btn btn-primary mt-8 self-start text-base"
          >
            Tisch reservieren
          </Link>
        </nav>
      </div>
    </header>
  );
}
