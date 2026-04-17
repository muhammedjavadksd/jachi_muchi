import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

/**
 * Terms of Service page
 */
export const TermsPage = memo(function TermsPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-6 md:py-10 lg:py-12">
        <Container className="max-w-2xl lg:max-w-3xl">
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Last updated: February 2025</p>
          </header>

          <div className="space-y-8 sm:space-y-10 text-gray-700">
            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">1. Acceptance of Terms</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. 
                If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">2. Use of Service</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                You may use our website and services only for lawful purposes and in accordance with these Terms. 
                You agree not to use the service to violate any applicable laws, infringe on the rights of others, 
                or transmit any harmful or malicious content.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">3. Account and Registration</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                When you create an account with us, you must provide accurate and complete information. 
                You are responsible for safeguarding your password and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">4. Products and Orders</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We reserve the right to limit quantities, discontinue products, or modify product offerings at any time. 
                All orders are subject to acceptance and availability. We may refuse or cancel any order for any reason.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">5. Intellectual Property</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                All content on this website, including text, graphics, logos, and images, is the property of our company 
                or its content suppliers and is protected by intellectual property laws. You may not reproduce or use 
                such content without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">6. Limitation of Liability</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising out of or related to your use of our service.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">7. Contact</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                For questions about these Terms of Service, please contact us through our website or customer support channels.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

TermsPage.displayName = "TermsPage";
