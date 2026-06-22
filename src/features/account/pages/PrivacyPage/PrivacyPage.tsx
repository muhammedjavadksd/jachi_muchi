import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "@/shared/components";

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
      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <Container className="max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-6 sm:mb-8">Last updated: February 2025</p>

          <div className="prose prose-gray max-w-none space-y-6 sm:space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-sm sm:text-base">
                We collect information you provide directly to us, including when you create an account, place an order, 
                subscribe to our newsletter, or contact customer support. This may include your name, email address, 
                phone number, shipping address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-sm sm:text-base">
                We use the information we collect to process orders, send order confirmations and updates, respond to 
                your inquiries, improve our website and services, send promotional communications (with your consent), 
                and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
              <p className="text-sm sm:text-base">
                We do not sell your personal information. We may share your information with trusted service providers 
                who assist us in operating our website and conducting our business, such as payment processors and 
                shipping carriers. All third parties are contractually obligated to keep your information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
              <p className="text-sm sm:text-base">
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, alteration, disclosure, or destruction. While we strive to protect your 
                information, no method of transmission over the Internet is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">5. Cookies and Tracking</h2>
              <p className="text-sm sm:text-base">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                and personalize content. You can manage cookie preferences through your browser settings at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-sm sm:text-base">
                Depending on your location, you may have the right to access, correct, or delete your personal data, 
                or to object to or restrict certain processing activities. You may also withdraw consent where we 
                rely on it. Please contact us to exercise any of these rights.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
              <p className="text-sm sm:text-base">
                If you have questions about this Privacy Policy or our data practices, please reach out to us 
                through our website or the contact details provided in our customer support section. We're here 
                to help with any concerns you may have.
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
