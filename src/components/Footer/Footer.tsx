import { memo, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container } from "../Container/Container";
import { FOOTER_LINKS } from "../../lib/constants";

interface FooterAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FooterAccordion = memo(function FooterAccordion({
  title,
  children,
  defaultOpen = false
}: FooterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-800 last:border-b-0 lg:border-b-0">
      {/* Mobile Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 lg:py-0 text-left lg:cursor-default"
        aria-expanded={isOpen}
      >
        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
          {title}
        </h3>
        {/* Chevron icon - only visible on mobile */}
        <span className={`lg:hidden transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </span>
      </button>
      
      {/* Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0 lg:max-h-none lg:pb-0 pb-0'}`}>
        <ul className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
          {children}
        </ul>
      </div>
    </div>
  );
});

/**
 * Footer component with company info, navigation links, and social icons
 * Dark themed footer matching the brand design
 * Mobile: Accordion sections, stacked layout
 * Desktop: Multi-column grid layout
 * Memoized as content is static
 */
export const Footer = memo(function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  /** Memoize footer link columns */
  const linkColumns = useMemo(() => (
    FOOTER_LINKS.map((column) => (
      <div key={column.title} className="lg:min-w-[160px]">
        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 lg:mb-5">
          {column.title}
        </h3>
        <ul className="flex flex-col gap-2 sm:gap-3 lg:gap-3">
          {column.links.map((link, linkIndex) => {
            const isInternal = link.href.startsWith("/") && !link.href.startsWith("//");
            return (
              <li key={linkIndex}>
                {isInternal ? (
                  <Link
                    to={link.href}
                    className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors inline-block"
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
    <footer className="w-full bg-[#0c1018] mt-auto">
      {/* Main Footer Content */}
      <Container>
        <div className="py-8 sm:py-10 md:py-12 lg:py-14">
          {/* Company Description - Desktop Only */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-white font-semibold text-xl mb-4">
              Buy Eyewear from Lenskart
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              LENSKART SOLUTIONS LIMITED is a technology-driven eyewear company, with a belief that clear vision is fundamental to personal development and well-being. Our aim is to build tech-enabled supply and distribution solutions that improve access to affordable and quality Eyewear for All.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We sell a wide range of eyewear products including prescription eyeglasses, sunglasses, and other products such as contact lenses and eyewear accessories.
            </p>
          </div>

          {/* Mobile: Accordion Layout | Desktop: Grid Layout */}
          <div className="lg:flex lg:flex-wrap lg:gap-8 xl:gap-12">
            {/* Mobile Accordion Sections */}
            <div className="lg:hidden">
              {FOOTER_LINKS.map((column, index) => (
                <FooterAccordion key={column.title} title={column.title} defaultOpen={index === 0}>
                  {column.links.map((link, linkIndex) => {
                    const isInternal = link.href.startsWith("/") && !link.href.startsWith("//");
                    return (
                      <li key={linkIndex}>
                        {isInternal ? (
                          <Link
                            to={link.href}
                            className="text-gray-400 text-sm hover:text-white transition-colors inline-block py-1"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            className="text-gray-400 text-sm hover:text-white transition-colors inline-block py-1"
                          >
                            {link.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </FooterAccordion>
              ))}
            </div>

            {/* Desktop Grid Layout */}
            <div className="hidden lg:flex lg:flex-wrap lg:gap-8 xl:gap-12">
              {linkColumns}
            </div>

            {/* Additional Links Section - Desktop Only */}
            <div className="hidden lg:flex lg:flex-col lg:items-end lg:ml-auto lg:min-w-[200px]">
              <div className="flex flex-col gap-3">
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
            </div>
          </div>

          {/* Mobile Quick Links */}
          <div className="lg:hidden mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link to="/about" className="text-gray-400 text-xs hover:text-white transition-colors">
                About Us
              </Link>
              <a href="/blog" className="text-gray-400 text-xs hover:text-white transition-colors">
                Blog
              </a>
              <Link to="/support" className="text-gray-400 text-xs hover:text-white transition-colors">
                Support
              </Link>
              <Link to="/contact" className="text-gray-400 text-xs hover:text-white transition-colors">
                Contact Us
              </Link>
              <a href="/franchise" className="text-gray-400 text-xs hover:text-white transition-colors">
                Franchise
              </a>
              <a href="/bulk-orders" className="text-gray-400 text-xs hover:text-white transition-colors">
                Bulk Orders
              </a>
            </div>
          </div>

          {/* Download App Section - Mobile */}
          <div className="lg:hidden mt-6 pt-6 border-t border-gray-800">
            <p className="text-white font-semibold text-sm mb-3">Download App</p>
            <div className="flex gap-3">
              <a href="/app-store" className="block">
                <img 
                  src="https://static.lenskart.com/images/discount-procode-download-app/app-store-logo.svg" 
                  alt="Download on App Store"
                  className="h-10"
                />
              </a>
              <a href="/play-store" className="block">
                <img 
                  src="https://static.lenskart.com/images/discount-procode-download-app/play-store-logo.png" 
                  alt="Get it on Play Store"
                  className="h-10"
                />
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <Container>
          <div className="py-4 sm:py-5">
            {/* Mobile: Stacked | Desktop: Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              {/* Legal Links */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
                <a href="/terms" className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors">
                  T & C
                </a>
                <a href="/privacy" className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="/disclaimer" className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors">
                  Disclaimer
                </a>
                <a href="/cookies" className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors">
                  Cookies
                </a>
              </div>

              {/* Social Icons & Copyright */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                {/* Copyright */}
                <p className="text-gray-500 text-xs sm:text-sm">
                  © {currentYear} Lenskart
                </p>

                {/* Social Icons */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
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
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0c1018"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
