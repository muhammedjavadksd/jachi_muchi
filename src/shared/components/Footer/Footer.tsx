import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/shared/components/Container/Container";
import { FOOTER_LINKS } from "@/features/account/constants";
import type { FooterLink } from "@/shared/types";

const FOOTER_BACKGROUND = "#0c1018";
const COPYRIGHT_TEXT = "© 2026 Jachi & Muchi";
const FOOTER_LINK_CLASSES = "text-gray-300 text-sm hover:text-white transition-colors";
const INSTAGRAM_URL = "https://www.instagram.com/jachiandmuchi?stkn=MWQyMmdtanluYzFjNg%3D%3D&utm_source=qr";

/** Bottom-bar legal links for quick access to the key policies */
const FOOTER_BOTTOM_LINKS: FooterLink[] = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

/**
 * Footer component with navigation columns, copyright bar, legal links, and
 * social icons. Dark themed footer matching the brand design.
 * Memoized as the content is static.
 */
export const Footer = memo(function Footer(): JSX.Element {
  /** Memoize footer link columns */
  const linkColumns = useMemo(() =>
    FOOTER_LINKS.map((column, index) => (
      <div key={index}>
        <h3 className="text-white font-semibold text-base mb-4">{column.title}</h3>
        <ul className="flex flex-col gap-2.5">
          {column.links.map((link, linkIndex) => {
            const isInternal = link.href.startsWith("/") && !link.href.startsWith("//");
            return (
              <li key={linkIndex}>
                {isInternal ? (
                  <Link to={link.href} className={FOOTER_LINK_CLASSES}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className={FOOTER_LINK_CLASSES}>
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ))
  , []);

  /** Memoize bottom-bar legal links */
  const bottomBarLinks = useMemo(() =>
    FOOTER_BOTTOM_LINKS.map((link) => {
      const isInternal = link.href.startsWith("/") && !link.href.startsWith("//");
      return isInternal ? (
        <Link key={link.href} to={link.href} className={FOOTER_LINK_CLASSES}>
          {link.label}
        </Link>
      ) : (
        <a key={link.href} href={link.href} className={FOOTER_LINK_CLASSES}>
          {link.label}
        </a>
      );
    })
  , []);

  return (
    <footer
      className="w-full"
      style={{ backgroundColor: FOOTER_BACKGROUND }}
    >
      {/* Navigation Columns */}
      <Container>
        <div className="pt-9 sm:pt-10 pb-8">
          <nav aria-label="Footer links">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {linkColumns}
            </div>
          </nav>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 py-4 sm:py-5">
            {/* Copyright and Legal Links */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <p className="text-gray-300 text-sm">{COPYRIGHT_TEXT}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                {bottomBarLinks}
              </div>
            </div>

            {/* Social Icons — right padding keeps the fixed WhatsApp button clear */}
            <div className="flex items-center gap-4 md:pr-24">
              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";