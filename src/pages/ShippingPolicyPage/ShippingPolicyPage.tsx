import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

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
      <main className="flex-1 py-12">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: February 2025</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Shipping Methods and Timeframes</h2>
              <p>
                We offer standard and express shipping options. Standard delivery typically takes 5–7 business days 
                from the date of dispatch. Express delivery typically takes 2–3 business days. Timeframes may vary 
                based on your location, product availability, and customs processing for international orders.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. Shipping Charges</h2>
              <p>
                Shipping charges are calculated at checkout based on your delivery address, the weight and dimensions 
                of your order, and the selected shipping method. We may offer free standard shipping on orders 
                above a certain value; such promotions will be clearly displayed during checkout.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. Order Processing</h2>
              <p>
                Orders are processed within 1–2 business days after payment confirmation. You will receive an email 
                with tracking information once your order has been shipped. Prescription orders may require additional 
                processing time for verification and lens preparation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Delivery Areas</h2>
              <p>
                We currently ship within India and to select international destinations. Delivery availability and 
                timeframes depend on your country. Please enter your address at checkout to see available options 
                and estimated delivery dates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. Tracking Your Order</h2>
              <p>
                Once your order is shipped, you will receive a tracking number via email. You can use this number on 
                our website or the carrier’s website to track your shipment. If you do not receive tracking information 
                within the expected timeframe, please contact our customer support team.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">6. Failed Delivery and Lost Packages</h2>
              <p>
                If a delivery attempt fails (e.g., incorrect address, recipient unavailable), the carrier will typically 
                make additional attempts or hold the package at a nearby facility. If your package is lost in transit, 
                please contact us and we will work with the carrier to resolve the issue and arrange a replacement or 
                refund as appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">7. Contact Us</h2>
              <p>
                For questions about shipping, delivery, or to update your delivery address after placing an order, 
                please contact our customer support team through the options provided on our website.
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
