import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "@/shared/components";

const HEADER_SPACER_HEIGHT = 140;

/** WhatsApp support number – same as floating WhatsApp button */
const SUPPORT_WHATSAPP_URL = "https://wa.me/918447821891";
const SUPPORT_PHONE = "918447821891";
const SUPPORT_PHONE_DISPLAY = "84478 21891";

const QUICK_LINKS = [
  { label: "FAQs", href: "/faq", description: "Find answers to common questions" },
  { label: "Contact options", href: "/contact", description: "Email, phone, chat & more" },
  { label: "Refund policy", href: "/refund-policy", description: "Returns and refunds" },
  { label: "Shipping policy", href: "/shipping-policy", description: "Delivery and tracking" },
  { label: "Warranty", href: "/warranty", description: "Product warranty info" },
];

/**
 * Support page – quick help links and connect with customer support
 */
export const SupportPage = memo(function SupportPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <Container className="max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Page heading */}
          <section className="text-center space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-600">
              Support
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              How can we help you?
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Get answers from our FAQs or connect directly with our customer support team.
            </p>
          </section>

          {/* Connect with customer support – primary CTA */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-6 py-8 sm:px-10 sm:py-10 text-white text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Connect with customer support
              </h2>
              <p className="text-sm text-teal-100 max-w-xl">
                Chat with our team on WhatsApp for quick help with orders, products, or any question.
              </p>
            </div>
            <div className="px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start items-center">
              <a
                href={SUPPORT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 transition-colors shadow-sm"
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat with support on WhatsApp
              </a>
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 transition-colors"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {SUPPORT_PHONE_DISPLAY}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold py-3 px-6 transition-colors"
              >
                View all contact options
                <span aria-hidden>→</span>
              </Link>
            </div>
          </section>

          {/* Quick links */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Quick links</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-teal-200 hover:shadow-md transition-all group"
                  >
                    <span className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-500">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Support hours */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6 sm:px-8 sm:py-6">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Support hours</h2>
            <p className="text-sm text-gray-600">
              Our customer support team is available Monday – Sunday, 9:00 AM – 9:00 PM. Responses on WhatsApp are usually within a few minutes during these hours.
            </p>
          </section>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

SupportPage.displayName = "SupportPage";
