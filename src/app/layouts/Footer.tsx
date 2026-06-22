import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/shared/components/Container/Container";
import { FOOTER_LINKS } from "@/features/account/constants";

/**
 * Footer component with company info, navigation links, and social icons
 * Dark themed footer matching the brand design
 * Memoized as content is static
 */
export const Footer = memo(function Footer(): JSX.Element {
  /** Memoize footer link columns */
  const linkColumns = useMemo(() => (
    FOOTER_LINKS.map((column, index) => (
      <div key={index}>
        <h3 className="text-white font-semibold text-lg mb-5">{column.title}</h3>
        <ul className="flex flex-col gap-3">
          {column.links.map((link, linkIndex) => {
            const isInternal = link.href.startsWith("/") && !link.href.startsWith("//");
            return (
              <li key={linkIndex}>
                {isInternal ? (
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ))
  ), []);

  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "#0c1018" }}
    >
      {/* Main Footer Content */}
      <Container>
        <div style={{ paddingTop: "48px", paddingBottom: "32px" }}>
          {/* Company Description */}
          <div className="mb-10">
            <h2 className="text-white font-semibold text-xl mb-4">
              Buy Eyewear from Jachi and Muchi
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              JACHI AND MUCHI SOLUTIONS LIMITED (Earlier known as Jachi and Muchi Solutions Private Limited) is a technology-driven eyewear company, with a belief that clear vision is fundamental to personal development and well-being. Our aim is to build tech-enabled supply and distribution solutions that improve access to affordable and quality Eyewear for All.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We sell a wide range of eyewear products including prescription eyeglasses, sunglasses, and other products such as contact lenses and eyewear accessories. Our brands are designed to be aspirational and appeal to a wide range of customer segments.
            </p>
          </div>

          {/* Links and App Download Section */}
          <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
            {/* Navigation Links */}
            <div className="flex flex-wrap gap-10 lg:gap-24">
              {linkColumns}
            </div>

            {/* Additional Links Section */}
            <div className="flex flex-col items-start lg:items-end gap-4 sm:gap-6">
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <Link to="/about" className="text-gray-400 text-sm hover:text-white transition-colors">
                  About Us
                </Link>
                <a href="/blog" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Blog
                </a>
                <Link to="/support" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Support
                </Link>
                <Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
                <a href="/sitemap" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Sitemap
                </a>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <a href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Terms
                </a>
                <a href="/franchise" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Franchise
                </a>
                <a href="/bulk-orders" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Bulk Orders
                </a>
                <a href="/investors" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Investors
                </a>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <a href="/press" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Press
                </a>
                <Link to="/warranty" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Warranty
                </Link>
                <a href="/return-policy" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Return Policy
                </a>
                <a href="/shipping-policy" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Shipping Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-5">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <a href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">
                T & C
              </a>
              <a href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/disclaimer" className="text-gray-400 text-sm hover:text-white transition-colors">
                Disclaimer
              </a>
              <a href="/cookies" className="text-gray-400 text-sm hover:text-white transition-colors">
                Cookies Settings
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
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
