import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

const SIZE_CHART_ROWS = [
  { lensWidth: 46, bridge: 20, temple: 140 },
  { lensWidth: 48, bridge: 18, temple: 142 },
  { lensWidth: 50, bridge: 19, temple: 140 },
  { lensWidth: 52, bridge: 20, temple: 145 },
  { lensWidth: 54, bridge: 21, temple: 145 },
  { lensWidth: 56, bridge: 22, temple: 148 },
  { lensWidth: 58, bridge: 21, temple: 150 },
  { lensWidth: 60, bridge: 23, temple: 155 },
];

const FACE_SIZES = [
  { label: "Small face", lens: "46-50", bridge: "16-20", temple: "135-140", size: "Small" },
  { label: "Medium face", lens: "51-54", bridge: "17-21", temple: "140-145", size: "Medium" },
  { label: "Large face", lens: "55-58", bridge: "18-22", temple: "145-150", size: "Large" },
  { label: "Oversized face", lens: "59-62", bridge: "19-23", temple: "150-155", size: "Oversized" },
];

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: "How to measure glasses",
    items: [
      {
        question: "How to measure glasses?",
        answer:
          "The measurements listed for eyeglasses are in millimeters: lens width, bridge, and temple length. You can calculate the total frame width by adding the lens width and bridge width, then adding the distance between the lenses. Lens width is the horizontal width of one lens. Bridge is the distance between the two lenses over the nose. Temple length is the length of the arm from the hinge to the tip that rests on your ear. These three numbers are usually printed on the inside of the temple arm (e.g., 52-18-140).",
      },
    ],
  },
  {
    title: "Size",
    items: [
      {
        question: "What size glasses should I choose?",
        answer:
          "Choose a size that matches your face measurements. Check the lens width, bridge, and temple length on your current comfortable pair, or use our size guide. Small faces suit lens width 46–50mm; medium 51–54mm; large 55–58mm; oversized 59–62mm. When in doubt, try our virtual try-on or visit a store.",
      },
      {
        question: "Are all sizes the same?",
        answer:
          "No. Frame dimensions vary by style and brand. Always check the three key measurements (lens width, bridge, temple length) on the product page rather than relying on S/M/L labels alone.",
      },
      {
        question: "What if the size is wrong?",
        answer:
          "If your glasses don’t fit, you can return or exchange them within our return window. See our Return Policy for conditions. We recommend measuring an existing pair or using the size guide before ordering.",
      },
      {
        question: "What is a standard size?",
        answer:
          "A common ‘standard’ range is lens width 50–54mm, bridge 17–21mm, temple 140–145mm. Many adults fall into this range, but fit still depends on your face shape and preference.",
      },
      {
        question: "What should I pay attention to when buying glasses?",
        answer:
          "Focus on lens width, bridge width, and temple length; frame material and weight; and your face shape. Ensure the bridge sits comfortably on your nose and the temples don’t press too hard behind your ears.",
      },
      {
        question: "Does the size change according to the frame type?",
        answer:
          "Yes. Full-rim, semi-rimless, and rimless frames can fit differently even with similar measurements. Cat-eye, round, and rectangular shapes also affect how the frame looks and feels. Always check the specific product dimensions.",
      },
      {
        question: "How to choose glasses by face shape?",
        answer:
          "Round faces often suit angular or rectangular frames; square faces suit round or oval frames; oval faces can wear most shapes; heart-shaped faces often look good in bottom-heavy or cat-eye styles. Use our style guide or try-on tool for suggestions.",
      },
      {
        question: "How to choose glasses for specific problems?",
        answer:
          "For high prescriptions, consider smaller lens sizes and high-index lenses to reduce thickness. For narrow bridges, look for adjustable nose pads or a narrow bridge width. For wide or narrow faces, filter by total frame width on the product page.",
      },
    ],
  },
  {
    title: "Order",
    items: [
      {
        question: "Is it possible to cancel or change my order?",
        answer:
          "You can cancel or change your order only before it is shipped. Once the order is in processing or dispatched, changes may not be possible. Contact customer service as soon as possible with your order number to request cancellation or changes.",
      },
      {
        question: "What should I do if my order is not coming?",
        answer:
          "Check the tracking information first. If the estimated delivery date has passed or the status hasn’t updated, contact our customer service with your order number. We will work with the carrier to locate your package and resolve the issue.",
      },
      {
        question: "How can I track my order?",
        answer:
          "After your order is shipped, you will receive an email with a tracking number and link. You can also log in to your account and view order history to see the current status and tracking details.",
      },
      {
        question: "Is it possible to order with an old prescription?",
        answer:
          "We accept prescriptions within their validity period (usually 1–2 years for adults, less for children, as per local guidelines). If your prescription is old, we recommend getting an updated eye exam before ordering prescription lenses.",
      },
    ],
  },
  {
    title: "Return / Exchange",
    items: [
      {
        question: "What should I pay attention to when returning or exchanging?",
        answer:
          "Keep the product unused and in original packaging with all tags and accessories. Ensure you are within the return window. Prescription glasses may have different rules—check our Refund Policy. Include the original invoice or order details.",
      },
      {
        question: "How many days do I have to return or exchange?",
        answer:
          "Our standard return and exchange window is 30 days from delivery. Some products or promotions may have different terms; check the product page and your order confirmation for the exact period.",
      },
      {
        question: "In what condition should the product be returned?",
        answer:
          "Products must be unused, in resalable condition, and in original packaging. Frames should not be scratched or damaged. Prescription items that have been used or altered may not be eligible for return. See our Refund Policy for full details.",
      },
      {
        question: "How can I return / exchange the product?",
        answer:
          "Initiate a return or exchange from your account under Order History, or contact customer service. We will provide a return authorization and instructions. Pack the item securely, use the recommended shipping method, and keep proof of postage until the refund is processed.",
      },
      {
        question: "How will the refund be made?",
        answer:
          "Refunds are processed to the original payment method within 5–7 business days after we receive and inspect the returned item. Depending on your bank or card issuer, it may take additional days for the amount to appear on your statement.",
      },
    ],
  },
  {
    title: "Guarantee / After Sales",
    items: [
      {
        question: "What is the warranty period of the products?",
        answer:
          "Frame warranty periods vary by product; typically we offer 1 year against manufacturing defects. Lenses may have separate warranty terms. Check the product page or packaging for the specific warranty duration.",
      },
      {
        question: "What does the warranty cover?",
        answer:
          "Warranty typically covers manufacturing defects such as frame breakage, loose hinges, or lens coating issues under normal use. It does not cover damage from misuse, accidents, or normal wear and tear.",
      },
      {
        question: "Is there a repair service?",
        answer:
          "Yes. We offer repair services for eligible issues under warranty. For out-of-warranty repairs, we may still assist for a fee. Contact customer service with your order details and a description of the issue to get repair options.",
      },
      {
        question: "How can I use the warranty?",
        answer:
          "Contact our customer service with your order number, product details, and a description (and photos if helpful) of the defect. We will guide you through the claim process and may ask you to ship the product for inspection before repair or replacement.",
      },
    ],
  },
  {
    title: "Prescription",
    items: [
      {
        question: "How to read prescription?",
        answer:
          "A prescription typically includes OD (right eye) and OS (left eye), and values for SPH (sphere), CYL (cylinder), AXIS, and sometimes ADD (addition for reading) and PRISM. SPH indicates nearsightedness or farsightedness; CYL and AXIS indicate astigmatism. Our team can help you interpret your prescription when you order.",
      },
      {
        question: "What is the difference between SPHERE (SPH), CYLINDER (CYL), AXIS, ADD and PRISM?",
        answer:
          "SPH corrects basic near/farsightedness. CYL and AXIS together correct astigmatism (CYL is the power, AXIS is the angle in degrees). ADD is the extra power for reading, used in bifocals or progressives. PRISM corrects alignment issues (e.g., double vision). Your optometrist will fill these in on your prescription.",
      },
      {
        question: "Is it possible to send an old prescription or photo?",
        answer:
          "We accept a clear photo or scan of your current prescription. It must be legible and within the validity period. Upload it during checkout or send it to customer service with your order number. We cannot use expired or unclear prescriptions.",
      },
      {
        question: "How long is the prescription valid?",
        answer:
          "Prescription validity varies by region and age. Generally, adult prescriptions are considered valid for 1–2 years unless your eye care professional specifies otherwise. Children’s prescriptions may need more frequent updates. We follow local guidelines when accepting prescriptions.",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        question: "How can I contact customer service?",
        answer:
          "You can reach us via the Contact Us form on our website, by email, or by phone. Log in to your account for faster assistance. We also have a live chat option during business hours.",
      },
      {
        question: "What are your working hours?",
        answer:
          "Our customer service team is available Monday–Saturday, 9:00 AM to 6:00 PM (IST). Email and contact form submissions are responded to within 24–48 hours. Check the Contact Us page for the latest hours and holidays.",
      },
      {
        question: "Where are you located?",
        answer:
          "We are headquartered in India and serve customers across the country and in select international regions. For our physical store addresses and service centers, please visit the Store Locator or Contact Us page on our website.",
      },
    ],
  },
];

/**
 * FAQ Page with Size Guide and collapsible FAQ by category
 */
export const FAQPage = memo(function FAQPage(): JSX.Element {
  const [openKey, setOpenKey] = useState<string | null>("How to measure glasses?");
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  const toggle = useCallback((key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-8 pb-16">
        <Container className="max-w-4xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-teal-600">TOP</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">FAQ & Size Guide</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-10">FAQ & Size Guide</h1>

          {/* Size Guide */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Size guide</h2>
            <p className="text-gray-600 mb-6">How to measure glasses</p>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <p className="text-gray-700 mb-4">
                Eyeglass dimensions are given in millimeters: <strong>lens width</strong>, <strong>bridge</strong>, and <strong>temple length</strong>.
                Total frame width is the horizontal distance across the front of the frame. Lens width is the width of one lens.
                Bridge is the distance between the two lenses over the nose. Temple length is the length of the arm from the hinge to the temple tip.
                These are often printed on the inside of the temple (e.g. 52-18-140).
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 sm:grid-cols-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Lens width</span> – width of one lens
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Bridge</span> – distance between lenses
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Temple length</span> – arm length to ear
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Frame width</span> – total front width
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Lens width (mm)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Bridge (mm)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Temple length (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART_ROWS.map((row, i) => (
                    <tr key={i} className="border-t border-gray-200 even:bg-gray-50">
                      <td className="py-3 px-4">{row.lensWidth}</td>
                      <td className="py-3 px-4">{row.bridge}</td>
                      <td className="py-3 px-4">{row.temple}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Glasses size chart</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FACE_SIZES.map((face) => (
                <div
                  key={face.size}
                  className="bg-white border border-gray-200 rounded-xl p-5 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-2xl font-bold">
                    {face.size[0]}
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">{face.label}</p>
                  <p className="text-sm text-gray-600">Lens width {face.lens}</p>
                  <p className="text-sm text-gray-600">Bridge {face.bridge}</p>
                  <p className="text-sm text-gray-600">Temple length {face.temple}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Accordion */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ_DATA.map((category) => (
                <div key={category.title}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6 first:mt-0">
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isOpen = openKey === item.question;
                      return (
                        <div
                          key={item.question}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => toggle(item.question)}
                            className="w-full flex items-center justify-between py-4 px-5 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                            aria-expanded={isOpen}
                          >
                            <span>{item.question}</span>
                            <span
                              className={`shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                              aria-hidden
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </span>
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 pt-0">
                              <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

FAQPage.displayName = "FAQPage";
