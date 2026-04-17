import { memo, useMemo } from "react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

const FRAME_WARRANTY_ROWS: { issue: string; covered: string; period: string }[] = [
  { issue: "Peeling paint and faded frame", covered: "Yes", period: "1 Year / 6 Months / 15 Days / 10 Days" },
  { issue: "Hinge problems", covered: "Yes", period: "1 Year / 6 Months / 15 Days / 10 Days" },
  { issue: "Nose pad discoloration", covered: "Yes", period: "1 Year / 6 Months / 15 Days / 10 Days" },
  { issue: "Broken temple / arm", covered: "Yes", period: "1 Year / 6 Months / 15 Days / 10 Days" },
  { issue: "Loose screws", covered: "Yes", period: "1 Year / 6 Months / 15 Days / 10 Days" },
];

const LENS_WARRANTY_ROWS: { issue: string; covered: string; period: string }[] = [
  { issue: "Lens coating peeling off", covered: "Yes", period: "1 Year" },
  { issue: "Lens discoloration / yellowing", covered: "Yes", period: "1 Year" },
  { issue: "Manufacturing defects on lenses", covered: "Yes", period: "15 Days" },
  { issue: "Broken / chipped lenses", covered: "No", period: "—" },
];

/**
 * Warranty Policy page – coverage tables, exclusions, claim process, terms
 */
export const WarrantyPage = memo(function WarrantyPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <Container className="max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Page title */}
          <div className="bg-gray-200 rounded-lg py-3 sm:py-4 px-4 sm:px-6 mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              WARRANTY POLICY
            </h1>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
            {/* Introductory text */}
            <section>
              <p className="text-sm sm:text-base mb-4">
                This warranty covers manufacturing defects in the product and applies to the original purchaser 
                from the date of delivery. Our commitment is to ensure that your eyewear meets the quality 
                standards we promise at the time of purchase.
              </p>
              <p className="text-sm sm:text-base">
                This warranty does not cover issues arising from normal wear and tear, misuse, accidental 
                damage, or any modification to the product. Please read the sections below for detailed 
                coverage on frames and lenses, exclusions, and the claims process.
              </p>
            </section>

            {/* Frame-related warranty table */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Frame Warranty Coverage
              </h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900">Issue Type</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900">Covered</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900">Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FRAME_WARRANTY_ROWS.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">{row.issue}</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">{row.covered}</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm">{row.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Lens-related warranty table */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Lens Warranty Coverage
              </h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900">Issue Type</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900">Covered</th>
                      <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900">Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LENS_WARRANTY_ROWS.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">{row.issue}</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">{row.covered}</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">{row.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Policy exclusions */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">What's Not Covered</h2>
              <p className="text-sm sm:text-base mb-3">The following are not covered under this warranty:</p>
              <ul className="list-disc pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <li>Scratches, breakages, or damages arising from normal wear and tear</li>
                <li>Misuse or improper handling of the product</li>
                <li>Damage caused by cleaning with harsh chemicals or improper care</li>
                <li>Any alterations made to the product after purchase</li>
                <li>Theft or loss of the product</li>
                <li>Cosmetic issues that do not affect functionality</li>
              </ul>
            </section>

            {/* Additional conditions */}
            <section>
              <p className="text-sm sm:text-base mb-3">
                Returns, refunds, and exchanges are subject to our Refund and Shipping policies. The warranty 
                does not cover issues caused by:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <li>Dropping or impact damage</li>
                <li>Exposure to extreme heat or moisture</li>
                <li>Use of the product outside its intended purpose</li>
              </ul>
            </section>

            {/* How to claim warranty */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">How to Claim Warranty</h2>
              <ul className="list-disc pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <li>Contact our customer support team via the contact options on our website or the number below</li>
                <li>Provide proof of purchase (order number or invoice)</li>
                <li>Our team will inspect the product to verify the claim</li>
                <li>Upon approval, we will arrange for replacement or repair as applicable</li>
                <li>Shipping costs for warranty claims may be at the customer's expense unless otherwise stated</li>
              </ul>
            </section>

            {/* Other terms and conditions */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Additional Terms</h2>
              <ul className="list-disc pl-6 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <li>This warranty applies to all products sold by us, unless explicitly excluded</li>
                <li>Proof of purchase is required for any warranty claim</li>
                <li>For international orders, warranty terms may vary—please contact support for details</li>
                <li>The company's decision on warranty claims is final</li>
                <li>Your use of our services is governed by our Privacy Policy and Terms of Service</li>
                <li>Any disputes are subject to the jurisdiction of the courts as per our Terms</li>
              </ul>
              <p className="mt-5 sm:mt-6 text-sm sm:text-base">
                For warranty-related queries or to initiate a claim, please contact us at{" "}
                <a href="tel:9976865666" className="text-teal-600 hover:text-teal-700 font-medium">
                  9976865666
                </a>
                .
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

WarrantyPage.displayName = "WarrantyPage";
