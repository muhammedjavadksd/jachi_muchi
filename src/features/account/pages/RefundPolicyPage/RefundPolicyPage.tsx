import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "@/shared/components";

const HEADER_SPACER_HEIGHT = 140;

/**
 * Refund Policy page
 */
export const RefundPolicyPage = memo(function RefundPolicyPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <Container className="max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Refund Policy</h1>
          <p className="text-sm text-gray-500 mb-6 sm:mb-8">Last updated: February 2025</p>

          <div className="prose prose-gray max-w-none space-y-6 sm:space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">1. Eligibility for Refunds</h2>
              <p className="text-sm sm:text-base">
                Your satisfaction matters to us. If you're not completely satisfied with your purchase, you may be 
                eligible for a refund or exchange within 30 days of delivery, subject to the conditions below. All 
                returned products must be unused, in their original packaging, and in resalable condition.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">2. How to Request a Refund</h2>
              <p className="text-sm sm:text-base">
                To request a refund, please contact our customer support team with your order number and the reason 
                for the return. We'll provide you with a return authorization and detailed instructions for shipping 
                the product back. Once we receive and inspect the item, we'll notify you of the approval or rejection 
                of your refund.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">3. Refund Processing</h2>
              <p className="text-sm sm:text-base">
                Approved refunds are typically processed within 5–7 business days to your original method of payment. 
                Please note that depending on your bank or card issuer, it may take additional time for the refund 
                to appear on your statement. For exchanges, we'll ship the replacement item once we receive the 
                returned product.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">4. Non-Refundable Items</h2>
              <p className="text-sm sm:text-base">
                Certain items may not be eligible for refund, including personalized or custom-made products, 
                prescription eyewear that has been used or altered, and items marked as final sale. Please refer 
                to individual product pages for specific eligibility information.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">5. Return Shipping</h2>
              <p className="text-sm sm:text-base">
                Customers are responsible for return shipping costs unless the return is due to our error or a 
                defective product. We strongly recommend using a trackable shipping service and retaining your 
                proof of postage until the refund is processed.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
              <p className="text-sm sm:text-base">
                For any questions about our Refund Policy or to initiate a return, please reach out to our 
                dedicated customer support team through the contact options available on our website. We're 
                always happy to assist you.
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

RefundPolicyPage.displayName = "RefundPolicyPage";
