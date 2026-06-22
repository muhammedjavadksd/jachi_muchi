import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "@/shared/components";

const HEADER_SPACER_HEIGHT = 140;

/**
 * Shipping Policy page
 */
export const ShippingPolicyPage = memo(function ShippingPolicyPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <Container className="max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
          <p className="text-sm text-gray-500 mb-6 sm:mb-8">Last updated: February 2025</p>

          <div className="prose prose-gray max-w-none space-y-6 sm:space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">1. Shipping Methods and Timeframes</h2>
              <p className="text-sm sm:text-base">
                We offer standard and express shipping options to suit your needs. Standard delivery typically takes 
                5–7 business days from the date of dispatch, while express delivery takes 2–3 business days. 
                Timeframes may vary based on your location, product availability, and customs processing for 
                international orders.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">2. Shipping Charges</h2>
              <p className="text-sm sm:text-base">
                Shipping charges are calculated at checkout based on your delivery address, the weight and 
                dimensions of your order, and your selected shipping method. We may offer free standard shipping 
                on orders above a certain value—any such promotions will be clearly displayed during checkout.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">3. Order Processing</h2>
              <p className="text-sm sm:text-base">
                Orders are typically processed within 1–2 business days after payment confirmation. You'll receive 
                an email with tracking information once your order has been shipped. Please note that prescription 
                orders may require additional processing time for verification and lens preparation.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">4. Delivery Areas</h2>
              <p className="text-sm sm:text-base">
                We currently ship within India and to select international destinations. Delivery availability and 
                timeframes depend on your location. Enter your address at checkout to see available options and 
                estimated delivery dates for your order.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">5. Tracking Your Order</h2>
              <p className="text-sm sm:text-base">
                Once your order is shipped, you'll receive a tracking number via email. You can use this number 
                on our website or the carrier's website to monitor your shipment's progress. If you don't receive 
                tracking information within the expected timeframe, please contact our customer support team.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">6. Failed Delivery and Lost Packages</h2>
              <p className="text-sm sm:text-base">
                If a delivery attempt fails due to incorrect address or recipient unavailability, the carrier will 
                typically make additional attempts or hold the package at a nearby facility. If your package is lost 
                in transit, please contact us and we'll work with the carrier to resolve the issue and arrange a 
                replacement or refund as appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
              <p className="text-sm sm:text-base">
                For questions about shipping, delivery, or to update your delivery address after placing an order, 
                please contact our customer support team through the options provided on our website. We're here 
                to help ensure your order reaches you smoothly.
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

ShippingPolicyPage.displayName = "ShippingPolicyPage";
