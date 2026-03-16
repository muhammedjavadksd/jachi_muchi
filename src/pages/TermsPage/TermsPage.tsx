import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

/**
 * Terms of Service page
 */
export const TermsPage = memo(function TermsPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-12">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: February 2025</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. 
                If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. Use of Service</h2>
              <p>
                You may use our website and services only for lawful purposes and in accordance with these Terms. 
                You agree not to use the service to violate any applicable laws, infringe on the rights of others, 
                or transmit any harmful or malicious content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. Account and Registration</h2>
              <p>
                When you create an account with us, you must provide accurate and complete information. 
                You are responsible for safeguarding your password and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Products and Orders</h2>
              <p>
                We reserve the right to limit quantities, discontinue products, or modify product offerings at any time. 
                All orders are subject to acceptance and availability. We may refuse or cancel any order for any reason.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images, is the property of our company 
                or its content suppliers and is protected by intellectual property laws. You may not reproduce or use 
                such content without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising out of or related to your use of our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">7. Contact</h2>
              <p>
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
