import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

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
      <main className="flex-1 py-12">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: February 2025</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Eligibility for Refunds</h2>
              <p>
                We want you to be completely satisfied with your purchase. If you are not satisfied, you may be eligible 
                for a refund or exchange within 30 days of delivery, subject to the conditions below. Products must 
                be unused, in original packaging, and in resalable condition.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. How to Request a Refund</h2>
              <p>
                To request a refund, please contact our customer support team with your order number and reason for 
                the return. We will provide you with a return authorization and instructions for shipping the product 
                back. Once we receive and inspect the item, we will notify you of the approval or rejection of your refund.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. Refund Processing</h2>
              <p>
                Approved refunds will be processed within 5–7 business days to your original method of payment. 
                Depending on your bank or card issuer, it may take additional time for the refund to appear on your 
                statement. For exchanges, we will ship the replacement item once we receive the returned product.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Non-Refundable Items</h2>
              <p>
                Certain items may not be eligible for refund, including personalized or custom-made products, 
                prescription eyewear that has been used or altered, and items marked as final sale. Please check 
                product pages for specific eligibility.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. Return Shipping</h2>
              <p>
                Customers are responsible for return shipping costs unless the return is due to our error or a 
                defective product. We recommend using a trackable shipping service and retaining proof of postage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">6. Contact Us</h2>
              <p>
                For any questions about our Refund Policy or to initiate a return, please reach out to our customer 
                support team through the contact options on our website.
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
