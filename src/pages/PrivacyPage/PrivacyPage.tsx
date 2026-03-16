import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

/**
 * Privacy Policy page
 */
export const PrivacyPage = memo(function PrivacyPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-12">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: February 2025</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, place an order, 
                subscribe to our newsletter, or contact customer support. This may include your name, email address, 
                phone number, shipping address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to process orders, send order confirmations and updates, respond to 
                your inquiries, improve our website and services, send promotional communications (with your consent), 
                and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with service providers who 
                assist us in operating our website and conducting our business (e.g., payment processors, shipping 
                carriers), as long as they agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
                the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze site traffic, and 
                personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">6. Your Rights</h2>
              <p>
                Depending on your location, you may have the right to access, correct, or delete your personal data, 
                or to object to or restrict certain processing. You may also withdraw consent where we rely on it. 
                Contact us to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">7. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us through 
                our website or the contact details provided in our customer support section.
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

PrivacyPage.displayName = "PrivacyPage";
